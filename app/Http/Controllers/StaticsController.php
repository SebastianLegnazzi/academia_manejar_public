<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class StaticsController extends Controller
{
    /**
     * Funcion que devuelve todos los tipos de examenes
     */
    public function getStatics()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $examC = new ExamController();
                $staticsExam = $examC->statisticExam(); //Obtengo las estadisticas de los examenes

                $classC = new ClassesController();
                $staticsClass = $classC->getClassesStatistics(); //Obtengo las estadisticas de las clases

                $resp['ok'] = true;
                $resp['data'] = ['examStart' => $staticsExam['data'], 'staticsClass' => $staticsClass['data']];
                $resp['message'] = 'Estadisticas obtenidas correctamente!';
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();                     //Devuelvo errores
            }
        }

        return $resp;
    }
}
