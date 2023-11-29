import Control from "../../../../utils/Control";

export default class ExamC extends Control {

    async getExam(param) {
        const apiConfig = {
            nameApi: "getExam",
            jsonData: param,
        };
        return await super.sendRequest(apiConfig);
    }

    async getType() {
        const apiConfig = {
            nameApi: "getType",
            jsonData: null,
        };
        return await super.sendRequest(apiConfig);
    }

    async finishExam(objResultExam) {
        const apiConfig = {
            nameApi: "finishExam",
            jsonData: objResultExam,
        };
        return await super.sendRequest(apiConfig);
    }
}