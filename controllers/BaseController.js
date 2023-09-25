const dateFormat  = { year: 'numeric', month: 'long', day: 'numeric'};

export class BaseController {
    static removeSensitiveInfo(document) {
        const doc = document._doc; 
        delete doc.password;
        delete doc.email;
        return doc;
    }

    static userSerializer(document) {
        const doc = document._doc;
        delete doc.password;
        doc.id = doc._id;
        delete doc._id;
        const isoDate = new Date(doc.joinedDate);
        doc.joinedDate = isoDate.toLocaleDateString('en-US', dateFormat);
        delete doc.blackList;
        doc.subscribers = doc.subscribers.length;
        doc.followers = doc.followers.length;
        doc.following = doc.following.length;
        return doc;
    }
}