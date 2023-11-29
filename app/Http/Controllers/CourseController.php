<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Turn;
use App\Models\UrlData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CourseController extends Controller
{
    /**
     * Guarda un nuevo curso
     */
    public function saveCourse(Request $request)
    {
        $resp = $this->verifyTokenForm($request);

        if ($resp['ok']) {
            try {
                $resp['ok'] = false;

                if ($request->hasFile('img')) {
                    $urlImg = $request->file('img')->store('/img/curse', 'public');       //Guardamos la imagen enviada en la carpeta public/img
                } else {
                    $urlImg = 'img/curse/default.jpg';
                }

                // Step 1: Create and save UrlData
                $urlData = new UrlData([
                    'url' => $urlImg,
                    'type' => 'imagen',
                    'section' => 'cursos',
                    'description' => $request->input('title'),
                ]);

                if ($urlData->save()) {
                    // Step 2: Retrieve the ID of the created UrlData
                    $urlDataId = $urlData->id;

                    // Step 3: Create a new Course using the retrieved url_data_id
                    $newCurse = Course::create([
                        'title' => $request->input('title'),
                        'price' => $request->input('price'),
                        'features' => $request->input('features'),
                        'price_reservation' =>  $request->input('price_reservation'),
                        'url_data_id' => $urlDataId, // Use the retrieved url_data_id here
                        'cant_class' => $request->input('cantClass')
                    ]);

                    if ($newCurse) {
                        $course = $this->getCourse(true);
                        $resp['data'] = $course['data'];
                        $resp['message'] = 'Curso creado correctamente!'; // Success message
                        $resp['ok'] = true;
                    } else {
                        $resp['message'] = 'Error al crear el curso!';
                    }
                } else {
                    $resp['message'] = 'Error al crear la UrlData!';
                }
            } catch (\Exception $e) {
                $resp['menssage'] = 'Error en el servidor: ' . $e->getMessage(); // retornar errores del servidor
            }
        }

        return $resp;
    }





    /**
     * Edita un curso
     */
    public function editCourse(Request $request)
    {
        $resp = $this->verifyTokenForm($request);
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                $course = Course::find($request->input('id'));          //Obtenemos la url de la imagen del curso
                $urlData = $course->url_data;

                if ($request->hasFile('archive')) {
                    $urlImg = $request->file('archive')->store('/img/curse', 'public');       //Guardamos la imagen enviada en la carpeta public/img
                    if ($urlData) {
                        $url = str_replace('storage', 'public', $urlData->url);
                        if ($url != 'img/curse/default.jpg') {
                            Storage::disk('public')->delete($url);
                        }
                        $urlData->update([
                            'url' => $urlImg,
                            'type' => 'imagen',
                            'section' => 'cursos',
                            'description' => $request->input('title'),
                        ]);
                    } else {
                        UrlData::create([
                            'url' => $urlImg,
                            'type' => 'imagen',
                            'section' => 'course',
                            'description' => 'Imagen del cruso ' . $course->title,
                        ]);
                        $course->update([
                            'url_data_id' => UrlData::latest()->first()->id,
                        ]);
                    }
                }

                $course->update([
                    'title' => $request->input('title'),
                    'price' => $request->input('price'),
                    'features' => $request->input('features'),
                    'price_reservation' =>  $request->input('price_reservation'),
                    'cant_class' => $request->input('cantClass'),
                ]);

                $course = $this->getCourse(true);
                $resp['data'] = $course['data'];                                 //Devuelvo el curso creado [id, urlimg, title, price, description]
                $resp['message'] = 'Curso editado correctamente!';              //exito!!!!!! 😎
                $resp['ok'] = true;
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();     //Devuelvo errores
            }
        }
        return $resp;
    }

    /**
     * Devuelve todos los cursos
     */
    public function deleteCourse()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                $course = Course::where('id', $resp['data']['id'])->first();

                $url = str_replace('storage', 'public', $course->url_data->url);

                if ($url != 'img/curse/default.jpg') {
                    Storage::disk('public')->delete($url);
                }

                $course->delete();
                $course->url_data->delete();

                $course = $this->getCourse(true);
                $resp['data'] = $course['data'];                                                       //Devuelvo el array de cursos
                $resp['message'] = 'Curso eliminado correctamente!';                              //exito!!!!!! 😎
                $resp['ok'] = true;
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();                     //Devuelvo errores
            }
        }
        return $resp;
    }

    /**
     * Devuelve todos los cursos
     */
    public function getCourse($callInt = false)
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                // Modificación: Incluye también los cursos que han sido eliminados (soft delete)
                if ($callInt) {
                    $arrayCurse = Course::with('url_data')->get();
                } else {
                    $arrayCurse = Course::with('url_data')->withTrashed()->get();
                }

                // Ordenar la colección de acuerdo a si deleted_at es nulo
                $arrayCurse = $arrayCurse->sortBy(function ($course) {
                    return $course->deleted_at ? 1 : 0;
                });

                // Convertir la colección a un array
                $arrayCurse = $arrayCurse->values()->all();

                $i = 0; // Inicializar el valor incremental
                foreach ($arrayCurse as &$curse) {
                    $arrayCurseFeatures = array_map('trim', explode('&', $curse['features']));
                    $filterCurse = array_filter($arrayCurseFeatures);
                    $curse['features'] = array_map(function ($curse) use (&$i) {
                        $result = ['key' => $i, 'label' => $curse];
                        $i++; // Incrementar el valor para la próxima iteración
                        return $result;
                    }, $filterCurse);
                }
                $resp['data'] = $arrayCurse;                                                    //Devuelvo el array de cursos
                $resp['message'] = 'Cursos obtenidos correctamente!';                              //exito!!!!!! 😎
                $resp['ok'] = true;
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();                     //Devuelvo errores
            }
        }

        return $resp;
    }


    /**
     * Activar o desactivar un curso
     */

    public function deactivateCourse()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;


                $idCourse = $resp['data']['id'];
                $course = Course::withTrashed()->find($idCourse);
                // $url = str_replace('storage', 'public', $course->url_data->url);

                if ($resp['data']['action'] === 'deactivate') {
                    $course->update(['deleted_at' => now()]);
                } else {
                    $course->deleted_at = null;
                    $course->save();
                }

                // if ($url != 'img/curse/default.jpg') {
                //     Storage::disk('public')->delete($url);
                // }

                // $course->delete();
                // $course->url_data->delete();

                $course = $this->getCourse();
                $resp['data'] = $course['data'];                                                       //Devuelvo el array de cursos
                $resp['message'] = 'Curso eliminado correctamente!';                              //exito!!!!!! 😎
                $resp['ok'] = true;
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();                     //Devuelvo errores
            }
        }
        return $resp;
    }

    // /**
    //  * Guarda un nuevo curso
    //  */
    // public function desactivateCourse()
    // {
    //     $resp = $this->verifyToken();
    //     if ($resp['ok']) {

    //         try {
    //             $resp['ok'] = false;
    //             $data = $resp['data'];
    //             $course = Course::where('id', $data['id'])->first();
    //             $course->update([
    //                 'deleted_at' => Carbon::now(),
    //             ]);
    //             $course = $this->getCourse(true);
    //             $resp['data'] = $course['data'];
    //             $resp['message'] = 'Curso desactivado correctamente!';         //exito!!!!!! 😎
    //             $resp['ok'] = true;
    //         } catch (\Exception $e) {
    //             $resp['message'] = 'Error en el servidor: ' . $e->getMessage();     //Devuelvo errores
    //         }
    //     }

    //     return $resp;
    // }

    // /**
    //  * Guarda un nuevo curso
    //  */
    // public function activateCourse()
    // {
    //     $resp = $this->verifyToken();
    //     if ($resp['ok']) {

    //         try {
    //             $resp['ok'] = false;
    //             $data = $resp['data'];
    //             $course = Course::where('id', $data['id'])->first();
    //             $course->restore();
    //             $course = $this->getCourse(true);
    //             $resp['data'] = $course['data'];
    //             $resp['message'] = 'Curso desactivado correctamente!';         //exito!!!!!! 😎
    //             $resp['ok'] = true;
    //         } catch (\Exception $e) {
    //             $resp['message'] = 'Error en el servidor: ' . $e->getMessage();     //Devuelvo errores
    //         }
    //     }

    //     return $resp;
    // }

}
