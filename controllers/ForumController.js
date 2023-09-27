import Forum from '../models/forums';
import User from '../models/user';
import { validationResult } from 'express-validator';
import { BaseController } from './BaseController';
export default class ForumController {
    static async createForum(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty) {
                return res.status(400).json({errors: errors.array()});
            }
            const userId  = req.user.id;
            const { title, description } = req.body;
            const forum = await Forum.findOne({title});
            if (forum) {
                console.error(`ForumError: Forum already exist with the title [${title}]`);
                return res.status(409).json({error: 'Forum with same name already exists!'});
            }
            const forumObj = {
                title,
                description: Boolean(description) ? description: 'Welcome to KnowShare forum!',
                author: userId,
                admins: [userId],
                moderators: [userId],
                members: [userId]
            }
            const doc  = new Forum(forumObj);
            await doc.save();
            console.log(`UserId<${userId}>: created forum [${title}]`);
            const response = BaseController.forumSerializer(doc);
            const user = await User.findById(userId);
            user.forums.push(response._id);
            await user.save();
            return res.status(201).json({forumId: response._id, ...response});
        } catch(error) {
            console.error(`CreateForumError: ${error}`);
            return res.status(500).json({error: 'internal server error'});
        }
    }
}