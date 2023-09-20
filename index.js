require('dotenv').config();  // To access .env file contents
// const multer = require('multer')
import express from 'express';
import router from './routes/main';
import dbClient from './utils/db';
import passport from 'passport';
import swaggerJSDoc from 'swagger-jsdoc';
import { serve, setup } from 'swagger-ui-express';

const app = express();

const swaggerOptions = {
    swaggerDefinition: {
      info: {
        title: "Knowshare Backend API",
        version: '1.0.0',
      },
    },
    apis: ["./docs/**/*.yaml"],
};
  
const swaggerDocs = swaggerJSDoc(swaggerOptions);
  

const PORT = process.env.PORT || 3000; // port 3000 for dev purposes

dbClient.client.on('connected', () => {
    app.use(express.json());
    app.use(passport.initialize())
    app.use('/', router);
    app.use('/api-docs', serve, setup(swaggerDocs));
    app.listen(PORT, () => {
        console.log(`Server is running on Port ${PORT}`);
    })
})

