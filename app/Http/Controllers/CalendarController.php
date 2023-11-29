<?php

namespace App\Http\Controllers;

use App\Models\Calendar;
use Carbon\Carbon;
use App\Models\InstructTimeStamp;
use App\Models\Turn;
use DateTime;
use Illuminate\Http\Request;


class CalendarController extends Controller
{
    /**
     * Devuelve todos los cursos
     */
    public function getCalendar()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                $calendar = Calendar::whereNull('deleted_at')->first();
                $resp['data'] = [
                    'calendar' => $calendar,
                ];
                $resp['message'] = 'Calendario obtenido correctamente!';                              //exito!!!!!! 😎
                $resp['ok'] = true;
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();                     //Devuelvo errores
            }
        }

        return $resp;
    }

    /**
     * Guarda los datos del calendario
     */
    public function saveCalendar()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                $data = $resp['data'];
                $calendar = Calendar::whereNull('deleted_at')->first();
                if ($calendar) {
                    $calendar->delete();
                }
                $startDate = Carbon::parse($data['startDate']);
                $endDate = Carbon::parse($data['endDate']);
                $startTime = Carbon::parse($data['startTime']);
                $timeEnd =  Carbon::parse($data['endTime']);
                $diferencia = $startTime->diff($timeEnd);
                $numeroDeDias = $diferencia->h;
                $cantTurns = $numeroDeDias * 2;
                $newCalendar = Calendar::create([
                    'day_start' => $startDate,
                    'day_end' => $endDate,
                    'time_start' => $startTime,
                    'time_end' => $timeEnd,
                    'cant_turns_xday' => $cantTurns,
                ]);
                if ($newCalendar) {
                    $resp['data'] = $calendar;
                    $resp['message'] = 'Calendario creado correctamente!';                              //exito!!!!!! 😎
                    $resp['ok'] = true;
                }else{
                    $resp['message'] = 'Error al crear el calendario';                              //exito!!!!!! 😎
                }
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();                     //Devuelvo errores
            }
        }

        return $resp;
    }
}
