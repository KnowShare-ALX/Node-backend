import AuthController from '../controllers/AuthController';
import authenticateJWT from '../middlewares/AuthMiddleware';
import UserController from '../controllers/UserController';
import FilesController from '../controllers/FilesController';
const express = require('express');
import multer from 'multer';


const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage })
const router = express.Router();

router.post('/login', AuthController.login);
router.post('/signup', AuthController.signup);
router.post('/logout', authenticateJWT, AuthController.logout);
router.put('/update-profile', authenticateJWT, UserController.updateProfile);
router.post(
    '/profile-picture', 
    authenticateJWT,
    upload.single('profilePicture'),
    FilesController.updateProfilePicture
    );
router.get('/profile-picture/:filename', authenticateJWT, FilesController.profilePicture);

// This route is for testing the authentication middleware
// it will be removed
router.get('/', authenticateJWT, (req, res) => {
    res.status(200).json({
        message: 'Home page accessed successfully!',
        user: req.user
    });
})

export default router;
