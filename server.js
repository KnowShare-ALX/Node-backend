require('dotenv').config();  // To access .env file contents
const express = require('express');
const router = require('./routes/main');
import dbClient from './utils/db';
import redisClient from './utils/redis';

const app = express();

const PORT = process.env.PORT || 3000; // port 3000 for dev purposes

dbClient.db.on('connected', () => {
    redisClient.isAlive();
    app.use(express.json());
    app.use('/', router);
    app.listen(PORT, () => {
        console.log(`Server is running on Port ${PORT}`);
    })
})
dbClient.db.on('error', console.error.bind(console, 'MongoDB connection error:'));