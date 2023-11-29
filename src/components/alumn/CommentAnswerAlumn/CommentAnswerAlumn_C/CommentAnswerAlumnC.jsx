import Control from "../../../../utils/Control";

export default class CommentAnswerAlumnC extends Control {

    //Metodo que obtiene todas las preguntas
    async getQuestions() {
        //Variables declaradas que se enviarán al json
        const nameApi = 'getAllQuestion';

        //Estructura de la consulta  /  Consulta a la api
        const { ok, message, data } = await super.requestApi({
            //JSON que se envía a la consulta 
            nameApi,
            jsonData: {
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

    //Metodo que obtiene todas las preguntas sin responder
    async createQuestion(alumnId, question) {
        //Variables declaradas que se enviarán al json
        const nameApi = 'createQuestion';

        //Estructura de la consulta  /  Consulta a la api
        const { ok, message, data } = await super.requestApi({
            //JSON que se envía a la consulta 
            nameApi,
            jsonData: {
                alumnId,  
                question
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


    //Metodo que busca las pregntas
    async serachQuestion(searchTitle) {

        //Variables declaradas que se enviarán al json
        const nameApi = 'searchQuestion';

        //Estructura de la consulta  /  Consulta a la api
        const { ok, message, data } = await super.requestApi({
            //JSON que se envía a la consulta 
            nameApi,
            jsonData: {
                search: searchTitle
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
            dataResp =
            {
                message: message,
            };
            console.error("Error API. ", message);
        }
        return dataResp;
    }

    //Metodo que busca las pregntas 
    async getHistoryQuestion(alumnId) {

        //Variables declaradas que se enviarán al json
        const nameApi = 'getForUser';
        //Estructura de la consulta  /  Consulta a la api
        const { ok, message, data } = await super.requestApi({
            //JSON que se envía a la consulta 
            nameApi,
            jsonData: {
                alumnId
            }
        })

        //Respuesta a la vista
        let dataResp = {
            ok: false,
            message: '',
            data: data,
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
            dataResp =
            {
                message: message,
            };
            console.error("Error API. ", message);
        }
        return dataResp;
    }

}