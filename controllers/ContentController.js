import FilesController from './FilesController';
import Content from '../models/content';

export default class ContentController {
  static async createContent(req, res) {
    try {
      const content = await FilesController.createContent(req, res);
      if (!content) {
        throw new Error('Content creation error')
      }
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
}