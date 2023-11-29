import Control from "../../../../utils/Control";

export default class RegisterC extends Control {
    //Metodo que loguea al usuario
    async register(name, lastname, email, username, pass) {
        //console.log("getCourse")
        //Variables declaradas que se enviarán al json
        const nameApi = 'register';
        const passEncript = super.encryptPass(pass);
        //console.log(passEncript)
        //Estructura de la consulta  /  Consulta a la api
        const { ok, message, data } = await super.requestApi({
            //JSON que se envía a la consulta 
            nameApi,
            jsonData: {
                name,
                lastname,
                email,
                username,
                password: passEncript,
            },
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
            dataResp.message = message;
        }

        return dataResp;
    }
}