require('dotenv').config();
import express from 'express';
import router from './routes/main';
import dbClient from './utils/db';
import passport from 'passport';
import { serve, setup } from 'swagger-ui-express';
import corsMiddleware from './middlewares/CorsMiddleware';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import path from 'path';

const app = express();
const file = path.join(process.cwd(), 'docs', 'api.yaml');
const swaggerYaml = readFileSync(file, 'utf8');
const swaggerJsDocs = load(swaggerYaml);
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";
  

const PORT = process.env.PORT || 3000; // port 3000 for dev purposes


dbClient.client.on('connected', () => {
  app.use(express.json());
  app.use(passport.initialize());
  app.use(corsMiddleware);
  app.use('/', router);
  app.use('/api-docs', serve, setup(swaggerJsDocs, { customCssUrl: CSS_URL }));
  app.listen(PORT, () => {
      console.log(`Server is running on Port ${PORT}`);
  })
})
