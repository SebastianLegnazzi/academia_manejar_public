import Control from "../../../../utils/Control";

export default class ProfileC extends Control {
    //Metodo que loguea al usuario
    async editProfile(user, canvas) {
        //Variables declaradas que se enviarán al json
        const nameApi = 'update_user';
        const formData = new FormData();
        formData.append('id', user.id);
        formData.append('email', user.email);
        formData.append('username', user.username);
        formData.append('lastname', user.lastname);
        formData.append('name', user.name);
        if (canvas) {
            formData.append('img', canvas);
        }
        formData.append('idUrlData', user.idPhotoUser);
        formData.enctype = 'multipart/form-data';           //Agrego el tipo de formulario
        //Estructura de la consulta  /  Consulta a la api
        const { ok, message, data } = await super.requestApiForm({
            //JSON que se envía a la consulta 
            nameApi,
            formData
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