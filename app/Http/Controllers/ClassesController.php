<?php

namespace App\Http\Controllers;

use App\Models\Classes;
use Carbon\Carbon;
use DateTime;

class ClassesController extends Controller
{
    /**
     * se va a encargar de crear las clases dependiendo de la cantidad de días que dure el turno
     */
    public function saveClasses($turn)
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                //$data = $resp['data'];
                $classes = [];
                $cantClasses = $turn->course->cant_class;
                $dateTurnIni = Carbon::parse($turn->date_turn_ini);

                for ($i = 0; $i < $cantClasses; $i++) {
                    $class = Classes::create([
                        'turn_id' => $turn->id,
                        'assistance' => null,
                        'observation' => null,
                        'cancelled' => null,
                        'debts_id' => null,
                        'motive_cancelled' => null,
                        'date' => $dateTurnIni->copy()->addWeekdays($i)->toDateTimeString(),
                    ]);

                    $classes[] = $class;
                }
                if (count($classes) >= $cantClasses) {
                    $resp = [
                        'data' => $classes,
                        'message' => 'Clases creado correctamente!',
                        'ok' => true,
                    ];
                } else {
                    $resp = [
                        'message' => 'Error al crear las clases',
                        'ok' => false,
                    ];
                }
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();                     //Devuelvo errores
            }
        }
        return $resp;
    }

    /**
     * se va a encargar de obtener las clases dependiendo de la fecha enviada
     */
    public function getClassesForDate()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                $data = $resp['data'];
                $instructId = $data['instructId'];

                // Obtener clases para la fecha específica y ordenar por date (que incluye fecha y hora)
                $classes = Classes::whereDate('date', $data['date'])
                    ->orderBy('date')
                    ->with('turns.userAlumn.urlData')
                    ->whereHas('turns.instructTimestamp.userInstruct', function ($query) use ($instructId) {
                        $query->where('id', $instructId);
                    })
                    ->get();

                if ($classes->isNotEmpty()) {
                    $resp = [
                        'data' => $classes,
                        'message' => 'Clases obtenidas correctamente y ordenadas por fecha y hora!',
                        'ok' => true,
                    ];
                } else {
                    $resp = [
                        'data' => [],
                        'message' => 'No hay clases para la fecha especificada',
                        'ok' => true,
                    ];
                }
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();
            }
        }
        return $resp;
    }

    /**
     * se encarga de dar asistencia a una clase
     */
    public function setAssis()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                $data = $resp['data'];
                $class = Classes::where('id', $data['classId'])
                    ->update([
                        'assistance' => $data['assistance'],
                    ]);
                if ($class) {

                    //verifico si es el ultimo dia para notificar el review
                    $objClass = Classes::with('turns.course')->find($data['classId']);
                    if ($objClass->turns->date_turn_end <= Carbon::now()->toDateTimeString()) {
                        $userId = $objClass->turns->user_alumn_id;
                        $message = "Felicidades! finalizaste tu " . $objClass->turns->course->title . " Ahora podras calificar que te pareció</br>
                        Podrás ingresar a <a href='" . env('APP_URL') . "review'>Review</a> para realizarla! </br>
                        Exitos en tu nueva etapa de conductor!";
                        $motive = "Realiza la reseña del curso " . $objClass->turns->course->title;

                        $notiC = new NotificationController();
                        $notiC->sendAllNoti($userId, $message, $motive);
                    }

                    $resp = [
                        'data' => $class,
                        'message' => 'Asistencia guardada correctamente!',
                        'ok' => true,
                    ];
                } else {
                    $resp = [
                        'message' => 'Error al guardar la asistencia',
                        'ok' => false,
                    ];
                }
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();
            }
        }
        return $resp;
    }

    /**
     * se encarga de poner una observacion a la clase
     */
    public function setCancelled()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                $data = $resp['data'];
                $class = Classes::where('id', $data['classId'])
                    ->update([
                        'cancelled' => true,
                        'motive_cancelled' => $data['motiveCancelled'],
                    ]);
                if ($class) {
                    $resp = [
                        'data' => $class,
                        'message' => 'Cancelacion realiazada correctamente!',
                        'ok' => true,
                    ];
                } else {
                    $resp = [
                        'message' => 'Error al realizar la cancelacion',
                        'ok' => false,
                    ];
                }
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();
            }
        }
        return $resp;
    }

    /**
     * se encarga de poener una observacion a la clase
     */
    public function setObservation()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                $data = $resp['data'];
                $class = Classes::where('id', $data['classId'])
                    ->update([
                        'observation' => $data['observation'],
                    ]);
                if ($class) {
                    $resp = [
                        'data' => $class,
                        'message' => 'Observacion guardada correctamente!',
                        'ok' => true,
                    ];
                } else {
                    $resp = [
                        'message' => 'Error al guardar la Observacion',
                        'ok' => false,
                    ];
                }
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();
            }
        }
        return $resp;
    }

    /**
     * se encarga de poener una observacion a la clase
     */
    public function getClassesStatistics()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                $data = $resp['data'];


                $today = now();

                $classes = Classes::whereHas('turns', function ($query) use ($data) {
                    $query->where('user_alumn_id', $data['idUser']);
                })
                    ->select(['id', 'assistance', 'date', 'observation'])
                    ->get();

                $result = [
                    [
                        'id' => 'asistencias',
                        'label' => 'Asistencias',
                        'value' => $classes->where('assistance', true)->where('date', '<', $today)->count(),
                    ],
                    [
                        'id' => 'faltas',
                        'label' => 'Faltas',
                        'value' => $classes->where('assistance', '!=', true)->where('date', '<', $today)->count(),
                    ],
                    [
                        'id' => 'faltantes',
                        'label' => 'Faltantes',
                        'value' => $classes->where('date', '>=', $today)->where('assistance', '!=', true)->count(),
                    ],
                    [
                        'id' => 'observaciones',
                        'label' => 'Observaciones',
                        'value' => $classes->whereNotNull('observation')->count(),
                        'observations' => Classes::whereNotNull('observation')->get(),
                    ],
                ];

                $resp = [
                    'data' =>  $result,
                    'message' => 'Datos obtenidos correctamente!',
                    'ok' => true,
                ];
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();
            }
        }
        return $resp;
    }
}
