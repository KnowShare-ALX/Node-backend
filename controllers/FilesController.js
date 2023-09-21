import { validationResult } from 'express-validator';
require('dotenv').configure
import User from '../models/user';
import FileManager from '../utils/files';
import { BaseController } from './BaseController';

export default class FilesController {
  static async updateProfilePicture(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.user.id;
      const formerPictureUrl = req.user.profilePicture;
      if (!req.file) {
        return res.status(400).json({ msg: 'No file uploaded' });
      }

      // const baseDirectory = rootDir;
      const dirPath = 'files/profilePictures';
      const fileName = `${userId}-${Date.now()}.jpg`;

      const downloadURL = await FileManager.saveFileToFirebaseStorage(
        `${dirPath}/${fileName}`,
        req.file.mimetype,
        req.file.buffer
      );
      if (!downloadURL) {
        res.status(500).json({error: 'internal server error'});
        return;
      }
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            profilePicture: downloadURL,
          },
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ msg: 'User not found' });
      }
      const sensitizedResult = BaseController.removeSensitiveInfo(updatedUser);
      console.log(`user: ${userId} updated profile picture successfully`);

      res.status(200).json(sensitizedResult);

    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server Error' });
    }
  }
  static async profilePicture(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const profilePictureUrl = user.profilePicture;
  
      if (profilePictureUrl) {
        return res.redirect(profilePictureUrl);
      } else {
        return res.status(404).json({ error: 'No profile picture available' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
}
