import express  from "express";
import ProccessesRoutes from '../models/Proccesses.js';
import Auth from './../middlewares/Authcls.js';

const proccessesRoutes = express.Router();
const objProccessesRoutes = new ProccessesRoutes();
const objAuthMiddlewares = new Auth();

proccessesRoutes.get('/', async (req, res) => {
    await objProccessesRoutes.listProccesses(req, res);
});

proccessesRoutes.post('/newProccess', [objAuthMiddlewares.verifySuperUser], async (req, res) => {
    await objProccessesRoutes.createProccess(req, res);
});

export default proccessesRoutes;