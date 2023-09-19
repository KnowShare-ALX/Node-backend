export class BaseController {
    static removeSensitiveInfo(document) {
        const doc = document._doc; 
        delete doc.password;
        delete doc.email;
        return doc;
    }
}