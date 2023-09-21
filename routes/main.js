import AuthController from '../controllers/AuthController';
import authenticateJWT from '../middlewares/AuthMiddleware';
import UserController from '../controllers/UserController';
import FilesController from '../controllers/FilesController';
import ContentController from '../controllers/ContentController';
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
router.get('/profile-picture/:id', FilesController.profilePicture);
router.post(
    '/uploadContent/',
    authenticateJWT,
    upload.array('files'),
    ContentController.createContent
    )


export default router;
