require('dotenv').config()
import { createClient } from 'redis';
export class RedisClient {
    constructor() {
        this.client = createClient({
            password: process.env.RD_PASSWORD,
            socket: {
                host: process.env.RD_HOST,
                port: process.env.RD_PORT
            },
        });
        this.client.connect().then(() => {
            console.log('Redis is connected')
        })
        this.client.on('error', (err) => {
            console.error('Redis Error on connection', err);
          });
    };

    isAlive() {
        try {
          this.client.ping();
          return true;
        } catch (err) {
          return false;
        }
      }
    
      async get(key) {
        return await this.client.get(key);
      }
    
      async set(key, value, duration) {
        return await this.client.set(key, value, 'EX', duration);
      }
    
      async del(key) {
        return await this.client.del(key);
      }
}
export const redisClient = new RedisClient();
export default redisClient;