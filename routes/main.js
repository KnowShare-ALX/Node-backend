import AuthController from '../controllers/AuthController';
import authenticateJWT from '../middlewares/AuthMiddleware';
import UserController from '../controllers/UserController';
import FilesController from '../controllers/FilesController';
import ContentController from '../controllers/ContentController';
import CourseController from '../controllers/CourseController';
const express = require('express');
import multer from 'multer';
import { body } from 'express-validator';
import ForumController from '../controllers/ForumController';


const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage })
const router = express.Router();

router.post('/login', AuthController.login);
router.post('/signup', AuthController.signup);
router.post('/logout', authenticateJWT, AuthController.logout);


router.put('/settings/profile', authenticateJWT, UserController.updateProfile);

router.post(
    '/settings/profilePicture', 
    authenticateJWT,
    upload.single('profilePicture'),
    FilesController.updateProfilePicture
);
router.get('/user/profilePicture/:id', FilesController.profilePicture);

router.post(
    '/contents/upload/',
    authenticateJWT,
    upload.array('files'),
    ContentController.createContent
);
router.post(
    '/courses/create',
    authenticateJWT,
    CourseController.createCourse
);
/**
 * POST /courses/addContent
 *
 * Endpoint to add content to a course. This endpoint allows users to associate content with a specific course section.
 * The request should include the following query parameters:
 * - contentId: The unique identifier of the content to be added.
 * - parentId: The unique identifier of the parent course to which the content will be added.
 * - sectionTitle: The title of the section within the course where the content will be added.
 *
 * Authentication is required to access this endpoint, and files can be uploaded as part of the request.
 *
 * Example request:
 * POST /courses/addContent?contentId=123&parentId=456&sectionTitle=Introduction
 *
 * @function addContentToCourse
 * @memberof CourseController
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 */

router.post(
    '/courses/addContent/',
    authenticateJWT,
    upload.array('files'),
    CourseController.addContentToCourse
);

/**
 * GET /contents/get
 *
 * Endpoint to fetch a content.
 * The request should include the following query parameters:
 * - contentId: The unique identifier of the content to be added.
 *
 * Authentication is required to access this endpoint
 * Example request:
 * GET /contents/get?contentId=123
 *
 * @function getContentById
 * @memberof ContentController
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 */
router.get(
    '/contents/get',
    authenticateJWT,
    ContentController.getContentById
);

/**
 * GET /user/:userId/profile
 *
 * Endpoint to fetch user info.
 * The request should include the following query parameters:
 * - userId: The unique identifier of the user.
 * Authentication is required to access this endpoint
 * Example request:
 * GET /user/123/profile
 *
 * @function getUserInfo
 * @memberof UserController
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 */
router.get(
    '/user/:userEmail/profile/',
    authenticateJWT,
    UserController.getUserInfo
);

/**
 * GET /user/feeds
 *
 * Endpoint to fetch user feeds.
 * The request should include the following query parameters:
 * - page: The page to fetch.
 * - pageSize: The number of items per page
 *
 * Authentication is required to access this endpoint
 * Example request:
 * GET /user/feeds?page=1&pageSize=20  pagesize is optional
 *
 * @function feeds
 * @memberof ContentController
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 */
router.get(
    '/user/feeds',
    authenticateJWT,
    ContentController.feeds
)


/**
 * POST /forum/create
 *
 * Endpoint for creating forum.
 * The request includes:
 * - title: The name of the forum - must be unique (required)
 * - description: About the forum - what it is about. (optional) 
 *
 * Authentication is required to access this endpoint
 * Example request:
 * POST /forum/create
 *
 * @function feeds
 * @memberof ContentController
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 */
router.post(
    '/forums/create',
    authenticateJWT,
    [
        body('title').exists()
    ],
    ForumController.createForum
)

export default router;
