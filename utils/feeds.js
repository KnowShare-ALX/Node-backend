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
            ]);
            return result;
        } catch(error) {
            console.error(`FeedsError: ${error}`);
            return;
        }      
    }

    static simplePagination(page, pageSize) {
        return {
          start: (page - 1) * pageSize,
          end: ((page - 1) * pageSize) + pageSize
        }
    }

    static getPage(data, page, pageSize) {
        let startPage = (page - 1) * pageSize;
        let endPage = startPage + pageSize;
        if (data.length > startPage) {
            return data.slice(startPage, endPage);
        }
        return [];
    }
    
}
