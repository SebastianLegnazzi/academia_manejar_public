import Control from "../../../../utils/Control";

export default class StatisticsC extends Control {

    async getStatics(param) {
        const apiConfig = {
            nameApi: 'getStatics',
            jsonData: param,
        };
        
        return await super.sendRequest(apiConfig);
    }

}