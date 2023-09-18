import AuthController from '../controllers/AuthController';
import authenticateJWT from '../middlewares/AuthMiddleware';
const express = require('express');

const router = express.Router();

router.post('/login', AuthController.login)
router.post('/signup', AuthController.signup)
router.get('/logout', authenticateJWT, AuthController.logout)

// This route is for testing the authentication middleware
// it will be removed
router.get('/', authenticateJWT, (req, res) => {
    res.status(200).json({
        message: 'Home page accessed successfully!',
        user: req.user
    });
})

export default router;
