const { createClient } = require("redis");

const client = createClient({
    url: process.env.REDIS_URL
});

client.on("connect", () => {
    console.log("Connected to Redis");
});

client.on("error", (error) => {
    console.log("Redis error:", error);
});

const connectRedis = async () => {
    try {
        if (!client.isOpen) {
            await client.connect();
        }
    } catch (error) {
        console.log("Error connecting to Redis:", error);
    }
};

module.exports = {
    client,
    connectRedis
};