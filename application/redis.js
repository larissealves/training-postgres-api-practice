import { createClient, RedisClient } from "redis";

const client = createClient({
    url: process.env.REDIS_URL
});

client.on('error', (err) => {
    console.log('Redis error: ', err);
});

client.connect();

export default client;