import AuthController from '../controllers/AuthController';
import passport from '../middlewares/AuthMiddleware';
const express = require('express');

const router = express.Router();
const requireAuth = passport.authenticate('jwt', {session: false});

router.post('/login', AuthController.login)
router.post('/signup', AuthController.signup)
router.post('/logout', requireAuth, AuthController.logout)

// This route is for testing the authentication middleware
// it will be removed
router.get('/', requireAuth, (req, res) => {
    res.status(200).json({
        message: 'Home page accessed successfully!',
        user: req.user
    });
})

export default router;
