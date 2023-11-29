import Control from "../../../../utils/Control";

export default class NotificationC extends Control {

    async getNoti(param) {
        const apiConfig = {
            nameApi: "getNoti",
            jsonData: param,
        };
        return await super.sendRequest(apiConfig);
    }
    async deleteNoti(param) {
        const apiConfig = {
            nameApi: "deleteNoti",
            jsonData: param,
        };
        return await super.sendRequest(apiConfig);
    }
}