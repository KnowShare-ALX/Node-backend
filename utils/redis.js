import { createClient } from 'redis';
export class RedisClient {
    constructor() {
        this.client = createClient({
            password: 'W4qWIR45oC8lYsD4kUiMqSu0mpwapBNx',
            socket: {
                host: 'redis-14915.c267.us-east-1-4.ec2.cloud.redislabs.com',
                port: 14915
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