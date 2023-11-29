<?php

namespace App\Http\Controllers;

use App\Models\Debt;
use App\Models\InstructTimeStamp;
use App\Models\Turn;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class TurnController extends Controller
{
    // /**
    //  * Devuelve todos los datos para el home
    //  */
    // public function getAvailableTurnsTimes()
    // {
    //     $resp = $this->verifyToken();
    //     if ($resp['ok']) {
    //         try {
    //             $fechaInicialSol = Carbon::parse('2023-10-01');  // Fecha inicial del turno solicitado
    //             $fechaFinalSol = Carbon::parse('2023-10-23');  // Fecha final del turno solicitado



    //             // $cantInstructAvailable =  InstructTimeStamp::whereNull('deleted_at')->count();//me falta ver que todos los instrcutores tengan ese horario

    //             // $cantInstructAvailable =  InstructTimeStamp::whereNull('deleted_at')->get();

    //             // $turnsNotAvailable = Turn::whereBetween('date_turn_ini', [$fechaInicialSol, $fechaFinalSol])
    //             //     ->whereBetween('date_turn_end', [$fechaInicialSol, $fechaFinalSol])
    //             //     ->select(
    //             //         DB::raw('TIME(date_turn_ini) AS hora_inicio'),  // Extrae la hora de date_turn_ini
    //             //         DB::raw('TIME(date_turn_end) AS hora_fin')      // Extrae la hora de date_turn_end
    //             //     )
    //             //     ->groupBy('hora_inicio', 'hora_fin')  // Agrupa por la hora de inicio y la hora de fin
    //             //     ->havingRaw('COUNT(*) >=' . $cantInstructAvailable . '')  // Filtra para incluir solo las horas que se repiten al menos una vez
    //             //     ->get();  // Obtiene los resultados de la consulta


    //             // $turns = Turn::where('date_turn_ini', $resp['data']['date'])->get();

    //             // $resp['data'] = $turnsNotAvailable;
    //             $resp['ok'] = false;                                                    //Inicializo la respuesta en false
    //             $resp['message'] = 'Turnos obtenidos correctamente';
    //             $resp['ok'] = true;
    //         } catch (\Exception $e) {
    //             $resp['message'] = 'Error en el servidor: ' . $e->getMessage();           //Devuelvo errores
    //         }
    //     }
    //     return $resp;
    // }

    /**
     * se va a encargar de ¿crear el turno
     */
    public function saveTurn()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                $data = $resp['data'];

                $dateTurnIni = Carbon::parse($data['dateTurnIni']);
                $dateTurnEnd = Carbon::parse($data['dateTurnEnd']);

                $newTurn = Turn::create([
                    'date_turn_ini' => $dateTurnIni,
                    'date_turn_end' => $dateTurnEnd,
                    'car_id' => $data['carId'],
                    'courses_id' => $data['courseId'],
                    'debts_id' => null,
                    'user_alumn_id' => $data['userAlumnId'],
                    'instruct_timestamp_id' => $data['instructTimestampId'],
                ]);

                if ($newTurn) {
                    $resp['data'] = $newTurn;
                    $resp['message'] = 'Turno creado correctamente!';                              //exito!!!!!! 😎
                    $resp['ok'] = true;
                } else {
                    $resp['message'] = 'Error al crear el turno';                              //exito!!!!!! 😎
                }
                // $cantInstructAvailable =  InstructTimeStamp::whereNull('deleted_at')->get();

                // $turnsNotAvailable = Turn::whereBetween('date_turn_ini', [$fechaInicialSol, $fechaFinalSol])
                //     ->whereBetween('date_turn_end', [$fechaInicialSol, $fechaFinalSol])
                //     ->select(
                //         DB::raw('TIME(date_turn_ini) AS hora_inicio'),  // Extrae la hora de date_turn_ini
                //         DB::raw('TIME(date_turn_end) AS hora_fin')      // Extrae la hora de date_turn_end
                //     )
                //     ->groupBy('hora_inicio', 'hora_fin')  // Agrupa por la hora de inicio y la hora de fin
                //     ->havingRaw('COUNT(*) >=' . $cantInstructAvailable . '')  // Filtra para incluir solo las horas que se repiten al menos una vez
                //     ->get();  // Obtiene los resultados de la consulta


                // $turns = Turn::where('date_turn_ini', $resp['data']['date'])->get();

                // $resp['data'] = $turnsNotAvailable;
                $resp['ok'] = false;                                                    //Inicializo la respuesta en false
                $resp['message'] = 'Turnos obtenidos correctamente';
                $resp['ok'] = true;
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();                     //Devuelvo errores
            }
        }
        return $resp;
    }

    public function editTurn()
    {
        $resp = $this->verifyToken();

        if ($resp['ok']) {
            try {
                $data = $resp['data'];
                $turn = Turn::find($data['turnId']);

                if (!$turn) {
                    $resp['message'] = 'Turno no encontrado';
                } else {

                    $dateTurnIni = Carbon::parse($data['dateTurnIni']);
                    $dateTurnEnd = Carbon::parse($data['dateTurnEnd']);

                    $turn->update([
                        'date_turn_ini' => $dateTurnIni,
                        'date_turn_end' => $dateTurnEnd,
                        'car_id' => $data['carId'],
                        'courses_id' => $data['courseId'],
                        'debts_id' => $data['userPaymentId'],
                        'user_alumn_id' => $data['userAlumnId'],
                        'instruct_timestamp_id' => $data['instructTimestampId'],
                    ]);

                    $resp['data'] = $turn;
                    $resp['message'] = 'Turno editado correctamente';
                    $resp['ok'] = true;
                }
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();
            }
        }

        return $resp;
    }

    public function darBajaTurn($idTurn)
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                $objTurn = Turn::find($idTurn);
                if ($resp['data']['action'] === 'deactivate') {
                    $objTurn->update(['deleted_at' => now()]);
                };
                $resp['data'] = $objTurn;                                                       //Devuelvo el array de cursos
                $resp['message'] = 'Deuda eliminada correctamente!';                              //exito!!!!!! 😎
                $resp['ok'] = true;
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();                     //Devuelvo errores
            }
        }
        return $resp;
    }

    /**
     * Modulo que borrael turn y sus deudas
     */
    public function deleteTurn($param)
    {
        // Define la consulta común para todas las condiciones
        $query = Turn::whereNotExists(function ($query) {
            $query->select(DB::raw(1))
                ->from('debts as d')
                ->join('payments as p', 'p.debts_id', '=', 'd.id')
                ->whereRaw('d.turns_id = turn.id');
        });

        // Usar un switch para determinar qué condición se cumple
        switch (true) {
            case isset($param['id']):
                $arrayTurnsOld = $query->where('turn.id', $param['id'])->get();
                break;
            case isset($param['idAlumn']):
                $arrayTurnsOld = $query->where('turn.user_alumn_id', $param['idAlumn'])->get();
                break;
            default:
                $date = now()->toDateTimeString();
                $arrayTurnsOld = $query->whereRaw('TIMESTAMPDIFF(MINUTE, turn.created_at, ?) > 20', [$date])->get();
        }


        //Elimino todos los turnos sin abonar la reserva
        foreach ($arrayTurnsOld as $turn) {
            $turn->debts()->delete();
            $turn->delete();
        }
    }

    /**
     * Devuelve los cursos del usuario
     */
    public function getMyCourse()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                $data = $resp['data'];

                //Elimino los turnos sin pago
                $this->deleteTurn($data);

                $turn = Turn::where('user_alumn_id', $data['idAlumn'])
                    ->join('courses AS c', 'c.id', 'turn.courses_id')
                    ->join('url_data AS ud', 'ud.id', 'c.url_data_id')
                    ->select(
                        'c.id as idCourse',
                        'c.title as titleCourse',
                        'c.price as priceCourse',
                        'c.price_reservation as priceReservation',
                        'c.cant_class as cantClassCourse',
                        'ud.url as urlImgCourse',
                        'turn.date_turn_ini as dateTurnIni',
                        'turn.date_turn_end as dateTurnEnd',
                    )
                    ->get();
                if ($turn) {
                    // $course = $turn->course;
                    // $imgCourse = $course->url_data->url;
                    $resp['data'] = $turn; //['turn' => $turn, 'course' => $course, 'imgCourse' => $imgCourse];                                                    //Devuelvo el array de cursos
                    $resp['message'] = 'Curso obtenido correctamente!';                              //exito!!!!!! 😎
                    $resp['ok'] = true;
                } else {
                    $resp['message'] = 'No hay cursos para mostrar!';                              //exito!!!!!! 😎
                }
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();                     //Devuelvo errores
            }
        }
        return $resp;
    }

    /**
     * Devuelve los turnos que tengan reserva pero sin pago
     */
    public function getTurnsExeptPay()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;

                $debts = Debt::select('debts.*')
                    ->join('debts AS debts2', 'debts.turns_id', '=', 'debts2.turns_id')
                    ->whereRaw('debts.total_debt > debts2.total_debt')
                    ->where('debts.saldo', '>', 0)
                    ->where('debts2.saldo', '=', 0)
                    ->whereNull('debts.deleted_at') // Condición para registros sin soft delete
                    ->distinct()
                    ->with('turns.course')
                    ->with('turns.userAlumn')
                    ->get();

                if ($debts) {
                    // $course = $turn->course;
                    // $imgCourse = $course->url_data->url;
                    $resp['data'] = $debts; //['turn' => $turn, 'course' => $course, 'imgCourse' => $imgCourse];                                                    //Devuelvo el array de cursos
                    $resp['message'] = 'Turnos obtenidos correctamente!';                              //exito!!!!!! 😎
                    $resp['ok'] = true;
                } else {
                    $resp['message'] = 'No hay cursos para mostrar!';                              //exito!!!!!! 😎
                }
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();                     //Devuelvo errores
            }
        }
        return $resp;
    }

    public function editDebt()
    {
        $resp = $this->verifyToken();

        if ($resp['ok']) {

            $response = " y ";
            try {
                $data = $resp['data'];
                $debt = Debt::with('turns.course')->find($data['debtId']);

                if (!$debt) {
                    $resp['message'] = 'Turno no encontrado';
                } else {

                    $newSaldo = $debt->saldo - $data['saldoPagado'];
                    $debt->saldo = $newSaldo;

                    if ($newSaldo <= 0) {
                        $classesController = new ClassesController();

                        $response .= $classesController->saveClasses($debt->turns);
                    }

                    $resp['data'] = $debt;
                    $resp['message'] = 'deuda editada correctamente' . $response;
                    $resp['ok'] = true;
                }
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();
            }
        }

        return $resp;
    }
}
