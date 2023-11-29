<?php

// SDK de Mercado Pago
namespace App\Http\Controllers;

use App\Models\Debt;
use App\Models\Payment;
use App\Models\RoleUser;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use MercadoPago\SDK;

class MercadoPagoController extends Controller
{
  public function __construct()
  {
    SDK::setAccessToken(env('MP_SECRET'));
  }

  /**
   * Crea una preferencia de pago
   */
  public function createPreference()
  {
    $resp = $this->verifyToken();
    if ($resp['ok']) {
      try {
        $data = $resp['data'];       //Obtengo los datos enviados
        //Creo la deuda para luego guardarla en la base de datos
        $priceTot = $data['price'] - $data['priceReservation'];
        Debt::create([
          'total_debt' => $priceTot,
          'saldo' => $priceTot,
          'users_id' => $data['userID'],
          'concept' => $data['title'],
          'turns_id' => $data['turnID'],
        ]);
        //Creo la deuda para la reservacion
        $objDebtReserv = Debt::create([
          'total_debt' => $data['priceReservation'],
          'saldo' => $data['priceReservation'],
          'users_id' => $data['userID'],
          'concept' => 'RESERVA DE ' . $data['title'],
          'turns_id' => $data['turnID'],
        ]);

        //Creo la preferencia de pago
        $expirationInSeconds = 1800; // 30 minutos
        $preference = new \MercadoPago\Preference();
        $item = new \MercadoPago\Item();
        $item->title = 'RESERVA DE ' . $data['title'];
        $item->quantity = 1;
        $item->unit_price = $data['priceReservation'];
        $preference->metadata = [
          'userID' => $data['userID'],
          'debtID' => $objDebtReserv->id,
        ];
        $preference->items = array($item);
        $preference->expiration_date_from = now()->toIso8601String(); // Fecha y hora actual
        $preference->expiration_date_to = now()->addSeconds($expirationInSeconds)->toIso8601String(); // Fecha y hora de vencimiento
        $preference->expires = true;    // Habilita el tiempo de expiración
        $preference->back_urls = [       //URL de redireccionamiento segun el estado del pago
          'success' => 'http://localhost:3000/my_curse',
          'failure' => 'http://localhost:3000',
          'pending' => 'http://localhost:3000',
        ];
        $preference->save();
        $preferenceUrl = $preference->init_point;  //Obtengo la url de pago
        $resp['ok'] = true;
        $resp['message'] = 'Preferencia creada con exito';
        $resp['data'] = $preferenceUrl;
      } catch (\Exception $e) {
        $resp['message'] = $e->getMessage();
      }
    }
    return $resp;
  }


