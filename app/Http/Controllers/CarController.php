<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\InstructTimeStamp;
use App\Models\UrlData;
use Illuminate\Http\Request;

class CarController extends Controller
{
    /**
     * Funcion que devuelve los autos
     */
    public function getCar($callInt = false)
    {
        if (!$callInt) {
            $resp = $this->verifyToken();
        } else {
            $resp = ['ok' => true, 'message' => 'Call Interno', 'data' => ['tipo' => null]];   //Armo la respuesta generica
        }
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                $data = $resp['data'];
                switch ($data['tipo']) {
                        //Traigo todos los instructores de la mañana
                    case 'morning':
                        $cars = Car::whereNull('cars.deleted_at')
                            ->leftJoin('instruct_timestamp AS itM', 'itM.car_m_id', 'cars.id')
                            ->whereNull('itM.deleted_at')
                            ->leftJoin('url_data AS ud', 'ud.id', 'cars.url_data_id')
                            ->leftJoin('users AS usM', 'usM.id', 'itM.user_instruct_id')
                            ->leftJoin('url_data AS udInsM', 'udInsM.id', 'usM.url_data_id')
                            ->where('itM.time_start', '>=', '08:00:00')
                            ->select(
                                'cars.id AS idCar',
                                'cars.model AS model',
                                'ud.id AS idUrlData',
                                'ud.url AS imgCar',
                                'ud.description AS descriptionImg',
                                'udInsM.url AS imgInstr',
                                'itM.id AS idInstrTime',
                                'itM.time_start AS timeStartInstr',
                                'itM.time_end AS timeEndInstr',
                                'usM.id AS idUsuario',
                                'usM.name AS name',
                                'usM.lastname AS lastname',
                            )
                            ->get();
                        break;
                        //Traigo todos los instructores de la tarde
                    case 'afternoon':
                        $cars =  Car::whereNull('cars.deleted_at')
                            ->leftJoin('instruct_timestamp AS itT', 'itT.car_t_id', 'cars.id')
                            ->whereNull('itT.deleted_at')
                            ->leftJoin('url_data AS ud', 'ud.id', 'cars.url_data_id')
                            ->leftJoin('users AS usT', 'usT.id', 'itT.user_instruct_id')
                            ->leftJoin('url_data AS udInsT', 'udInsT.id', 'usT.url_data_id')
                            ->where('itT.time_end', '>=', '12:00:00')
                            ->select(
                                'cars.id AS idCar',
                                'cars.model AS model',
                                'ud.id AS idUrlData',
                                'ud.url AS imgCar',
                                'ud.description AS descriptionImg',
                                'udInsT.url AS imgInstr',
                                'itT.id AS idInstrTime',
                                'itT.time_start AS timeStartInstr',
                                'itT.time_end AS timeEndInstr',
                                'usT.id AS idUsuario',
                                'usT.name AS name',
                                'usT.lastname AS lastname',
                            )
                            ->get();
                        break;
                    default:
                        $cars = Car::whereNull('cars.deleted_at')
                            ->leftJoin('instruct_timestamp AS itM', 'itM.car_m_id', 'cars.id')
                            ->leftJoin('instruct_timestamp AS itT', 'itT.car_t_id', 'cars.id')
                            ->whereNull('itM.deleted_at')
                            ->whereNull('itT.deleted_at')
                            ->leftJoin('url_data AS ud', 'ud.id', 'cars.url_data_id')
                            ->leftJoin('users AS usM', 'usM.id', 'itM.user_instruct_id')
                            ->leftJoin('users AS usT', 'usT.id', 'itT.user_instruct_id')
                            ->leftJoin('url_data AS udInsM', 'udInsM.id', 'usM.url_data_id')
                            ->leftJoin('url_data AS udInsT', 'udInsT.id', 'usT.url_data_id')
                            ->select(
                                'cars.id AS idCar',
                                'cars.model AS model',
                                'ud.id AS idUrlData',
                                'ud.url AS imgCar',
                                'ud.description AS descriptionImg',
                                'itM.time_start AS timeStartInstrM',
                                'itM.time_end AS timeEndInstrM',
                                'usM.id AS idUsuarioM',
                                'usM.name AS nameM',
                                'udInsM.url AS imgInstrM',
                                'usM.lastname AS lastnameM',
                                'itT.id AS idInstrTime',
                                'itT.time_start AS timeStartInstrT',
                                'itT.time_end AS timeEndInstrT',
                                'usT.id AS idUsuarioT',
                                'udInsT.url AS imgInstrT',
                                'usT.name AS nameT',
                                'usT.lastname AS lastnameT',
                            )
                            ->get();
                        break;
                }
                if ($cars) {
                    $resp['data'] = $cars;
                    $resp['message'] = 'Vehiculos obtenidos correctamente!';                              //exito!!!!!! 😎
                    $resp['ok'] = true;
                } else {
                    $resp['message'] = 'No hay vehiculos';
                }
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();                     //Devuelvo errores
            }
        }

        return $resp;
    }

    /**
     * Funcion que guarda los autos
     */
    public function saveCar(Request $request)
    {
        $resp = $this->verifyTokenForm($request);
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                $data = $request->all();                                               //Obtengo datos del json
                $urlDataid = null;
                if ($request->hasFile('img')) {
                    $url = $request->file('img')->store('/img/cars', 'public');     //Guardamos la imagen enviada en la carpeta public/img
                    $newUrlData = UrlData::create([
                        'section' => 'car',
                        'type' => 'img',
                        'url' => $url,
                        'description' => $request->input('description'),
                    ]);
                    $urlDataid = $newUrlData->id;
                }
                $newCar = Car::create([
                    'model' => $data['model'],
                    'url_data_id' => $urlDataid,
                ]);
                if ($newCar) {
                    $newCarId = $newCar->id;
                    $instructM = InstructTimeStamp::where('user_instruct_id', $data['idInstrM'])->whereNull('deleted_at')->first();
                    $instructT = InstructTimeStamp::where('user_instruct_id', $data['idInstrT'])->whereNull('deleted_at')->first();
                    if ($instructM) {
                        $instructM->car_m_id = $newCarId;
                        $instructM->save();
                    }
                    if ($instructT) {
                        $instructT->car_t_id = $newCarId;
                        $instructT->save();
                    }
                    if ($instructM || $instructT) {
                        $newsCars = $this->getCar(true);
                        $objInstruct = new InstructTimestampController;
                        $newsInstruct = $objInstruct->getInstructTimestamp();
                        if ($newsCars) {
                            $resp['data'] = ['cars' => $newsCars['data'], 'instructTime' => $newsInstruct['data']];
                            $resp['message'] = 'Vehiculo creado correctamente con sus instructores!';                    //exito!!!!!! 😎
                            $resp['ok'] = true;
                        }
                    } else {
                        $resp['message'] = 'Falta al menos un instructor para cargar el vehiculo';
                    }
                } else {
                    $resp['message'] = 'Error al crear la imagen!';
                }
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();                     //Devuelvo errores
            }
        }

        return $resp;
    }

    /**
     * Funcion que edita todos los autos
     */
    public function editCar(Request $request)
    {
        $resp = $this->verifyTokenForm($request);
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                $data = $request->all();                                               //Obtengo datos del json
                $urlDataid = null;
                if ($request->hasFile('img')) {
                    $urlSave = $request->file('img')->store('/img/cars', 'public');     //Guardamos la imagen enviada en la carpeta public/img
                    $objNewUrlData = parent::deleteServImg($urlSave, $data['idUrlData']);   //Borro la imagen anterior
                    $urlDataid = $objNewUrlData->id;
                }
                if ($urlDataid) {
                    Car::where('id', $data['idCar'])                //Actualizo los datos del auto
                        ->update([
                            'model' => $data['model'],
                            'url_data_id' => $urlDataid,
                        ]);
                } else {
                    Car::where('id', $data['idCar'])                //Actualizo los datos del auto
                        ->update([
                            'model' => $data['model'],
                        ]);
                }
                InstructTimeStamp::where('car_m_id', $data['idCar'])
                    ->where('user_instruct_id', '!=', $data['idInstrM'])
                    ->update([
                        'car_m_id' => null,
                    ]);
                InstructTimeStamp::where('car_t_id', $data['idCar'])
                    ->where('user_instruct_id', '!=', $data['idInstrT'])
                    ->update([
                        'car_t_id' => null,
                    ]);
                $instructM = InstructTimeStamp::where('user_instruct_id', $data['idInstrM'])->first();      //Busco si envio un instructor a la mañana
                $instructT = InstructTimeStamp::where('user_instruct_id', $data['idInstrT'])->first();      //Busco si envio un instructor a la tarde
                if ($instructM) {                           //Actualizo el auto del instructor de la mañana
                    $instructM->car_m_id = $data['idCar'];
                    $instructM->save();
                }
                if ($instructT) {                           //Actualizo el auto del instructor de la tarde
                    $instructT->car_t_id = $data['idCar'];
                    $instructT->save();
                }
                if ($instructM || $instructT) {     //Veirifico que se envie algun instructor
                    $newsCars = $this->getCar(true);
                    $objInstruct = new InstructTimestampController;
                    $newsInstruct = $objInstruct->getInstructTimestamp();
                    if ($newsCars) {
                        $resp['data'] = ['cars' => $newsCars['data'], 'instructTime' => $newsInstruct['data']];
                        $resp['message'] = 'Vehiculo editado correctamente!';                    //exito!!!!!! 😎
                        $resp['ok'] = true;
                    }
                } else {
                    $resp['message'] = 'No se envio ningun instructor';                  //Devuelvo errores
                }
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();                     //Devuelvo errores
            }
        }

        return $resp;
    }

    //Elimina logicamente un auto
    public function deleteCar()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                $vehicle = Car::find($resp['data']['id']);

                if ($vehicle) {
                    // Accede a la relación 'instructTimeStamp' y establece 'car_id' en null
                    $instructTimeStampM = $vehicle->instructTimeStampM;
                    $instructTimeStampT = $vehicle->instructTimeStampT;

                    if ($instructTimeStampM) {
                        $instructTimeStampM->car_m_id = null;
                        $instructTimeStampM->save();
                    }
                    if ($instructTimeStampT) {
                        $instructTimeStampT->car_t_id = null;
                        $instructTimeStampT->save();
                    }

                    // Ahora puedes eliminar el vehículo
                    $vehicle->delete();
                    $newsCars = $this->getCar(true);
                    $objInstruct = new InstructTimestampController;
                    $newsInstruct = $objInstruct->getInstructTimestamp();
                    if ($newsCars) {
                        $resp['data'] = ['cars' => $newsCars['data'], 'instructTime' => $newsInstruct['data']];
                        $resp['message'] = 'Vehiculo eliminado correctamente!';                    //exito!!!!!! 😎
                        $resp['ok'] = true;
                    }
                } else {
                    $resp['message'] = 'El vehículo no se encontró.';
                }
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();                     //Devuelvo errores
            }
        }
        return $resp;
    }
}
