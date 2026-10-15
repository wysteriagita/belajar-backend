import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swagger.js';
import errorHandler from './middlewares/errorHandler.middleware.js';
import appError from './utils/appError.utils.js';
import routeApi from './routes/index.js';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));
  app.use(
    '/api-docs',
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
      },
    }),
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, { customSiteTitle: 'Belajar Backend API' })
  );
}

app.use('/api', routeApi);

app.use((req, res, next) => {
  next(new appError(400, `cannot find ${req.originalURL} on this server`));
});

app.use(errorHandler);

export default app;
