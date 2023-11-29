<?php

namespace App\Http\Controllers;

use App\Models\UrlData;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;

class Controller extends BaseController
{


    /**
     * Funcion que verifica si es encriptado o no
     * @return array
     */
    public function verifyToken()
    {
        if (request('crypt')) {
            $resp = $this->verifyTokenEncrypt();
        } else {
            $resp = $this->verifyTokenNorm();
        }
        return $resp;
    }

    //================================================   SIN ENCRIPTAR  ================================================

    /**
     * Funcion que verifica la coneccion con la API sin Encriptar
     * @return array
     */
    public function verifyTokenNorm()
    {
        $resp = ['ok' => false, 'message' => 'Error con token', 'data' => null];       //Armo la respuesta generica
        $usu = request('usu');
        $pass = request('pass');
        $jsonData = request('jsonData');
        if ($usu && $pass) {                                                            //Verifico que se hayan enviado los datos
            $token = User::where('username', $usu)->first();                            //Realizo la consulta    
            if ($token) {
                $resp['ok'] = true;                                                 //Devuelvo que el usuario y contraseña son correctos
                $resp['message'] = 'Token correcto';
                $resp['data'] = $jsonData;
            }
        } else {
            $resp['message'] = 'Error en la estructura';                               //Devuelvo que falta usuario o contraseña
        }
        return $resp;
    }

    //================================================ ENCRIPTADO ================================================

    /**
     * Funcion que verifica la coneccion con la API Encriptado
     * @return array
     */
    public function verifyTokenEncrypt()
    {
        $resp = ['ok' => false, 'message' => 'Error con token', 'data' => null];   //Armo la respuesta generica
        $crypt = request('crypt');                                                  //Obtengo el token
        $appKey = env('APP_PRIVKEY');                                               //Obtengo la clave y el iv
        $appIv = env('APP_IV');                                                     //Obtengo la clave y el iv
        $key = hex2bin($appKey);                                                    //Convierto la clave y el iv a binario
        $iv = hex2bin($appIv);                                                      //Convierto la clave y el iv a binario
        $decrypt = openssl_decrypt($crypt, 'aes-128-cbc', $key, OPENSSL_ZERO_PADDING, $iv); //Desencripto el token
        $decrypt = substr($decrypt, 0, -ord($decrypt[strlen($decrypt) - 1]));       //Le quito los caracteres de relleno
        $decrypt = json_decode($decrypt, true);                                     //Lo convierto en array
        $usu = $decrypt['usu'];                                                     //Obtengo el usuario
        $pass = $decrypt['pass'];                                                   //Obtengo la contraseña
        $jsonData = $decrypt['jsonData'];                                           //Obtengo el jsonData
        if ($usu && $pass) {                                                            //Verifico que se hayan enviado los datos
            $token = User::where('username', $usu)->first();                            //Realizo la consulta    
            if ($token) {
                if ($token['password'] === $pass) {
                    $resp['ok'] = true;                                                 //Devuelvo que el usuario y contraseña son correctos
                    $resp['message'] = 'Token correcto';
                    $resp['data'] = $jsonData;
                }
            }
        } else {
            $resp['message'] = 'Error en la estructura';                               //Devuelvo que falta usuario o contraseña
        }
        return $resp;
    }

    //================================================   FORMULARIOS  ================================================

    /**
     * Funcion que verifica la coneccion con la API de un formulario
     * @return array
     */
    public function verifyTokenForm(Request $request)
    {
        $resp = ['ok' => false, 'message' => 'Error con token', 'data' => null];       //Armo la respuesta generica
        $usu = $request->input('usu');
        $pass = $request->input('pass');
        if ($usu && $pass) {                                                            //Verifico que se hayan enviado los datos
            $token = User::where('username', $usu)->first();                            //Realizo la consulta    
            if ($token) {
                if ($token['password'] === $pass) {
                    $resp['ok'] = true;                                                 //Devuelvo que el usuario y contraseña son correctos
                    $resp['message'] = 'Token correcto';
                }
            }
        } else {
            $resp['message'] = 'Error en la estructura';                               //Devuelvo que falta usuario o contraseña
        }
        return $resp;
    }

    /**
     * Funcion que borra la imagen almacenada
     * @return object
     */
    public function deleteServImg($urlSave, $idUrlData)
    {
        $resp = false;
        $objUrlData = UrlData::find($idUrlData);
        $url = str_replace('storage', 'public', $objUrlData->url);
        if (Storage::disk('public')->delete($url)) {
            if ($urlSave && $idUrlData) {
                $objUrlData->update([
                    'url' => $urlSave,
                ]);
            }
            $resp = $objUrlData;
        }
        return $resp;
    }
}
