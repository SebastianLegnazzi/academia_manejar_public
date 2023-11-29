import Control from "../../../../utils/Control";

export default class EditCarrouselC extends Control {
    
    //Metodo que elimina los datos editados de un curso
    async deleteCarrouselImg(dataSave) {
        const nameApi = 'deleteData';

        //Estructura de la consulta  /  Consulta a la api
        const { ok, message, data } = await super.requestApi({
            //JSON que se envía a la consulta 
            nameApi,
            jsonData: {
                id: dataSave.id,
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
    async saveCarrousel(datos) {
        const nameApi = 'addData';
        const formData = new FormData();
        formData.append('img', datos.selectedFile);   
        formData.append('section', 'flota'); 
        formData.append('type', 'imagen');                           //Agrego las caracteristicas al formulario
        formData.append('description', datos.description);    
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