require('dotenv').config();  // To access .env file contents
import express from 'express';
import router from './routes/main';
import dbClient from './utils/db';

const app = express();

const PORT = process.env.PORT || 3000; // port 3000 for dev purposes

dbClient.db.on('connected', () => {
    app.use(express.json());
    app.use('/', router);

    app.listen(PORT, () => {
        console.log(`Server is running on Port ${PORT}`);
    })
})

