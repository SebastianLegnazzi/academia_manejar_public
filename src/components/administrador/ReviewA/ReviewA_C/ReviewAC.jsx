import Control from "../../../../utils/Control";

export default class ReviewAC extends Control {

    async getReviews(param) {
        const apiConfig = {
            nameApi: 'getReviews',
            jsonData: param,
        };
        
        return await super.sendRequest(apiConfig);
    }
}