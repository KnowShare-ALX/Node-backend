import express from 'express'
import AuthController from '../controllers/AuthController';

const router = express.Router();

router.post('/login', AuthController.login)
router.post('/signup', AuthController.signup)

export default router;
