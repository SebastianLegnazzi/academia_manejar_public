<?php

namespace App\Http\Controllers;

use App\Models\CommentAnswer;
use App\Models\Turn;
use Carbon\Carbon;
use Illuminate\Http\Request;

class CommentAnswerController extends Controller
{
    /**
     * Funcion que recupera a todas las preguntas
     * @param string $password
     * @return array
     */
    public function getAllQuestion()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                $resp['data'] = CommentAnswer::select(         // Seleccionar las columnas que se van a devolver
                    'id',
                    'user_alumn_id',
                    'question',
                    'answer',
                    'created_at'
                )->orderBy('created_at', 'desc') // Ordenar las preguntas por la columna 'created_at' en orden descendente
                    ->where('answer', '!=', null) // Filtrar las preguntas que no tengan respuesta
                    ->take(20) // Tomar las últimas 20 preguntas
                    ->get(); // Obtener los resultados;
                $resp['ok'] = true;
                $resp['message'] = 'Preguntas recuperadas correctamente';
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();           //Devuelvo errores
            }
        }

        return $resp;
    }

    /**
     * Funcion que recupera las preguntas pendientes
     * @param string $password
     * @return array
     */
    public function getPendingQuestion()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                $data = $resp['data'];
                $resp['data'] = CommentAnswer::where(function ($query) {        // Obtengo las preguntas pendientes
                    $query->whereNull('user_instruct_id')
                        ->orWhereNull('answer');
                })
                    ->where(function ($query) use ($data) {
                        $query->where(function ($query) {
                            $query->whereNull('user_instruct_id')
                                ->orWhereRaw('updated_at >= DATE_SUB(NOW(), INTERVAL 10 MINUTE)');   // Obtengo las preguntas que no tienen respuesta o que fueron respondidas hace menos de 10 minutos
                        })
                            ->orWhere(function ($query) use ($data) {           // Obtengo las preguntas que fueron respondidas por el instructor que esta logueado
                                $query->whereNotNull('user_instruct_id')
                                    ->where('user_instruct_id', $data['instructId']);
                            });
                    })
                    ->orderBy('created_at', 'desc')
                    ->take(20)
                    ->get();

                $resp['ok'] = true;
                $resp['message'] = 'Preguntas pendientes recuperadas correctamente';
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();           //Devuelvo errores
            }
        }

        return $resp;
    }

    /**
     * Funcion que busca las preguntas por palabra clave
     * @param string $password
     * @return array
     */
    public function searchQuestion()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                $data = $resp['data'];
                $resp['data'] = CommentAnswer::where('question', 'like', '%' . $data['search'] . '%')
                    ->where('answer', '!=', null) // Filtrar las preguntas que no tengan respuesta
                    ->orderBy('created_at', 'desc') // Ordenar las preguntas por la columna 'created_at' en orden descendente
                    ->take(20) // Tomar las últimas 20 preguntas
                    ->get(); // Obtener los resultados;
                if (count($resp['data']) == 0) {
                    $resp['message'] = 'No se encontraron resultados';
                } else {
                    $resp['ok'] = true;
                    $resp['message'] = 'Preguntas recuperadas correctamente';
                }
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();           //Devuelvo errores
            }
        }

        return $resp;
    }

    /**
     * Funcion que realiza una pregunta
     * @param string $password
     * @return array
     */
    public function createQuestion()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                $data = $resp['data'];
                $data['question'] = trim($data['question']);                            //Borro espacios en la pregunta
                $questionExist = CommentAnswer::where('question', $data['question'])    // Verifico si existe una pregunta con el mismo contenido
                    ->first();
                $resp['ok'] = true;
                if (!$questionExist) {                                                  // Si no existe la pregunta, la creo
                    CommentAnswer::create([
                        'user_alumn_id' => $data['alumnId'],
                        'user_instruct_id' => null,
                        'question' => $data['question'],
                        'answer' => null,
                    ]);

                    $objTurn = Turn::with('instructTimestamp.userInstruct', 'userAlumn')->where('user_alumn_id', $data['alumnId'])->first();                     // Actualizo la ultima pregunta realizada por el alumno


                    $userId = $objTurn->instructTimestamp->userInstruct->id;
                    $message = "El usuario " . $objTurn->userAlumn->name . " " . $objTurn->userAlumn->lastname . " Realizo una pregunta. </br>
                    Podrás ingresar a <a href='" . env('APP_URL') . "main_question_instruct'>Preguntas</a> para responderla.";
                    $motive = "Pregunta de alumno - " . $objTurn->userAlumn->name . " " . $objTurn->userAlumn->lastname;

                    $notiC = new NotificationController();
                    $notiC->sendAllNoti($userId, $message, $motive);

                    $resp['message'] = 'Pregunta realizada correctamente';             //Devuelvo mensaje de exito
                    $newQuestions = $this->getAllQuestion()['data'];
                    $newHistory = $this->getForUser()['data'];
                    $resp['data'] = [
                        'newQuestions' => $newQuestions,
                        'newHistory' => $newHistory,
                    ];
                } else {                                                                // Si existe la pregunta, devuelvo error
                    $resp['message'] = 'Ya existe una pregunta con el mismo contenido';
                    return $resp;
                }
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();           //Devuelvo errores
            }
        }
        return $resp;
    }

    /**
     * Funcion que responde una pregunta
     * @param string $password
     * @return array
     */
    public function responseQuestion()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                $data = $resp['data'];                                  // Obtengo los datos
                $objCommentAnswer = CommentAnswer::find($data['questionId']); // Obtengo la pregunta
                $objCommentAnswer->update([                               // Actualizo la pregunta
                    'answer' => $data['answer'],
                    'user_instruct_id' => $data['instructId'],
                ]);

                if ($data['type'] == 'guardar') {                           // Si el tipo es guardar, devuelvo las preguntas pendientes
                    $resp['data'] = $this->getPendingQuestion()['data'];
                } else {
                    $resp['data'] = $this->getForUser()['data'];
                }

                $userId = $objCommentAnswer->user_alumn_id;
                $message = "La pregunta realizada en Academia Manejar fue respondida! </br>
                Podrás ingresar a <a href='" . env('APP_URL') . "main_question_alumn'>Preguntas</a> para verla!";
                $motive = "Pregunta respondida";

                $notiC = new NotificationController();
                $notiC->sendAllNoti($userId, $message, $motive);

                $resp['ok'] = true;
                $resp['message'] = 'Pregunta contestada correctamente';        //Devuelvo mensaje de exito
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();           //Devuelvo errores
            }
        }
        return $resp;
    }

    /**
     * Funcion que obtiene las preungtas del instructor
     * @param string $password
     * @return array
     */
    public function getForUser()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                $data = $resp['data'];
                if (array_key_exists('instructId', $data)) {
                    $twentyFourHoursAgo = Carbon::now()->subHours(24);
                    $resp['data'] = CommentAnswer::where('user_instruct_id', $data['instructId'])
                        ->where('updated_at', '>=', $twentyFourHoursAgo)
                        ->where('answer', '!=', null) // Filtrar las preguntas que no tengan respuesta
                        ->orderBy('created_at', 'desc') // Ordenar las preguntas por la columna 'created_at' en orden descendente
                        ->get(); // Obtener los resultados;
                } else if (array_key_exists('alumnId', $data)) {
                    $resp['data'] = CommentAnswer::where('user_alumn_id', $data['alumnId'])
                        ->orderBy('created_at', 'desc') // Ordenar las preguntas por la columna 'created_at' en orden descendente
                        ->get(); // Obtener los resultados;
                }
                $resp['ok'] = true;
                if (count($resp['data']) == 0) {
                    $resp['message'] = 'No se encontraron resultados';
                } else {
                    $resp['message'] = 'Preguntas recuperadas correctamente';
                }
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();           //Devuelvo errores
            }
        }
        return $resp;
    }
}
