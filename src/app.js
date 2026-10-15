import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import errorHandler from './middlewares/errorHandler.middleware.js';
import appError from './utils/appError.utils.js';
import routeApi from './routes/index.js';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api', routeApi);

app.use((req, res, next) => {
  next(new appError(400, `cannot find ${req.originalURL} on this server`));
});

app.use(errorHandler);

export default app;
