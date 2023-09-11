require('dotenv').config();  // To access .env file contents
const express = require('express');
const router = require('./routes/main');

const app = express();

const PORT = process.env.PORT || 3000; // port 3000 for dev purposes

app.use(express.json());
app.use('/', router);

app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
})
