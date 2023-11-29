import Control from "../../../../utils/Control";

export default class ReviewC extends Control {

    async getPendingReviews(param) {
        const apiConfig = {
            nameApi: 'getPendingReviews',
            jsonData: param,
        };
        
        return await super.sendRequest(apiConfig);
    }

    async saveReview(param) {
        const apiConfig = {
            nameApi: 'saveReview',
            jsonData: param,
        };
        
        return await super.sendRequest(apiConfig);
    }
}