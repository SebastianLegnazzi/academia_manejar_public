import axios from "axios";
var CryptoJS = require("crypto-js");

const {
    REACT_APP_URL_API,
    REACT_APP_USU_API,
    REACT_APP_PASS_API,
    REACT_APP_PRIV_KEY,
    REACT_APP_IV,
} = process.env;


export default class Control {

    /**
      * Realiza la llamada a la API
      * @param {json} datos 
      * @returns {json}
      */
    async requestApi(datos) {
        let usu = REACT_APP_USU_API;                                    //usuario de la API
        let pass = REACT_APP_PASS_API;                                  //password de la API
        pass = this.encryptPass(pass);                                  //encripto password
        const urlAPI = REACT_APP_URL_API;
        //url de la API
        const { nameApi, jsonData } = datos;
        let encrypt = this.encrypt(`{ "usu": "${usu}", "pass": "${pass}", "jsonData": ${jsonData ? JSON.stringify(jsonData) : JSON.stringify({})}}`);
        let token = localStorage.getItem('token') ? localStorage.getItem('token') : '';             //token de la API
        const response = axios.post(urlAPI + nameApi,                   //llamada a la API
            { crypt: encrypt },
            {
                headers: {
                    "Content-type": 'application/json',
                    "Authorization": `Bearer ${token}`,         // Agregar el token Bearer al header
                },
                timeout: 20 * 1000, //1ms * 1000ms = 1 segundo
            }
        ).then((response) => {                                          //respuesta la API
            if (response.status !== 200) {
                throw new Error(
                    "Ocurrió un error al llamar a la API. Código de error: " +
                    response.status
                );
            }
            return response.data;
        })
            .then((data) => {                                           //datos la API
                return data;
            })
            .catch((error) => {                                         //error la API
                console.error("Error en el servidor ---");
                console.error(error);
            });

        return response;
    }

    /**
      * Realiza la llamada a la API enviando un formulario
      * @param {json} datos 
      * @returns {json}
      */
    async requestApiForm(datos) {
        let usu = REACT_APP_USU_API;                                    //usuario de la API
        let pass = REACT_APP_PASS_API;                                  //password de la API
        pass = this.encryptPass(pass);                                  //encripto password
        const urlAPI = REACT_APP_URL_API;                               //url de la API
        const { nameApi, formData } = datos;                            //nombre del WS y datos a enviar
        formData.append('usu', usu);
        formData.append('pass', pass);
        let token = localStorage.getItem('token') ? localStorage.getItem('token') : '';    //token de la API
        const response = axios.post(urlAPI + nameApi,                   //llamada a la API
            formData,
            {
                headers: {
                    "Content-type": 'multipart/form-data',
                    "Authorization": `Bearer ${token}`,         // Agregar el token Bearer al header
                },
                timeout: 20 * 1000, //1ms * 1000ms = 1 segundo
            }
        ).then((response) => {                                          //respuesta la API
            if (response.status !== 200) {
                throw new Error(
                    "Ocurrió un error al llamar a la API. Código de error: " +
                    response.status
                );
            }
            return response.data;
        })
            .then((data) => {                                           //datos la API
                return data;
            })
            .catch((error) => {                                         //error la API
                console.error("Error en el servidor ---");
                console.error(error);
            });

        return response;
    }

    /**
     * Realiza la llamada a la API
     * @param {json} apiConfig
     * @returns {json}
     */
    async sendRequest(apiConfig, form = false) {
        let resp

        if (form) {
            // Si es un formulario envio apiConfig = {nameApi, formData}
            resp = await this.requestApiForm(apiConfig);
        } else {
            // Si es un json envio apiConfig = {nameApi, jsonData}
            resp = await this.requestApi(apiConfig);
        }

        // Desestructuro la respuesta
        const { ok, message, data } = resp;

        const dataResp = {
            ok: false,
            message: '',
            data: null,
        };

        if (ok) {
            dataResp.ok = true;
            dataResp.message = message;
            dataResp.data = data;
        } else {
            dataResp.message = message;
            console.error("Error API: ", message);
        }
        return dataResp;
    }

    /**
     * Encripta API
     * @param {string} pass
     * @returns {string}
     * */
    encrypt(pass) {
        let appKey = REACT_APP_PRIV_KEY;
        let appIv = REACT_APP_IV;
        var key = CryptoJS.enc.Hex.parse(appKey);
        var iv = CryptoJS.enc.Hex.parse(appIv);
        var encrypted = CryptoJS.AES.encrypt(pass, key, { iv: iv });
        encrypted = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
        return encrypted;
    }

    /**
     * Encripta password
     * @param {string} pass
     * @returns {string}
     * */
    encryptPass(pass) {
        var encrypted = CryptoJS.SHA1(pass).toString(CryptoJS.enc.Base64);
        return encrypted;
    }
}


