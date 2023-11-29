<?php

namespace App\Http\Controllers;

use App\Models\DataHome;
use App\Models\UrlData;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class UrlDataController extends Controller
{
    /**
     * Guardo los datos de la pagina de inicio
     */
    // public function updateHome(Request $request)
    // {
    //     $resp = $this->verifyToken();
    //     if ($resp['ok']) {
    //         try {
    //             $resp['ok'] = false;                                                                 //Inicializo la respuesta en false
    //             $data = $resp['data'];                                                               //Obtengo datos del json
    //             $validator = Validator::make($data, [
    //                 'urlInstruct' => 'required',
    //                 'location' => 'required',
    //                 'cellphone' => 'required',
    //             ]);
    //             if ($validator->fails()) {
    //                 $errors = $validator->errors();
    //                 $resp['message'] = $errors->first();
    //             } else {
    //                 if ($request->hasFile('pdf')) {
    //                     $urlInstruct = $request->file('pdf')->store('/pdf', 'public');                //Guardamos la imagen enviada en la carpeta public/img
    //                     $updateHome = DataHome::find($data['id']);                                    //Busco al home
    //                     $updateHome->update([
    //                         'urlInstruct' => $urlInstruct,
    //                         //TODO proxima implementacion
    //                         //    'location' => $data['name'],
    //                         //    'cellphone' => $data['lastname'],
    //                     ]);
    //                     $resp['data'] = [];
    //                     $resp['message'] = 'Home actualizado correctamente';
    //                     $resp['ok'] = true;
    //                 }
    //             }
    //         } catch (\Exception $e) {
    //             $resp['message'] = 'Error en el servidor: ' . $e->getMessage();           //Devuelvo errores
    //         }
    //     }
    //     return $resp;
    // }

    /**
     * Devuelve todos los datos para el home
     */
    public function getHome(CourseController $courseController)
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;                                                    //Inicializo la respuesta en false
                $imgUs = $this->getUs();
                $arrayCurse = $courseController->getCourse(true);
                $imgCarrosuel = $this->getFlota();
                $arrayVideo = $this->getVideo();
                $urlInstruct = $this->getInstructivo();

                $resp['data'] = [
                    'imgCarrosuel' => $imgCarrosuel,
                    'imgUs' => $imgUs,
                    'arrayCurse' => $arrayCurse['data'],
                    'urlInstructive' => $urlInstruct,
                    'arrayVideo' => $arrayVideo,
                ];
                $resp['message'] = 'Datos del home obtenidos correctamente';
                $resp['ok'] = true;
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();           //Devuelvo errores
            }
        }
        return $resp;
    }

    public function deleteUrlData()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                $urlData = UrlData::find($resp['data']['id']);

                $url = str_replace('storage', 'public', $urlData->url);
                Storage::disk('public')->delete($url);

                $resp['data'] = $urlData;
                $urlData->delete();
                $resp['message'] = 'Item eliminado correctamesnte!';                              //exito!!!!!! 😎
                $resp['ok'] = true;
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();                     //Devuelvo errores
            }
        }
        return $resp;
    }

    public function addUrlData(Request $request)
    {
        $resp = $this->verifyTokenForm($request);
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                if ($request->hasFile('img')) {
                    $url = $request->file('img')->store('/img/carrusel', 'public');     //Guardamos la imagen enviada en la carpeta public/img

                    // if(count($request->input('description')) > 0){
                    //     $description = $request->input('description');
                    // }else{
                    //     $description = $request->input('type');
                    // }

                    $newUrlData = UrlData::create([
                        'section' => $request->input('section'),
                        'type' => $request->input('type'),
                        'url' => $url,
                        'description' => $request->input('description'),
                    ]);
                }
                if ($newUrlData) {
                    $resp['data'] = $newUrlData;                                               //Devuelvo el curso creado [id, urlimg, title, price, description]
                    $resp['message'] = 'Imagen creada correctamente!';                    //exito!!!!!! 😎
                    $resp['ok'] = true;
                } else {
                    $resp['message'] = 'Error al crear la imagen!';
                }
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();                //Devuelvo errores
            }
        }
        return $resp;
    }

    /**
     * Devuelve todos los datos para el home
     */
    public function editHome(Request $request)
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false; // Inicializo la respuesta en false
                $requestData = $request->json()->all(); // Obtiene todos los datos JSON

                // Accede a los datos dentro del objeto JSON
                $urlDataId = $requestData['url_data']['id'];
                $archive = $requestData['archive'];

                // Realiza las operaciones necesarias con los datos

                $urlData = UrlData::where('id', $urlDataId)->first();

                if ($request->hasFile('archive')) {
                    $url = str_replace('storage', 'public', $urlData->url);
                    Storage::disk('public')->delete($url);
                    $urlImg = $request->file('archive')->store('/img/curse', 'public');
                } else {
                    $urlImg = $urlData->url;
                }

                $urlData->update([
                    'section' => 'cursis',
                    'type' => 'imagen',
                    'url' => $urlImg,
                    'description' => 'curso 1',
                ]);

                $resp['message'] = 'Datos del home actualizados correctamente';
                $resp['ok'] = true;
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();
            }
        }

        return response()->json($resp);
    }

    /**
     * Funcion que recupera a todos los usuarios con ciertos roles
     * @param string $password
     * @return array
     */
    public function getUs()
    {
        try {
            $resp = User::whereHas('roles', function ($query) {
                $query->where('name', 'Administrador')
                    ->orWhere('name', 'Comunicación y Administración')
                    ->orWhere('name', 'Instructor');
            })
                ->join('roles_users AS rs', 'users.id', 'rs.user_id')                      //Busco el rol del usuario
                ->join('roles AS r', 'rs.role_id', 'r.id')                                 //Busco el nombre del rol
                ->leftJoin('url_data AS ud', 'users.url_data_id', 'ud.id')                     //Busco la foto del usuario
                ->select(
                    'users.id AS id',
                    'ud.url AS photoUser',
                    'ud.id AS idPhotoUser',
                    'r.name AS roleNames',
                    DB::raw('CONCAT(users.name, " ", users.lastname) AS fullNames'),
                )
                ->whereRaw('(SELECT MIN(rank) FROM roles_users AS ru JOIN roles AS rr ON ru.role_id = rr.id WHERE ru.user_id = users.id) = r.rank')
                ->groupBy('users.id', 'ud.id',  'users.name', 'users.lastname', 'ud.url', 'r.name')
                ->orderBy('r.rank', 'asc')
                ->get();
            // $resp = $resp->map(function ($user) {
            //     $user->roleNames = collect(explode(' ', $user->roleNames))->filter(function ($role) {
            //         return $role !== 'Usuario';
            //     })->implode(' ');
            //     return $user;
            // });
        } catch (\Exception $e) {
            $resp = 'Error en el servidor: ' . $e->getMessage();           //Devuelvo errores
        }

        return $resp;
    }

    public function getFlota()
    {
        return UrlData::where('section', 'flota')->get();
    }

    public function getVideo()
    {
        return UrlData::where('section', 'videos')->get();
    }

    public function getInstructivo()
    {
        return UrlData::where('section', 'home')->first();
    }
}
