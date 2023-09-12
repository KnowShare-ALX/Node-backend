require('dotenv').config()
const mongoose = require('mongoose');

export class DBClient {
    constructor() {
        const host = process.env.Host || 'localhost';
        const port = process.env.PORT || 27017;
        const dataBase = process.env.DATA_BASE || 'know_share';
        mongoose.connect(`mongodb://${host}:${port}/${dataBase}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            family: 4
        });
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'MongoDB connection error:'));
        db.once('open', () => {
            console.log('Connected to MongoDB');
        });
    }
    isAlive() {
        return mongoose.connection.readyState;
    }
}

export const dbClient = new DBClient();
export default dbClient;