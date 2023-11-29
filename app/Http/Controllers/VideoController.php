<?php

namespace App\Http\Controllers;

use App\Models\Video;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VideoController extends Controller
{
    /**
     * Edita un curso
     */
    public function editVideo(Request $request)
    {
        $resp = $this->verifyToken($request);
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                $data = $resp['data'];                                                               //Obtengo datos del json
                $validator = Validator::make($data, [
                    'id' => 'required',
                    'urlvideo' => 'required',
                    'title' => 'required',
                ]);
                if ($validator->fails()) {                                                      //Validamos que no exista el usuario
                    $errors = $validator->errors();
                    $resp['message'] = $errors->first();                                       //Devuelvo el dato repetido
                } else {
                    $video = Video::where('id', $data['id'])->first();                //Obtenemos la url de la imagen del curso
                    $video->update([
                        'urlvideo' => $data['urlvideo'],
                        'title' => $data['title'],
                    ]);
                    $newVideo = $this->getVideo(true);
                    $resp['data'] = $newVideo['data'];                                     //Devuelvo el curso creado [id, urlimg, title, price, description]
                    $resp['message'] = 'Video actualizado correctamente!';              //exito!!!!!! 😎
                    $resp['ok'] = true;
                }
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();     //Devuelvo errores
            }
        }

        return $resp;
    }

    /**
     * Devuelve todos los cursos
     */
    public function deleteVideo()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                $data = $resp['data'];                                                               //Obtengo datos del json
                $validator = Validator::make($data, [
                    'id' => 'required',
                ]);
                if ($validator->fails()) {                                                      //Validamos que no exista el usuario
                    $errors = $validator->errors();
                    $resp['message'] = $errors->first();                                       //Devuelvo el dato repetido
                } else {
                    $video = Video::where('id', $resp['data']['id'])->first();
                    $video->update([
                        'deleted_at' => Carbon::now(),
                    ]);
                    $newVideo = $this->getAllVideo(true);
                    $resp['data'] = $newVideo['data'];                                                       //Devuelvo el array de cursos
                    $resp['message'] = 'Video eliminado correctamente!';                              //exito!!!!!! 😎
                    $resp['ok'] = true;
                }
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();                     //Devuelvo errores
            }
        }

        return $resp;
    }

    /**
     * Devuelve todos los cursos
     */
    public function activateVideo()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                $data = $resp['data'];                                                               //Obtengo datos del json
                $validator = Validator::make($data, [
                    'id' => 'required',
                ]);
                if ($validator->fails()) {                                                      //Validamos que no exista el usuario
                    $errors = $validator->errors();
                    $resp['message'] = $errors->first();                                       //Devuelvo el dato repetido
                } else {
                    $video = Video::where('id', $resp['data']['id'])->first();
                    $video->update([
                        'deleted_at' => null,
                    ]);
                    $newVideo = $this->getAllVideo(true);
                    $resp['data'] = $newVideo['data'];                                                       //Devuelvo el array de cursos
                    $resp['message'] = 'Video eliminado correctamente!';                              //exito!!!!!! 😎
                    $resp['ok'] = true;
                }
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();                     //Devuelvo errores
            }
        }

        return $resp;
    }

    /**
     * Devuelve todos los cursos
     */
    public function getAllVideo($callInt = false)
    {
        if (!$callInt) {
            $resp = $this->verifyToken();
        } else {
            $resp = ['ok' => true, 'message' => 'Token correcto', 'data' => null];       //Armo la respuesta generica
        }
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                $arrayVideo = Video::all();
                $resp['data'] = $arrayVideo;                                                    //Devuelvo el array de cursos
                $resp['message'] = 'Videos obtenidos correctamente!';                              //exito!!!!!! 😎
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
    public function getVideo($callInt = false)
    {
        if (!$callInt) {
            $resp = $this->verifyToken();
        } else {
            $resp = ['ok' => true, 'message' => 'Token correcto', 'data' => null];       //Armo la respuesta generica
        }
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                $arrayVideo = Video::whereNull('deleted_at')->get();
                $resp['data'] = $arrayVideo;                                                    //Devuelvo el array de cursos
                $resp['message'] = 'Videos obtenidos correctamente!';                              //exito!!!!!! 😎
                $resp['ok'] = true;
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();                     //Devuelvo errores
            }
        }

        return $resp;
    }
}
