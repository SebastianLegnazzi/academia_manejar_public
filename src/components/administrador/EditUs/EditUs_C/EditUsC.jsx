import Control from "../../../../utils/Control";

export default class EditUsC extends Control {
    //Metodo que guarda los datos editados de un curso
    async edit(dataSave, selectedFile) {
        const nameApi = 'editUs';
        const formData = new FormData();                    //Formulario a enviar
        formData.append('id', dataSave.id);                 //Agrego el id al formulario
        formData.append('name', dataSave.name);               //Agrego la imagen al formulario
        formData.append('description', dataSave.description);           //Agrego el precio al formulario
        formData.append('img', selectedFile);           //Agrego el precio al formulario
        formData.enctype = 'multipart/form-data';           //Agrego el tipo de formulario
        //Estructura de la consulta  /  Consulta a la api
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

    //Metodo que elimina los datos editados de un curso
    async delete(dataSave) {
        const nameApi = 'deleteUs';

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
    async save(dataSave, selectedFile) {
        const nameApi = 'saveUs';
        const formData = new FormData();                    //Formulario a enviar
        formData.append('id', dataSave.id);                 //Agrego el id al formulario
        formData.append('name', dataSave.name);               //Agrego la imagen al formulario
        formData.append('description', dataSave.description);           //Agrego el precio al formulario
        formData.append('img', selectedFile);           //Agrego el precio al formulario
        formData.enctype = 'multipart/form-data';           //Agrego el tipo de formulario
        //Estructura de la consulta  /  Consulta a la api
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

    // // Metodo que desactiva los datos editados de un curso
    // async desactivate(dataSave) {
    //     const nameApi = 'desactivateCourse';

    //     //Estructura de la consulta  /  Consulta a la api
    //     const { ok, message, data } = await super.requestApi({
    //         //JSON que se envía a la consulta 
    //         nameApi,
    //         jsonData: {
    //             id: dataSave.id,
    //         },
    //     })

    //     //Respuesta a la vista
    //     let dataResp = {
    //         ok: false,
    //         message: '',
    //         data: null,
    //     };

    //     //Verifico si la consulta fue satisfactoria o no
    //     if (ok) {
    //         //Armo la respuesta
    //         dataResp =
    //         {
    //             ok: true,
    //             message: message,
    //             data: data,
    //         };
    //     } else {
    //         dataResp.message = message;
    //     }

    //     return dataResp;
    // }

    // //Metodo que activa los datos editados de un curso
    // async activate(dataSave) {
    //     const nameApi = 'activateCourse';

    //     //Estructura de la consulta  /  Consulta a la api
    //     const { ok, message, data } = await super.requestApi({
    //         //JSON que se envía a la consulta 
    //         nameApi,
    //         jsonData: {
    //             id: dataSave.id,
    //         },
    //     })

    //     //Respuesta a la vista
    //     let dataResp = {
    //         ok: false,
    //         message: '',
    //         data: null,
    //     };

    //     //Verifico si la consulta fue satisfactoria o no
    //     if (ok) {
    //         //Armo la respuesta
    //         dataResp =
    //         {
    //             ok: true,
    //             message: message,
    //             data: data,
    //         };
    //     } else {
    //         dataResp.message = message;
    //     }

    //     return dataResp;
    // }

}