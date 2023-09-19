import { validationResult } from 'express-validator';
require('dotenv').configure
import User from '../models/user';
import FileManager from '../utils/files';
import { BaseController } from './BaseController';
const path = require('path');
const fs = require('fs');
const rootDir = process.env.FOLDER_PATH || '/tmp/know-share';

export default class FilesController {
  static async updateProfilePicture(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.user.id;
      const formerPicture = req.user.profilePicture;
      console.log('former picture = '+ formerPicture);
      if (!req.file) {
        return res.status(400).json({ msg: 'No file uploaded' });
      }

      const baseDirectory = rootDir;
      const dirPath = 'profilePictures';
      const fileName = `${userId}-${Date.now()}.jpg`;
      const filePath = FileManager.saveFile(baseDirectory, dirPath, fileName, req.file.buffer);

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            profilePicture: filePath,
          },
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ msg: 'User not found' });
      }
      const sensitizedResult = BaseController.removeSensitiveInfo(updatedUser);
      console.log(`user: ${userId} updated profile picture successfully`);

      fs.unlink(baseDirectory + '/' + formerPicture, (err) => { //delete the old profile photo
        if (err) {
            throw err;
        }
    
        console.log(`File ${formerPicture} deleted successfully.`);
    });
      res.status(200).json(sensitizedResult);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server Error' });
    }
  }
  static profilePicture(req, res) {
    try {
        const { filename } = req.params;
        const profilePicturePath = path.join(rootDir, 'profilePictures', filename);
        if (fs.existsSync(profilePicturePath)) {
          res.sendFile(profilePicturePath);
        } else {
          res.status(404).json({error: 'File not found'});
        }
    } catch(error) {
        console.error(error);
        res.status(500).json({error: 'Error occured!'});
    }

  }
}
