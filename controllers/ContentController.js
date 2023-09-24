import FilesController from './FilesController';

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
}