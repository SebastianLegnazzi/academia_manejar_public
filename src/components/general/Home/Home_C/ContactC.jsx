import Control from "../../../../utils/Control";

export default class ContactC extends Control {

    //Metodo que obtiene las imagenes del carrousel de la base de datos
    async sendEmail(name, email, messageEmail, telefono) {
        //Variables declaradas que se enviarán al json
        const nameApi = 'sendEmail';

        //Estructura de la consulta  /  Consulta a la api
        const { ok, message, data } = await super.requestApi({
            //JSON que se envía a la consulta 
            nameApi,
            jsonData: {
                name,
                email,
                messageEmail,
                telefono
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
}