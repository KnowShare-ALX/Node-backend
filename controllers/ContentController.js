const Content = require('../models/content');
const { validationResult } = require('express-validator');
import FileManager from '../utils/files';
const mongoose = require('mongoose');
const videoPath = 'files/contents/videos';
const picturePath = 'files/contents/pictures';
const articlePath = 'files/contents/articles';
import { ObjectId } from 'mongodb';

export default class ContentController {
  static async createContent(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        title,
        description,
        type,
      } = req.body;
      const userId = req.user._id;


      const content = new Content({
        title,
        description,
        type,
        author: userId,
      });

      // Process uploaded files based on their types (e.g., pictures, videos, articles)
      for (const file of req.files) {
        if (file.mimetype.startsWith('image')) {
          const fileName = `${userId}-${Date.now()}.jpg`;
          const fileUrl = await FileManager.saveFileToFirebaseStorage(
            `${picturePath}/${fileName}`,
            file.mimetype,
            file.buffer
          );
          if (!fileUrl) {
            res.status(500).json({ error: 'internal server error' });
            return;
          }
          content.pictureUrl.push(fileUrl);

        } else if (file.mimetype.startsWith('video')) {
          const fileName = `${userId}-${Date.now()}.mp4`;
          const fileUrl = await FileManager.saveFileToFirebaseStorage(
            `${videoPath}/${fileName}`,
            file.mimetype,
            file.buffer
          );
          if (!fileUrl) {
            res.status(500).json({ error: 'internal server error' });
            return;
          }
          content.videoUrl.push(fileUrl);
        } else {
          const fileName = `${userId}-${Date.now()}.txt`;
          const fileUrl = await FileManager.saveFileToFirebaseStorage(
            `${articlePath}/${fileName}`,
            file.mimetype,
            file.buffer
          );
          if (!fileUrl) {
            res.status(500).json({ error: 'internal server error' });
            return;
          }
          content.articleUrl = fileUrl;
        }
      }

      // Save the content to the database
      await content.save();

      res.status(201).json(content);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server Error' });
    }
  }
}