import Redis from "ioredis";

const { REDIS_PORT, REDIS_HOST } = process.env;

const createClient = () => {
  // @ts-ignore
  return new Redis(REDIS_PORT, REDIS_HOST, {});
};

const clients: { [key: string]: Redis.Redis | undefined } = {};

export const getRedisClient = (key = "default") => {
  let client = clients[key];
  if (!client) {
    client = clients[key] = createClient();
  }
  // @ts-ignore
  client.setMaxListeners(100);

  return client;
};
