import express from 'express';
import { adminLogin } from '../controllers/adminController.js';
import { body } from 'express-validator';

const router = express.Router();

router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Enter a valid email'),
        body('password').exists().withMessage('Password is required')
    ],
    adminLogin
);

export default router;
