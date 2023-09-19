import User from '../models/user';
import { BaseController } from './BaseController';

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
}
