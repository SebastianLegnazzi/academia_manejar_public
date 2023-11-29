import Control from "../../../../utils/Control";

export default class CommentAnswerInstrC extends Control {

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
    async getPendingQuestion(instructId) {
        //Variables declaradas que se enviarán al json
        const nameApi = 'getPendingQuestion';

        //Estructura de la consulta  /  Consulta a la api
        const { ok, message, data } = await super.requestApi({
            //JSON que se envía a la consulta 
            nameApi,
            jsonData: {
                instructId, 
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

    //Metodo que busca las pregntas segun el rol 
    // 5 = alumno
    // 3 = administrador
    async getHistoryQuestion(instructId) {

        //Variables declaradas que se enviarán al json
        const nameApi = 'getForUser';
        //Estructura de la consulta  /  Consulta a la api
        const { ok, message, data } = await super.requestApi({
            //JSON que se envía a la consulta 
            nameApi,
            jsonData: {
                instructId,
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

    //Metodo que responde una pregunta
    async responseQuestion(instructId, questionId, answer, type) {

        //Variables declaradas que se enviarán al json
        const nameApi = 'responseQuestion';

        //Estructura de la consulta  /  Consulta a la api
        const { ok, message, data } = await super.requestApi({
            //JSON que se envía a la consulta 
            nameApi,
            jsonData: {
                instructId,
                questionId: questionId,
                answer: answer,
                type,
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