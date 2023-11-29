import Control from "../../../../utils/Control";

export default class EditCourseC extends Control {
    //Metodo que guarda los datos editados de un curso
    async edit(dataSave, selectedFile) {
        const nameApi = 'editCourse';
        const formData = new FormData();                    //Formulario a enviar
        formData.append('archive', selectedFile);               //Agrego la imagen al formulario
        formData.append('id', dataSave.id);                 //Agrego el id al formulario
        formData.append('title', dataSave.title);           //Agrego el titulo al formulario
        formData.append('price', dataSave.price);           //Agrego el precio al formulario
        formData.append('price_reservation', dataSave.price_reservation);           //Agrego el precio de reservación al formulario
        formData.append('url_data', dataSave.url_data); 
        formData.append('cantClass', dataSave.cant_class); 
        
        let concatFeatures = '';
        dataSave.features.map((value) => {                  //Recorro las caracteristicas
            concatFeatures += value.label + ' & ';          //Concateno las caracteristicas
            return null;
        });
        formData.append('features', concatFeatures);        //Agrego las caracteristicas al formulario
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

        console.log(dataResp);
        return dataResp;
    }

    //Metodo que elimina los datos editados de un curso
    async delete(dataSave, action) {
        console.log(dataSave);
        const nameApi = 'deactivateCourse';

        //Estructura de la consulta  /  Consulta a la api
        const { ok, message, data } = await super.requestApi({
            //JSON que se envía a la consulta 
            nameApi,
            jsonData: {
                id: dataSave.id,
                action
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
        console.log(dataSave);
        const nameApi = 'saveCourse';
        const formData = new FormData();                    //Formulario a enviar
        formData.append('img', selectedFile);               //Agrego la imagen al formulario
        formData.append('id', dataSave.id);                 //Agrego el id al formulario
        formData.append('title', dataSave.title);           //Agrego el titulo al formulario
        formData.append('price', dataSave.price);           //Agrego el precio al formulario
        formData.append('price_reservation', dataSave.price_reservation);           //Agrego el precio de reservación al formulario
        //formData.append('url_data_id', dataSave.data.url_data); //Agrego el  
        formData.append('cantClass', dataSave.cant_class); 
        let concatFeatures = '';
        dataSave.features.map((value) => {                  //Recorro las caracteristicas
            concatFeatures += value.label + ' & ';          //Concateno las caracteristicas
            return null;
        });
        formData.append('features', concatFeatures);        //Agrego las caracteristicas al formulario
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

    //Metodo que obtiene todos los datos necesarios para el home
    async getCourse() {
        //variables declaradas que se enviarán al json
        const nameApi = 'getCourse';
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