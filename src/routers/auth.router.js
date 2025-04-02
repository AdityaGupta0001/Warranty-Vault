import express from 'express';
const authRouter = express.Router();
import { verifyToken } from '../middleware/verify.jwt.js';
import firebaseAuthController from '../controllers/auth.controller.js';

authRouter.post('/api/auth/register', firebaseAuthController.registerUser);
authRouter.post('/api/auth/login', firebaseAuthController.loginUser);    
authRouter.post('/api/authlogout', firebaseAuthController.logoutUser);
authRouter.post('/api/auth/reset-password', verifyToken, firebaseAuthController.resetPassword);

authRouter.get('/api/protected', verifyToken, (req,res) => {
    res.json({message: "You have accessed a protected route!", user: req.user});
});

export {authRouter};