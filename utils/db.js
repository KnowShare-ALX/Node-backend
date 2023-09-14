require('dotenv').config()
import mongoose from 'mongoose';

export class DBClient {
    constructor() {
        mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            family: 4
        });
        this.db = mongoose.connection;
        this.db.on('error', console.error.bind(console, 'MongoDB connection error:'));
        this.db.once('open', () => {
            console.log('Connected to MongoDB');
        });
    }
    isAlive() {
        return mongoose.connection.readyState;
    }
}

export const dbClient = new DBClient();
export default dbClient;