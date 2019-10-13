/* tslint:disable */
import chalk from "chalk";
import fastify from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import { readFileSync } from "fs";
import { Spinner } from "clui";
import fastifySwagger from "fastify-swagger"; 
import fastifyJwt from "fastify-jwt"; 
import RegisterRoutes from "./routes";
import { config } from "dotenv"
import path from "path";
config();
const server: fastify.FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse
> = fastify({
  logger: {
    prettyPrint: {
      translateTime: 'SYS:hh:MM:ss TT'
    },
  },
});

const status = new Spinner(chalk.greenBright('Initiating Server...  '), ['⣾','⣽','⣻','⢿','⡿','⣟','⣯','⣷']);
status.start();

server.register(fastifyJwt, {
    secret: {
      private: readFileSync(`${path.join(__dirname, "certs")}/private.key`, "utf8"),
      public: readFileSync(`${path.join(__dirname, "certs")}/public.key`, "utf8"),
    },
    sign: { algorithm: "RS256" },
}).after(()=>{
  status.message(chalk.greenBright("JWT Auth initialialization done..."))
});

server.register(RegisterRoutes).after(err => {
  if(err){}
  status.message(chalk.greenBright("Routs initialialization done..."))
});
server.register(fastifySwagger, {
  mode: "static",
  exposeRoute: true,
  routePrefix: "/docs",
  specification: {
    path: "./src/swagger.json",
    postProcessor: function(swaggerObject: any) {
      return swaggerObject
    },
    baseDir: "/"
  },
}).after(err => {
  if(err){}
  status.message(chalk.greenBright("Swagger initialialization done..."))
});

server.ready(err => {
  if(err){}
   status.message(chalk.greenBright("Server initialization done..."))
   status.stop(); 
})


const start = async () => {
  try {
       // @ts-ignore
      const address = await server.listen(process.env.PORT || 3000);
      
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

process.on("uncaughtException", error => {
  server.log.error(error);
});
process.on("unhandledRejection", error => {
  server.log.error(error || {});
});


start();
