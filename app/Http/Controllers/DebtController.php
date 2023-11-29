<?php

namespace App\Http\Controllers;

use App\Models\Debt;
use App\Http\Controllers\ClassesController;

class DebtController extends Controller
{
    public function editDebtSould()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $data = $resp['data'];
                $response['ok'] = true;
                $debt = Debt::with('turns.course')->find($data['debtId']);
                if (!$debt) {
                    $resp['message'] = 'Turno no encontrado';
                } else {
                    $pagosController = new MercadoPagoController();
                    $responsePayment = $pagosController->createPayment($debt, $data['saldoPagado'], $data['method']);

                    if($responsePayment['objDebt']->saldo <= 0){
                        $classesController = new ClassesController();
                        $response = $classesController->saveClasses($debt->turns);
                    }

                    $resp['data'] = $debt;
                    $resp['message'] = 'Deuda editada correctamente';
                    $resp['ok'] = (true && $response['ok']);
                }
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();
            }
        }
        return $resp;
    }

    
    /**
     * Activar o desactivar un turno
     */
     public function darBajaDebt()
     {
         $resp = $this->verifyToken();
         if ($resp['ok']) {
             try {
                 $resp['ok'] = false;
 
                 $idDebt = $resp['data']['debtId'];
                 $objDebt = Debt::find($idDebt);
 
                 if ($resp['data']['action'] === 'deactivate') {
                     $objDebt->update(['deleted_at' => now()]);
                 };

                 $turnController = new TurnController();
                 $turnController->darBajaTurn($objDebt->turns_id); 
 
                 $resp['data'] = $objDebt;                                                       //Devuelvo el array de deudas
                 $resp['message'] = 'Deuda eliminada correctamente!';                              //exito!!!!!! 😎
                 $resp['ok'] = true;
             } catch (\Exception $e) {
                 $resp['message'] = 'Error en el servidor: ' . $e->getMessage();                     //Devuelvo errores
             }
         }
         return $resp;
     }
}
