import Control from "../../../../utils/Control";

export default class EditCarC extends Control {

    //Metodo que elimina vehiculos
    async deleteCar(dataSave) {
        const nameApi = 'deleteCar';
        //Estructura de la consulta  /  Consulta a la api
        const { ok, message, data } = await super.requestApi({
            //JSON que se envía a la consulta 
            nameApi,
            jsonData: {
                id: dataSave.idCar,
                tipo: null
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

    //Metodo que elimina los datos editados de un curso
    async getCar() {
        const nameApi = 'getCar';

        //Estructura de la consulta  /  Consulta a la api
        const { ok, message, data } = await super.requestApi({
            //JSON que se envía a la consulta 
            nameApi,
            jsonData: {
                tipo: null
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

    //Metodo que elimina los datos editados de un curso
    async getInstructTimestamp() {
        const nameApi = 'getInstructTimestamp';

        //Estructura de la consulta  /  Consulta a la api
        const { ok, message, data } = await super.requestApi({
            //JSON que se envía a la consulta 
            nameApi,
            jsonData: {
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

    //Metodo que busca los cursos
    async saveCar(datos) {
        const nameApi = 'saveCar';
        const formData = new FormData();
        formData.append('img', datos.selectedFile);
        formData.append('description', datos.description);
        formData.append('model', datos.model);
        formData.append('idInstrM', datos.instructorSelectM);
        formData.append('idInstrT', datos.instructorSelectT);
        formData.enctype = 'multipart/form-data';                    //Agrego el tipo de formulario
        const { ok, message, data } = await super.requestApiForm({
            //JSON que se envía a la consulta 
            nameApi,
            formData,
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

    //Metodo que busca los cursos
    async editCar(datos) {
        const nameApi = 'editCar';
        const formData = new FormData();
        console.log(datos);
        formData.append('idUrlData', datos.idUrlData);
        formData.append('idCar', datos.idCar);
        formData.append('img', datos.selectedFile);
        formData.append('description', datos.description);
        formData.append('model', datos.model);
        formData.append('idInstrM', datos.instructorSelectM);
        formData.append('idInstrT', datos.instructorSelectT);
        formData.enctype = 'multipart/form-data';                    //Agrego el tipo de formulario

        const { ok, message, data } = await super.requestApiForm({
            //JSON que se envía a la consulta 
            nameApi,
            formData,
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