import Topic from "../models/topic";
import Content from "../models/content";
import User from "../models/user";

export default class FeedsHandler {
    static async generateDefault() {
        try {
            const result = await Content.aggregate([
                {
                  $match: {
                    course: []
                  }
                },
    
                {
                  $sort: { createdAt: -1 } 
                }
              ]).toArray();
            return result;
        } catch(error) {
            console.error(`FeedsError: ${error}`);
            return;
        }      
    }
    static getPage(data, page, pageSize) {
        startPage = (page - 1) * pageSize;
        endPage = startPage + pageSize;

        if (data.length > startPage) {
            return data.slice(startPage, endPage);
        }
        return [];
    }
}