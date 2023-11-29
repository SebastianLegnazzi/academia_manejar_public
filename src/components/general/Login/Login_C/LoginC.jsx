import Control from "../../../../utils/Control";

export default class LoginC extends Control {
    //Metodo que loguea al usuario
    async login(username, pass, rememberMe) {
        //console.log("getCourse")
        //Variables declaradas que se enviarán al json
        const nameApi = 'login';
        const passEncript = super.encryptPass(pass);
        //console.log(passEncript)
        //Estructura de la consulta  /  Consulta a la api
        const { ok, message, data } = await super.requestApi({
            //JSON que se envía a la consulta 
            nameApi,
            jsonData: {
                username,
                password: passEncript,
                rememberMe,
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
            dataResp.message = 'Usuario y/o contraseña no son correctos';
        }

        return dataResp;
    }

    //Metodo que verifica si el usuario esta ingresado
    async loginAutomatic() {
        //console.log("getCourse")
        //Variables declaradas que se enviarán al json
        const nameApi = 'loginAutomatic';
        //console.log(passEncript)
        //Estructura de la consulta  /  Consulta a la api
        const { ok, message, data } = await super.requestApi({
            //JSON que se envía a la consulta 
            nameApi,
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