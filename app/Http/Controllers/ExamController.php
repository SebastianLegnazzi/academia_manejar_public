<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\QuestionExam;
use App\Models\ResultExam;
use Illuminate\Http\Request;

class ExamController extends Controller
{
    /**
     * Funcion que devuevle el examaen
     */
    public function getExam()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                $data = $resp['data'];
                $randomQuestions = QuestionExam::inRandomOrder()
                    ->limit($data['questions'])
                    ->get();
                if (!$randomQuestions->isEmpty()) {
                    $resp['data'] = $randomQuestions;
                    $resp['ok'] = true;
                    $resp['message'] = 'Examen obtenido correctamente!';
                } else {
                    $resp['message'] = 'Error al buscar preguntas!';
                }
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();                     //Devuelvo errores
            }
        }

        return $resp;
    }

    /**
     * Funcion que devuelve todos los tipos de examenes
     */
    public function getType()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                $allExamType = Exam::all();
                if ($allExamType) {
                    $resp['data'] = $allExamType;
                    $resp['ok'] = true;
                    $resp['message'] = 'Tipos de examen obtenido correctamente!';
                } else {
                    $resp['message'] = 'Error al buscar tipos de examen!';
                }
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();                     //Devuelvo errores
            }
        }

        return $resp;
    }

    /**
     * Funcion que devuelve todos los tipos de examenes
     */
    public function finishExam()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                $data = $resp['data'];
                ResultExam::create([
                    'user_alumn_id' => $data['userId'],
                    'exam_id' => $data['param']['id'],
                    'correct' => $data['result']['correctas'],
                    'incorrect' => $data['result']['incorrectas'],
                    'result' => $data['result']['promedio'],
                    'min_approved' => $data['param']['minApproved'],
                    'time_exam' => $data['result']['time'],
                ]);
                $resp['ok'] = true;
                $resp['message'] = 'Examen finalizado correctamente!';
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();                     //Devuelvo errores
            }
        }

        return $resp;
    }


    //Funcion auxiliar para estadísticas de examen - Actualiza las estadísticas
    public function updateExamStats($examStats, $result)
    {
        $examStats['nota maxima'] = max($examStats['nota maxima'], $result);
        $examStats['nota minima'] = min($examStats['nota minima'], $result);
        $examStats['resultado total'] += $result;
        $examStats['examenes realizados']++;
        $examStats['promedio'] = $examStats['resultado total'] / $examStats['examenes realizados'];

        return $examStats;
    }

    //Funcion auxiliar para estadísticas de examen - Inicializa las estadísticas
    public function initializeExamStats($result, $nameExam)
    {
        return [
            'examen' => $nameExam,
            'nota maxima' => $result,
            'nota minima' => $result,
            'resultado total' => $result,
            'examenes realizados' => 1,
            'promedio' => $result,
        ];
    }

    //Funcion auxiliar para estadísticas de examen - Da formato al array para el grafico
    public function transformarDatos($datos)
    {
        $nuevosDatos = [];

        foreach ($datos as $examen) {
            $nuevoExamen = [
                "examen" => $examen["examen"],
                "nota maxima" => $examen["nota maxima"],
                "nota maximaColor" => "hsl(230, 70%, 50%)",
                "nota minima" => $examen["nota minima"],
                "nota minimaColor" => "hsl(233, 70%, 50%)",
                "resultado total" => $examen["resultado total"],
                "resultado totalColor" => "hsl(27, 70%, 50%)",
                "examenes realizados" => $examen["examenes realizados"],
                "examenes realizadosColor" => "hsl(67, 70%, 50%)",
                "promedio" => $examen["promedio"],
                "promedioColor" => "hsl(281, 70%, 50%)"
            ];

            $nuevosDatos[] = $nuevoExamen;
        }

        return $nuevosDatos;
    }

    //Funcion que devuelve las estadísticas de los examenes
    public function statisticExam()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                $data = $resp['data'];

                $arrayObjExam = ResultExam::where('user_alumn_id', $data['idUser'])
                    ->with('exam')
                    ->get();

                $arrayResult = [
                    'aprobados' => 0,
                    'desaprobados' => 0,
                    'exam' => [],
                ];

                foreach ($arrayObjExam as $objExam) {
                    $nameExam = $objExam->exam->type;
                    $indexExam = $objExam->exam->id;
                    $result = $objExam->result;

                    // Contador de aprobados y desaprobados
                    if ($objExam->min_approved <= $result) {
                        $arrayResult['aprobados']++;
                    } else {
                        $arrayResult['desaprobados']++;
                    }

                    // Manejo de estadísticas por examen
                    if (!isset($arrayResult['exam'][$indexExam])) {
                        $arrayResult['exam'][$indexExam] = $this->initializeExamStats($result, $nameExam);
                    } else {
                        $arrayResult['exam'][$indexExam] = $this->updateExamStats($arrayResult['exam'][$indexExam], $result);
                    }

                    // Manejo de estadísticas generales
                    if (!isset($arrayResult['exam']['general'])) {
                        $arrayResult['exam']['general'] = $this->initializeExamStats($result, 'General');
                    } else {
                        $arrayResult['exam']['general'] = $this->updateExamStats($arrayResult['exam']['general'], $result);
                    }
                }

                $arrayResult['exam'] = $this->transformarDatos($arrayResult['exam']);

                usort($arrayResult['exam'], function($a, $b) {
                    if ($a['examen'] === 'General') {
                        return 1; // Si es 'General', se coloca al final
                    } elseif ($b['examen'] === 'General') {
                        return -1; // Si $b es 'General', se coloca antes de $a
                    } else {
                        return $a['promedio'] - $b['promedio']; // Ordenar por promedio en otros casos
                    }
                });

                $resp['data'] = $arrayResult;
                $resp['ok'] = true;
                $resp['message'] = 'Estadísticas obtenidas correctamente!';
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();
            }
        }
        return $resp;
    }
}
