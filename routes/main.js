import express from 'express'
import AuthController from '../controllers/AuthController';
import isAuthenticated from '../middlewares/AuthMiddleware';

const router = express.Router();

router.post('/login', AuthController.login)
router.post('/signup', AuthController.signup)

// This route is for testing the authentication middleware
// it will be removed
router.get('/', isAuthenticated, (req, res) => {
    const user = req.user
    res.send(`home page accessed as ${user.email}`)
})

export default router;
