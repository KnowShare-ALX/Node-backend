require('dotenv').config();
import express from 'express';
import router from './routes/main';
import dbClient from './utils/db';
import passport from 'passport';
import swaggerJSDoc from 'swagger-jsdoc';
import { serve, setup } from 'swagger-ui-express';
import corsMiddleware from './middlewares/CorsMiddleware';

const app = express();

const swaggerOptions = {
    definition: {
      info: {
        title: "Knowshare Backend API",
        version: '1.0.0',
      },
      servers: [
        {
          url: "https://knowshare-backend-alx.vercel.app/",
          description: "My API Documentation",
        },
      ],
    },
    apis: ["./docs/**/*.yaml"],
};
  
const swaggerDocs = swaggerJSDoc(swaggerOptions);
  

const PORT = process.env.PORT || 3000; // port 3000 for dev purposes


dbClient.client.on('connected', () => {
  app.use(express.json());
  app.use(passport.initialize())
  app.use(corsMiddleware)
  app.use('/api-docs', serve, setup(swaggerDocs));
  app.use('/', router);
  app.listen(PORT, () => {
      console.log(`Server is running on Port ${PORT}`);
  })
})
