<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EmailController extends Controller
{
    /**
     * Envia email
     */
    public function sendEmail($param = "")
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
                $validator = Validator::make($data, [
                    'name' => 'required',
                    'email' => 'required',
                    'message' => 'required',
                    'motive' => 'required',
                ]);
                if ($validator->fails()) {                                          //Validamos que no exista el usuario
                    $errors = $validator->errors();
                    $resp['message'] = $errors->first();                            //Devuelvo el dato repetido
                } else {
                    $issue = $data['motive'];             // Nombre de la persona que envia el formulario
                    $sendEmail = $data['email'];                                // Email a quien se envia el formulario
                    $userEmail = "sugerencias@academiamanejar.com.ar";                                    // Email de la persona que envia el formulario
                    $message = $data['message'];                                     // Mensaje que envia la persona
                    $header = "From:" . $userEmail . "\r\n";                        // Email de la persona que envia el formulario
                    $header .= "Reply-To: " . $userEmail . "\r\n";                  // Email de la persona que envia el formulario
                    $header .= "Content-Type: text/html; charset=utf-8\r\n";       // Asegurar que la codificación sea UTF-8
                    $header .= "X-Mailer: PHP/" . phpversion();                     // Version de PHP que se esta utilizando
                    $mail = @mail($sendEmail, $issue, $message, $header);           // Envio el email y guardo el resultado en una variable
                    if ($mail) {
                        $resp['message'] = 'Email enviado correctamente!';          //exito!!!!!! 😎
                        $resp['ok'] = true;
                    } else {
                        $resp['message'] = 'Error al enviar el email!';
                    }
                }
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();     //Devuelvo errores
            }
        }

        return $resp;
    }
}
