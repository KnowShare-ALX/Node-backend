import FilesController from './FilesController';
import Content from '../models/content';
import User from '../models/user';
import FeedsHandler from '../utils/feeds';
import { validationResult} from 'express-validator';

export default class ContentController {
  static async createContent(req, res) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(500).json({error: 'internal server error'});
      }
      const content = await FilesController.createContent(req, res);
      if (!content) {
        throw new Error('Content creation error')
      }
      user.post.push(content.id);
      await user.save();
      return res.status(201).json(content);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: 'Server Error' });
    }
  }

  static async getContentById(req, res) {
    try {
      const { contentId } = req.query;
      if (!contentId) {
        return res.status(400).json({error: 'invalid or missing parameters!'});
      }
      const content = await Content.findById(contentId);
      if (!content) {
        return res.status(404).json({error: 'content not found'});
      }
      return res.status(200).json(content);
    } catch(error) {
      console.error(`getContentError: ${error}`);
      return res.status(500).json({error: 'internal server error'});
    }
  }

  static async feeds(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      let { page, pageSize } = req.query;
      pageSize = Number.isNaN(pageSize) ? 20: Number(pageSize);
      page = Number.isNaN(page) ? 1 : Number(page);
      const feeds = await FeedsHandler.generateDefault();
      const data = FeedsHandler.getPage(feeds, page, pageSize);
      if (data.length === 0) {
        throw new Error('Returned an emty array');
      } else{
        const paginationResult = FeedsHandler.simplePagination(page, pageSize);
        let start = paginationResult.start;
        let end = paginationResult.end;        
        const doc = {
          pageSize: data.length,
          page: page,
          data: data,
          previousPage: start > 0 ? page - 1: null,
          nextPage: data.length > end ? page + 1: null,
          totalPages: Math.ceil(feeds.length / pageSize)
        }
        res.status(200).json(doc)
      }
    } catch(error) {
      console.error(`FeedsError: ${error}`);
      return res.status(404).json({error: 'Not found'})
    }
  }
}