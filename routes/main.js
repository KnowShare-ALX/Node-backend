import express, { application } from 'express'
import AuthController from '../controllers/AuthController';
import authenticateJWT from '../middlewares/AuthMiddleware';

const router = express.Router();

router.post('/login', AuthController.login)
router.post('/signup', AuthController.signup)
router.post('/logout', authenticateJWT, AuthController.logout)

// This route is for testing the authentication middleware
// it will be removed
router.get('/', authenticateJWT, (req, res) => {
    res.send(`home page accessed`)
})

export default router;
