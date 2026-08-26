import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { graphql } from 'graphql';
import { schema } from './graphql/schema.ts';
import { rootResolvers } from './graphql/resolvers.ts';
import { initMongo, getMongoStatus } from './db/mongo.ts';

const PORT = Number(process.env.PORT) || 3001;

// Comma-separated list of allowed frontend origins, e.g. "http://localhost:5173,https://myapp.com"
// Trailing slashes are stripped since browsers never send them in the Origin header,
// so a copy-pasted "https://myapp.vercel.app/" in the env var won't silently break CORS.
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim().replace(/\/+$/, ''))
  .filter(Boolean);

async function startServer() {
  const app = express();

  // Render (and most PaaS providers) sit behind a reverse proxy. This makes
  // Express trust the X-Forwarded-* headers so req.ip / req.protocol are correct.
  app.set('trust proxy', 1);

  // Initialize MongoDB Atlas connection asynchronously
  initMongo().catch((err) => {
    console.warn('[MongoDB Atlas] Initialization notice:', err?.message || err);
  });

  // Middleware
  app.use(
    cors({
      origin(origin, callback) {
        // Allow server-to-server / health-check requests with no Origin header,
        // and any origin present in the allow-list.
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        console.warn(`[CORS] Blocked request from disallowed origin: ${origin}`);
        return callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
    })
  );
  app.use(express.json());

  // Root route — friendly response instead of "Cannot GET /", useful for
  // Render's default health check and for anyone opening the API URL directly.
  app.get('/', (_req: Request, res: Response) => {
    res.json({
      service: 'foodtuck-express-graphql',
      status: 'online',
      endpoints: ['/api/health', '/api/db-status', '/graphql'],
    });
  });

  // Database status endpoint
  app.get('/api/db-status', (_req: Request, res: Response) => {
    res.json({
      service: 'MongoDB Atlas',
      ...getMongoStatus(),
      timestamp: new Date().toISOString(),
    });
  });

  // GraphQL Endpoint
  app.post('/graphql', async (req: Request, res: Response) => {
    try {
      const { query, variables, operationName } = req.body;

      if (!query) {
        return res.status(400).json({
          errors: [{ message: 'GraphQL query or mutation is required in request body.' }],
        });
      }

      const result = await graphql({
        schema,
        source: query,
        rootValue: rootResolvers,
        variableValues: variables,
        operationName,
      });

      return res.json(result);
    } catch (error: any) {
      console.error('GraphQL Execution Error:', error);
      return res.status(500).json({
        errors: [{ message: error?.message || 'Internal GraphQL server error' }],
      });
    }
  });

  // GET /graphql helper for testing/debugging
  app.get('/graphql', async (req: Request, res: Response) => {
    const query = req.query.query as string;
    if (!query) {
      return res.json({
        message: 'Foodtuck GraphQL API Endpoint is active. Send POST requests with { query, variables }.',
        status: 'online',
        supportedQueries: [
          'restaurantInfo',
          'categories',
          'menuItems',
          'menuItem(id)',
          'chefs',
          'whyChooseUs',
          'testimonials',
          'sauceOptions',
          'stats',
          'orders',
          'tableBookings',
        ],
        supportedMutations: [
          'createOrder(input)',
          'bookTable(input)',
          'subscribeNewsletter(email)',
          'addReview(input)',
          'sendSupportMessage(name, email, message, topic)',
        ],
      });
    }

    try {
      const result = await graphql({
        schema,
        source: query,
        rootValue: rootResolvers,
      });
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ errors: [{ message: error?.message }] });
    }
  });

  // REST health endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'foodtuck-express-graphql',
      time: new Date().toISOString(),
    });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Foodtuck Express + GraphQL Server running on http://0.0.0.0:${PORT}`);
    console.log(`GraphQL endpoint available at http://0.0.0.0:${PORT}/graphql`);
    console.log(`Allowed CORS origins: ${allowedOrigins.join(', ')}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

// Prevent unhandled promise rejections / exceptions from silently killing
// or hanging the process on a long-running host like Render.
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Promise Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
