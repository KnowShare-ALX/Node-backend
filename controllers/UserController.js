import User from '../models/user';
import { BaseController } from './BaseController';
const {validationResult} = require('express-validator');


export default class UserController {
  static async updateProfile(req, res) {
    const user = req.user;
    const allowedFields = [
      'bio',
      'lastName',
      'firstName',
      'dateOfBirth',
      'credentials',
      'location',
    ];

    try {
      const updateData = {};

      for (const key in req.body) {
        if (allowedFields.includes(key)) {
          updateData[key] = req.body[key];
        }
      }

      if (Object.keys(updateData).length === 0) {
        console.log('No valid fields to update');
        return res.status(400).json({ error: 'No valid fields to update' });
      }

      const updatedUser = await User.findByIdAndUpdate(
        user.id,
        { $set: updateData },
        { new: true }
      );

      if (!updatedUser) {
        console.error('Error updating user');
        return res.status(500).json({ error: 'Error updating user' });
      }

      console.log('User updated successfully');
      const sanitizedUser = BaseController.removeSensitiveInfo(updatedUser);
      return res.status(200).json({
        message: 'Profile updated successfully',
        user: sanitizedUser,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'An error occurred' });
    }
  }

  static async getUserInfo(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { userEmail } = req.params;
      if (!userEmail) {
        return res.status(400).json({error: 'invalid or missing parameter'});
      }
      const user = await User.findOne({ email: userEmail });
      if (!user) {
        return res.status(404).json({error: 'user not found'});
      }
      const userInfo =  await BaseController.userSerializer(user);
      return res.status(200).json(userInfo);
    } catch(error) {
      console.error(`getUserInfo: ${error}`);
      return res.status(500).json({error: 'internal server error'});
    }
  }
}
