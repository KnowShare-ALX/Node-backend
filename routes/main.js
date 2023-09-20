import express from 'express'
import AuthController from '../controllers/AuthController';
import authenticateJWT from '../middlewares/AuthMiddleware';

const router = express.Router();

router.post('/login', AuthController.login)
router.post('/signup', AuthController.signup)
router.post('/logout', authenticateJWT, AuthController.logout)

export default router;
