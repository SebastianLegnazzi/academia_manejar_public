import Control from "../../../../utils/Control";

export default class CalendarC extends Control {

    async requestApi(apiConfig) {
        const { ok, message, data } = await super.requestApi(apiConfig);

        const dataResp = {
            ok: false,
            message: '',
            data: null,
        };
        if (ok) {
            dataResp.ok = true;
            dataResp.message = message;
            dataResp.data = data;
        } else {
            console.error("Error API: ", message);
        }
        return dataResp;
    }

    //Metodo que obtiene el boton de pago
    async createPreference(title, price, priceReservation, userID, turnID, time) {
        //Variables declaradas que se enviarán al json
        const nameApi = 'createPreference';

        //Estructura de la consulta  /  Consulta a la api
        const { ok, message, data } = await super.requestApi({
            //JSON que se envía a la consulta 
            nameApi,
            jsonData: {
                title,
                price,
                userID,
                priceReservation,
                turnID,
                time,
            }
        })

        //Respuesta a la vista
        let dataResp = {
            ok: false,
            message: '',
            data: null,
        };

        //Verifico si la consulta fue satisfactoria o no
        if (ok) {
            //Armo la respuesta
            dataResp =
            {
                ok: true,
                message: message,
                data: data,
            };
        } else {
            console.error("Error API. ", message);
        }

        return dataResp;
    }

    //Metodo que obtiene los datos para el calendario
    async getCalendar() {
        const apiConfig = {
            nameApi: 'getCalendar',
            jsonData: {},
        };
        return await this.requestApi(apiConfig);
    }

    //Metodo que obtiene los turnos disponibles
    // async getAvailableTurnsTimes(date, cantDays, calendar) {
    //     const nameApi = 'getAvailableTurnsTimes';
    //     return await this.requestApi({ nameApi, jsonData: { date, cantDays, time_start: calendar.time_start, time_end: calendar.time_end  } });
    // }

    //Metodo que obtiene los turnos disponibles
    async getDatesTurns(instructTimestamp, franjaHoraria, cantClass) {
        const nameApi = 'getDatesInstruct';
        return await this.requestApi({ nameApi, jsonData: { instructTimestamp, franjaHoraria, cantClass } });
    }

    //Metodo que obtiene los autos con sus instructores
    async getCar(franjaHoraria) {
        const nameApi = 'getCar';
        return await this.requestApi({ nameApi, jsonData: { tipo: franjaHoraria } });
    }

    //Metodo que guardar o edita los datos de un turno
    async saveTurn(turn, action) {
        const nameApi = action === 'save' ? 'saveTurn' : 'editTurn';
        return await this.requestApi({
            nameApi, jsonData: turn
        });
    }

    //Metodo que elimina los datos editados de un curso
    async getInstructAvailableTimes(data) {
        const nameApi = 'getInstructAvailableTimes';
        return await this.requestApi({
            nameApi, jsonData: data
        });
    }
}