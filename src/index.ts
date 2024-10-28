// index.ts
import fastify from 'fastify';
import { registerRoutes } from './routes'; // Import routes
import './smtp'; // Import the SMTP server for sending emails

const server = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    },
  },
});

// Register routes
registerRoutes(server);

// Start the server
const start = async () => {
  try {
    const address = await server.listen({ port: 3000 });
    server.log.info(`Server listening on ${address}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
