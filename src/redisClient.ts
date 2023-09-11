import * as redis from 'redis';

const redisClient = redis.createClient({ url: process.env.REDIS_URL!! });

redisClient.on('error', err => console.log("Redis client errro", err));

(async () => {
    await redisClient.connect();

    console.log("Redis connected successfully");
})();

export default redisClient;
