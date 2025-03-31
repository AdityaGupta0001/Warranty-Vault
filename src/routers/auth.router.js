import express from 'express';
const authRouter = express.Router();
import { verifyToken } from '../middleware/auth.middleware.js';
import firebaseAuthController from '../controllers/auth.controller.js';

authRouter.post('/api/register', firebaseAuthController.registerUser);
authRouter.post('/api/login', firebaseAuthController.loginUser);    
authRouter.post('/api/logout', firebaseAuthController.logoutUser);
authRouter.post('/api/reset-password', verifyToken, firebaseAuthController.resetPassword);

authRouter.get('/api/protected', verifyToken, (req,res) => {
    res.json({message: "You have accessed a protected route!", user: req.user});
});

export {authRouter};