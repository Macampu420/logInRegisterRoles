import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import Auth from './middlewares/Authcls.js';
//route importing
import proccessesRoutes from './routes/Proccesses.js';
import authRoutes from './routes/Auth.js';

const objAuthMiddleware = new Auth();
const port = 3000;
const app = express();

//configurations
app.use(morgan('dev'));
app.use(helmet());
app.use(express.urlencoded({ extended: false }));


//routes setting
app.use('/api/proccesses', [objAuthMiddleware.verifyToken], proccessesRoutes);
app.use('/api/auth', authRoutes);

app.listen(port, () => console.log(`App running on port: ${port}`));