<?php

namespace App\Http\Controllers;

use App\Models\InstructTimeStamp;
use App\Models\Turn;
use Carbon\Carbon;
use DateInterval;
use DateTime;
use Illuminate\Support\Facades\DB;

class InstructTimestampController extends Controller
{
    /**
     * Funcion que guarda el tiempo del instructor
     */
    public function saveInstructorTimestamp()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                $data = $resp['data'];
                $instructor = InstructTimeStamp::whereNull('deleted_at')->where('user_instruct_id', $data['instructId'])->first();
                if ($instructor) {
                    $instructor->delete();
                }
                $startTime = Carbon::parse($data['startTime']);
                $timeEnd =  Carbon::parse($data['endTime']);
                InstructTimeStamp::create([
                    'user_instruct_id' => $data['instructId'],
                    'time_start' => $startTime,
                    'time_end' => $timeEnd,
                ]);
                $resp['data'] = [
                    'instructor' => $instructor,
                ];
                $resp['message'] = 'Horario de instructor creado correctamente!';                              //exito!!!!!! 😎
                $resp['ok'] = true;
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();                     //Devuelvo errores
            }
        }

        return $resp;
    }

    /**
     * Funcion que busca todos los instructores con sus tiempos
     */
    public function getInstructTimestamp()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                $morningInstr = InstructTimeStamp::whereNull('instruct_timestamp.deleted_at')
                    ->whereRaw('TIME(instruct_timestamp.time_start) >= "08:00:00" AND TIME(instruct_timestamp.time_start) < "12:00:00"')
                    ->join('users AS us', 'us.id', 'instruct_timestamp.user_instruct_id')
                    ->select(
                        'instruct_timestamp.id AS idInstruct',
                        'us.id AS idUsuario',
                        'instruct_timestamp.car_t_id AS idCarT',
                        'instruct_timestamp.car_m_id AS idCarM',
                        'us.name AS name',
                        'us.lastname AS lastname',
                        'us.url_data_id AS imgInstr',
                        'instruct_timestamp.time_start AS timeStartInstr',
                        'instruct_timestamp.time_end AS timeEndInstr'
                    )
                    ->get();
                $afternoonInstr = InstructTimeStamp::whereNull('instruct_timestamp.deleted_at')
                    ->whereRaw('TIME(instruct_timestamp.time_end) > "12:00:00"')
                    ->join('users AS us', 'us.id', 'instruct_timestamp.user_instruct_id')
                    ->select(
                        'instruct_timestamp.id AS idInstruct',
                        'us.id AS idUsuario',
                        'instruct_timestamp.car_t_id AS idCarT',
                        'instruct_timestamp.car_m_id AS idCarM',
                        'us.name AS name',
                        'us.lastname AS lastname',
                        'us.url_data_id AS imgInstr',
                        'instruct_timestamp.time_start AS timeStartInstr',
                        'instruct_timestamp.time_end AS timeEndInstr'
                    )
                    ->get();
                $resp['data'] = [
                    'morningInstr' => $morningInstr,
                    'afternoonInstr' => $afternoonInstr,
                ];
                $resp['message'] = 'Instructores obtenidos correctamente!';                              //exito!!!!!! 😎
                $resp['ok'] = true;
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();                     //Devuelvo errores
            }
        }

        return $resp;
    }

    public function getDatesInstruct()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                $data = $resp['data'];

                //Borro todos los turnos sin reserva y que hayan superado los 20 minutos
                $objTurnC = new TurnController();
                $objTurnC->deleteTurn(null);

                //Obtengo los turnos del instructor
                $objTurns = Turn::where('instruct_timestamp_id', $data['instructTimestamp']['id'])
                    ->whereNull('deleted_at');

                //Doy formato a las fecha de inicio y fin
                $timeEndInstruct = Carbon::createFromFormat('H:i:s', $data['instructTimestamp']['time_end']);
                $timeStartInstruct = Carbon::createFromFormat('H:i:s', $data['instructTimestamp']['time_start']);

                //Filtro por franja horaria
                if ($data['franjaHoraria'] == 'morning') {
                    //Si la hora de fin es mayor a las 12:00:00, se cambia a las 12:00:00
                    if ($timeEndInstruct->gt('12:00:00')) {
                        $timeEndInstruct = '12:00:00';
                    }
                    $objTurns->whereNull('deleted_at')->whereTime('date_turn_ini', '<=', '12:00:00');

                    //Obtengo la cantidad de turnos que se pueden dar en el tiempo del instructor
                    $minutesTotal = $timeStartInstruct->diffInMinutes($timeEndInstruct);
                } else if ($data['franjaHoraria'] == 'afternoon') {
                    //Si la hora de inicio es menor a las 12:00:00, se cambia a las 12:00:01 
                    if (!$timeStartInstruct->gt('12:00:00')) {
                        $timeStartInstruct = '12:00:01';
                    }

                    //Obtengo todos los turnos que sean mayores a las 12:00:00
                    $objTurns->whereNull('deleted_at')->whereTime('date_turn_ini', '>', '12:00:00');

                    //Obtengo la cantidad de turnos que se pueden dar en el tiempo del instructor
                    $minutesTotal = $timeEndInstruct->diffInMinutes($timeStartInstruct);
                }

                $turnsTot = round($minutesTotal / 30);

                $objTurnsInstruct = $objTurns->orderBy('date_turn_end', 'asc');
                $turnsInstruct = [];

                //Busco todos los turnos disponibles actuales
                // $cantTurns = count($objTurns->select()
                //     ->where('date_turn_end', '>', now())
                //     ->get());
                $cantTurnsTot = count($objTurns->select()->get());
                $availableTurns = [];
                $arrayTurns = [];
                $cantDisp = 1;
                $firstTurns = true;
                //Verifico que la cantidad de turnos disponibles sea menor a la cantidad de turnos que se pueden dar
                if ($cantTurnsTot < $turnsTot) {
                    $cantDisp = 3;
                    //Armo la fecha actual con la hora de vencimiento
                    $objectToday = [
                        "id" => 0,
                        "date_turn_end" => date('Y-m-d H:i:s'),
                    ];
                    //Guardo la fecha actual
                    $arrayTurns[] = $objectToday;
                } else {
                    $firstTurns = false;
                    //Obtengo los turnos vencidos
                    $turnsDefeat = Turn::where('instruct_timestamp_id', $data['instructTimestamp']['id'])
                        ->where('date_turn_end', '<', now())
                        ->whereNull('deleted_at')
                        ->orderBy('date_turn_end', 'asc')
                        ->get();
                    //Recorro todos los turnos y le agrego la fecha de hoy con la hora de vencimiento
                    foreach ($turnsDefeat as $turn) {
                        //Armo la fecha actual con la hora de vencimiento
                        $fechaVencimiento = $turn->date_turn_end;
                        $horaVencimiento = date('H:i:s', strtotime($fechaVencimiento));
                        $fechaActual = date('Y-m-d');

                        $objectToday = [
                            "id" => 0,
                            "date_turn_end" => $fechaActual . ' ' . $horaVencimiento,
                        ];
                        $arrayTurns[] = $objectToday;
                    }

                    //Busco todos los turnos disponibles actuales
                    $arrayAct = Turn::where('instruct_timestamp_id', $data['instructTimestamp']['id'])
                        ->where('date_turn_end', '>', now())
                        ->whereNull('deleted_at')
                        ->orderBy('date_turn_end', 'asc')
                        ->get();
                    if ($arrayAct) {
                        $arrayTurns = array_merge($arrayTurns, $arrayAct->toArray());
                    }
                }
                // else {
                // obtengo todos los turnos del instructor
                // $arrayTurns = $objTurns::orderBy('date_turn_end', 'asc')->get();
                // $cantDisp = 1;
                // }



                // $result = [];
                // $prevDate = null;

                $arrayTurnsPorDates = $objTurnsInstruct->select('date_turn_ini', 'date_turn_end')
                    ->distinct()
                    ->get()
                    ->toArray();

                // recorro todos los turnos y los agrego a un array sumandole un dia para habilitar turnos futuros
                foreach ($arrayTurns as $turn) {
                    $originalEndDate = Carbon::parse($turn['date_turn_end']);

                    //le sumo un dia y verifico que no sea fin de semana
                    for ($i = 0; $i < $cantDisp; $i++) {
                        $originalEndDate = $originalEndDate->addDay();
                        if ($originalEndDate->isWeekend()) {
                            $originalEndDate->nextWeekday(); // Avanzar al siguiente día laborable
                        }

                        if ($firstTurns) {
                            $availableTurns[] = [
                                'id' => $turn['id'],
                                'date_turn_ini' => $originalEndDate->format('Y-m-d H:i:s'),
                                'turns_end' => true,
                            ];

                            $date = $originalEndDate->format('Y-m-d');

                            foreach ($arrayTurnsPorDates as $turnDate) {


                                $timeStart = Carbon::parse($turnDate['date_turn_ini'])->format('H:i:s');
                                $timeEnd = Carbon::parse($turnDate['date_turn_end'])->format('H:i:s');
                                $start = Carbon::parse(Carbon::parse($date)->setTimeFromTimeString($timeStart))->format("Y-m-d H:i:s");
                                $end = Carbon::parse(Carbon::parse($date)->setTimeFromTimeString($timeEnd))->format("Y-m-d H:i:s");

                                $newObjectTurnInstruct = ["date_turn_ini" => $start, "date_turn_end" => $end];

                                $turnsInstruct[] = $newObjectTurnInstruct;
                            }
                        } else {

                            // Resta 30 minutos
                            $originalEndDate = new DateTime($originalEndDate);
                            $originalEndDate = $originalEndDate->sub(new DateInterval('PT30M'))->format('Y-m-d H:i:s');
                            $turnExist = Turn::where('date_turn_ini', $originalEndDate)->first();
                            if (!$turnExist) {
                                $availableTurns[] = [
                                    'id' => $turn['id'],
                                    'date_turn_ini' => $originalEndDate
                                ];
                            }
                        }
                    }
                }

                if ($cantDisp === 1) {
                    $turnsInstruct = $objTurnsInstruct->get();
                }

                $resp['data'] = [
                    'turns' => $arrayTurns,
                    'turnsInstruct' => $turnsInstruct,
                    'turnsAvailables' => $availableTurns,
                    'firstTurns' => $firstTurns,
                    // 'turns' => $objeto,
                ];
                $resp['message'] = 'Turnos obtenido correctamente';
                $resp['ok'] = true;

                // Devolver la respuesta en formato JSON
            } catch (\Exception $e) {
                // Log de errores y devolución de un mensaje de error
                $resp['message'] = $e->getMessage();
            }
            return $resp;
        }
    }

    // private function searchDateRepeat($turns, $timesTotal)
    // {
    //     $turns->select('turn.*')
    //         ->addSelect(DB::raw("(SELECT COUNT(*) FROM turn AS t WHERE DATE(t.date_turn_end) = DATE(turn.date_turn_end)) as date_repetition_count"))
    //         ->having('date_repetition_count', '>=', $timesTotal)
    //         ->get();

    //     $turns = $turns->get();

    //     // Crea un nuevo objeto con los datos deseados y la fecha actual
    //     $objectToday = [
    //         "id" => 0,
    //         "date_turn_end" => date('Y-m-d H:i:s'),
    //     ];

    //     $turns[] = $objectToday;
    //     $availableTurns = [];

    //     foreach ($turns as $turn) {
    //         $originalEndDate = Carbon::parse($turn['date_turn_end']);

    //         for ($i = 0; $i < 3; $i++) {

    //             $originalEndDate = $originalEndDate->addDay();

    //             if ($originalEndDate->isWeekend()) {
    //                 $originalEndDate->nextWeekday(); // Avanzar al siguiente día laborable
    //             }

    //             $availableTurns[] = [
    //                 'id' => $turn['id'],
    //                 'date_turn_ini' => $originalEndDate->format('Y-m-d H:i:s')
    //             ];
    //         }
    //     }
    // }
}
