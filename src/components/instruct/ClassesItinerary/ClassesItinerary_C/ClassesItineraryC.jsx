import Control from "../../../../utils/Control";

export default class ClassesItineraryC extends Control {

    async getClassesForDate(param) {
        const apiConfig = {
            nameApi: "getClassesForDate",
            jsonData: param,
        };
        return await super.sendRequest(apiConfig);
    }

    async setAssis(param) {
        const apiConfig = {
            nameApi: "setAssis",
            jsonData: param,
        };
        return await super.sendRequest(apiConfig);
    }

    async setObservation(param) {
        const apiConfig = {
            nameApi: "setObservation",
            jsonData: param,
        };
        return await super.sendRequest(apiConfig);
    }
}