  /**
   *  Obtiene el pago y lo guarda en la base de datos  
   */
  public function obtenerPago()
  {
    $resp = ['ok' => false, 'message' => 'Error', 'data' => null];       //Armo la respuesta generica
    try {
      $postData = request()->all();       //Obtengo toda la respuesta
      $idPayment = $postData['data']['id'];   //Obtengo el id del pago
      $payment = \MercadoPago\Payment::find_by_id($idPayment);   //Obtengo el id y busco el pago

      Log::channel('mp')->info('----------- DEBUG MERCADO PAGO -----------');   //Inicializo el debug (se almacena en storage/logs/mercado_pago)
      Log::channel('mp')->info('----------- POST -----------');
      Log::channel('mp')->info(print_r($postData, true));       // Guardo todo lo enviado
      Log::channel('mp')->info('----------- OBJ PAYMENT -----------');
      Log::channel('mp')->info(print_r($payment, true));            //Guardo lo que me devuelve el objeto Payments
      $objDebt = null;
      //Verifico si el pago contiene deuda
      if ($payment->metadata->debt_id) {

        $objDebt = Debt::with('turns.course', 'turns.userAlumn', 'turns.instructTimestamp.userInstruct')->find($payment->metadata->debt_id);
      } else {
        Log::channel('mp')->info('---------- El pago no tiene deuda ----------');
        Log::channel('mp')->info('---------- Metadata ----------');
        Log::channel('mp')->info(print_r($payment->metadata, true));

        $resp['message'] = 'El pago no contiene deuda!';
      }
      if ($payment->status === 'approved' && $objDebt) {    //El estado es aprovado entonces efectuo la canselacion de la deuda y cambio roles
        Log::channel('mp')->info('---------- El estado es aprobado ----------');

        Log::channel('mp')->info('----------- RESTA -----------');
        Log::channel('mp')->info($objDebt->saldo . "-" . $payment->transaction_amount);

        $this->createPayment($objDebt, $payment->transaction_amount, 'Mercado Pago');

        Log::channel('mp')->info('----------- OBJ DEBT -----------');
        Log::channel('mp')->info(print_r($objDebt, true));
        Log::channel('mp')->info('----------- FIN DEBUG MERCADO PAGO -----------');

        RoleUser::where('user_id', $payment->metadata->user_id)->update(['role_id' => 4]);   //Pongo rol de alumno al usuario

        // Realizo notificacion al usuario
        $userId = $payment->metadata->user_id;
        $message = "Se ha realizado el pago con éxito! </br>
        Podrá ingresar a <a href='" . env('APP_URL') . "my_curse'>Mis cursos</a> y comenzar a cursar!";
        $motive = "Pago exitoso de Mercado Pago";

        $notiC = new NotificationController();
        $notiC->sendAllNoti($userId, $message, $motive);

        // Realizo notificacion al administrador
        $userId = 3;
        $message = "Se ha realizado un pago del curso ". $payment->description ." del usuario " . 
        $objDebt->turns->userAlumn->name . " " . $objDebt->turns->userAlumn->lastname;
        $motive = "Pago exitoso de Mercado Pago";

        $notiC = new NotificationController();
        $notiC->sendAllNoti($userId, $message, $motive);

        // Realizo notificacion al instructor
        $userId = $objDebt->turns->instructTimestamp->userInstruct->id;
        $message = "El alumno " . $objDebt->turns->userAlumn->name . " " . $objDebt->turns->userAlumn->lastname . "
        realizo la reserva del " . $objDebt->turns->course->title . " con la fecha de inicio el " . $objDebt->turns->date_turn_ini . " </br>
        Podrá ingresar a <a href='" . env('APP_URL') . "itinerary'>Itinerario</a> el dia de comienzo para realizar el seguimiento.";
        $motive = "Reserva de turno realizada con éxito de " . $objDebt->turns->userAlumn->name . " " . $objDebt->turns->userAlumn->lastname;

        $notiC->sendAllNoti($userId, $message, $motive);

        $resp['ok'] = true;
        $resp['message'] = 'Pago realizado con exito';
        $resp['data'] = $payment;
      } else {
        Log::channel('mp')->info('---------- El estado es denegada ----------');
        $objTurnC = new TurnController();
        $param['id'] = $objDebt->turns_id;
        $objTurnC->deleteTurn($param);
        $resp['message'] = 'Pago denegado';
      }
    } catch (\Exception $e) {
      Log::channel('mp')->info('----------- ERROR -----------');
      Log::channel('mp')->info($e->getMessage());
      Log::channel('mp')->info('----------- FIN ERROR -----------');
      $resp['message'] = $e->getMessage();
    }
    return $resp;
  }

  public function createPayment($objDebt, $total, $method)
  {
    $resp = [
      "ok" => false,
      "message" => 'Hubo un error al crear el pago',
    ];
    try {
      $objPayment = Payment::create([
        'total_payment' => $total,
        'debts_id' => $objDebt->id,
        'method' => $method,
      ]);
      $objDebt->saldo = ($objDebt->saldo - $total);
      $objDebt->save();
      if ($objPayment) {
        $resp = [
          "ok" => true,
          "message" => 'Se creó el pago con exito',
          "objPayment" => $objPayment,
          "objDebt" => $objDebt
        ];
      }
    } finally {
    };

    return $resp;
  }
}
