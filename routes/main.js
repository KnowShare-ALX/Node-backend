import express from 'express'
import AuthController from '../controllers/AuthController';
import authenticateJWT from '../middlewares/AuthMiddleware';

const router = express.Router();

/**
 * @swagger
 * /login:
 *   post:
 *     description: "
 *          When a user has been succesfully logged in a token is returned
 *          which shiuld be added to the Authorization Header as Bearer token to authenticate subsequent requests
 *          "
 *     parameters:
 *      - name: Email
 *        description: User's Email
 *        in: formData
 *        required: true
 *        type: string
 *      - name: Password
 *        description: User's Password
 *        in: formData
 *        required: true
 *        type: string
 *     responses:
 *       200:
 *         description: Logged In successfully
 *       404:
 *         description: User does not exist
 */
router.post('/login', AuthController.login)
/**
 * @swagger
 * /signup:
 *   post:
 *     description: Sign up new Users
 *     parameters:
 *      - name: Email
 *        description: User's Email
 *        in: formData
 *        required: true
 *        type: string
 *      - name: Password
 *        description: User's Password
 *        in: formData
 *        required: true
 *        type: string
 *      - name: First Name
 *        description: User's firstname
 *        in: formData
 *        required: true
 *        type: string
 *      - name: Last Name
 *        description: User's Lastname
 *        in: formData
 *        required: true
 *        type: string
 *      - name: state
 *        description: User's state
 *        in: formData
 *        required: true
 *        type: string
 *      - name: Country
 *        description: User's country
 *        in: formData
 *        required: true
 *        type: string
 *      - name: City
 *        description: User's City
 *        in: formData
 *        required: true
 *        type: string
 *      - name: Gender
 *        description: User's Gender
 *        in: formData
 *        required: true
 *        type: string
 *      - name: Date Of Birth
 *        description: User's DOB
 *        in: formData
 *        required: true
 *        type: string
 *     responses:
 *       200:
 *         description: Logged In successfully
 *       409:
 *         description: User already exists
 */
router.post('/signup', AuthController.signup)

/**
 * @swagger
 * /logout:
 *   post:
 *     description: Ends a user's session and logs them out
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       404:
 *         description: Token not found in Redis
 * 
 */
router.post('/logout', authenticateJWT, AuthController.logout)

export default router;
