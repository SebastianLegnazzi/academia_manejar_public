import Control from "../../../../utils/Control";

export default class HomeC extends Control {

    //Metodo que obtiene todos los datos necesarios para el home
    async getHome() {
        //variables declaradas que se enviarán al json
        const nameApi = 'getHome';

        //estructura de la consulta  /  consulta a la api
        const { ok, message, data } = await super.requestApi({
            //json que se envía a la consulta 
            nameApi,
        })

        //respuesta a la vista
        let dataResp = {
            ok: false,
            message: '',
            data: null,
        };

        // Verifico si la consulta fue satisfactoria o no
        if (ok) {
            // Armo la respuesta
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
}