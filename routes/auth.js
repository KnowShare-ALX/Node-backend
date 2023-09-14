import express from 'express'
import AuthController from '../controllers/AuthController';

const authroute = express.Router();

authroute.post('/login', AuthController.login)

export default authroute;
