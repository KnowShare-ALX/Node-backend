require('dotenv').config();  // To access .env file contents
// const multer = require('multer')
import express from 'express';
import router from './routes/main';
import dbClient from './utils/db';
import passport from 'passport';

 const app = express();

const PORT = process.env.PORT || 3000; // port 3000 for dev purposes

dbClient.client.on('connected', () => {
    app.use(express.json());
    app.use(passport.initialize())
    app.use('/', router);
    app.listen(PORT, () => {
        console.log(`Server is running on Port ${PORT}`);
    })
})

