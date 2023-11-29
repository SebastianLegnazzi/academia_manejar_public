import Control from "../../../../utils/Control";

export default class PaymentsC extends Control {
    
    async requestApi(apiConfig) {
        const { ok, message, data } = await super.requestApi(apiConfig);

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
            console.error("Error API: ", message);
        }
        return dataResp;
    }

    //Metodo que busca todos los turnos que tienen reserva pero le faltan los demás pagos
    async getTurnsExeptPay(data = {}) {
        const nameApi = 'getTurnsExeptPay';
        return await this.requestApi({
            nameApi, jsonData: data
        });
    }

    //Metodo que elimina los datos editados de un curso
    async editDebtSould(data = {}) {
        const nameApi = 'editDebtSould';
        return await this.requestApi({
            nameApi, jsonData: data
        });
    }

    //Metodo que elimina los datos editados de un curso
    async darBajaDebt(data = {}) {
        const nameApi = 'darBajaDebt';
        return await this.requestApi({
            nameApi, jsonData: data
        });
    }
}