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
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";
  

const PORT = process.env.PORT || 3000; // port 3000 for dev purposes

dbClient.client.on('connected', () => {
    app.use(express.json());
    app.use(passport.initialize())
    app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      );
      res.header("Access-Control-Expose-Headers", "x-auth-token");
      if (req.method == "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
      }
    
      next();
    });
    app.use('/', router);
    app.use('/api-docs', serve, setup(swaggerDocs, { customCssUrl: CSS_URL }));
    app.listen(PORT, () => {
        console.log(`Server is running on Port ${PORT}`);
    })
})

