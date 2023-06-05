import express from 'express';
import Auth from './../middlewares/Authcls.js';

const authRoutes = express.Router();
const objAuthMiddleware = new Auth;

authRoutes.post('/logIn', (req, res, next) => {
    objAuthMiddleware.logIn(req, res, next)
});

authRoutes.post('/signUp', [objAuthMiddleware.verifyToken, objAuthMiddleware.verifySuperUser] ,(req, res) => {
    objAuthMiddleware.signUp(req, res);
});

export default authRoutes;