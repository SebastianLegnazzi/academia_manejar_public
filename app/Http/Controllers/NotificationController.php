<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NotificationController extends Controller
{
    /**
     * Obtiene todas las notificaciones activas del usuario
     */
    public function getNoti()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                $data = $resp['data'];
                $noti = Notification::where('user_id', $data['userId'])
                    ->whereNull('deleted_at')
                    ->orderBy('created_at', 'desc')
                    ->get();
                $resp['ok'] = true;
                if ($noti->count() > 0) {
                    $resp['data'] = $noti;
                } else {
                    $resp['data'] = [];
                    $resp['message'] = 'No hay notificaciones';
                }
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();                     //Devuelvo errores
            }
        }
        return $resp;
    }

    /**
     * Envia notificaciones al usuario
     */
    public function sendNoti($param = "")
    {

        if ($param == "") {
            $param = $this->verifyToken();
        } else {
            $resp = ['ok' => true, 'message' => '', 'data' => $param];       //Armo la respuesta generica
        }

        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                $data = $resp['data'];
                $noti = Notification::create([
                    'user_id' => $data['userId'],
                    'message' => $data['message'],
                    'view' => null,
                    'delete' => null,
                ]);
                if ($noti) {
                    $resp['ok'] = true;
                    $resp['message'] = 'Notificacion enviada correctamente!';
                } else {
                    $resp['message'] = 'Error al enviar la notificacion!';
                }
            } catch (\Exception $e) {
                Log::channel('error')->info('----------- ERROR sendNoti - 1 -----------');
                Log::channel('error')->info($e->getMessage());
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();                     //Devuelvo errores
            }
        }
        return $resp;
    }

    /**
     * Elimina las notificaciones del usuario
     */
    public function deleteNoti()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                $data = $resp['data'];
                $notiDelete = Notification::where('user_id', $data['userId'])->where('id', $data['notiId'])->first();
                if ($notiDelete) {
                    $notiDelete->delete();
                    $noti = $this->getNoti();
                    $resp['ok'] = true;
                    $resp['message'] = 'Notificacion eliminada correctamente!';
                    $resp['data'] = $noti['data'];
                } else {
                    $resp['message'] = 'Error al eliminar la notificacion!';
                }
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();                     //Devuelvo errores
            }
        }
        return $resp;
    }

    /**
     * Elimina las notificaciones del usuario
     */
    public function sendAllNoti($userId, $message, $motive)
    {
        try {
            $objPersona = User::find($userId);
            if ($objPersona != null) {
                $param['userId'] = $objPersona->id;
                $param['name'] = $objPersona->name;
                $param['email'] = $objPersona->email;
                $param['message'] = $message;
                $param['motive'] = $motive;

                if ($param['email'] != null) {
                    // $response = Http::post('https://apispruebas.academiamanejar.com.ar/api/sendEmail', $param);
                    // Verificar si la solicitud fue exitosa
                    // if ($response->successful()) {
                    $emailC = new EmailController();
                    $emailC->sendEmail($param);
                    $this->sendNoti($param);
                    $resp['ok'] = true;
                    $resp['message'] = 'Notificacion enviada correctamente!';
                }
            } else {
                $resp['message'] = 'No se encontro el usuario!';
            }
        } catch (\Exception $e) {
            Log::channel('error')->info('----------- ERROR sendAllNoti - 1 -----------');
            Log::channel('error')->info($e->getMessage());
            $resp['message'] = 'Error en el servidor: ' . $e->getMessage();                     //Devuelvo errores
        }
        return $resp;
    }
}
