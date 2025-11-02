import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import 'dotenv/config';
import { createServer } from 'node:http';
import { WebSocketServer } from 'ws';
import activityRoutes from './routes/activity';
import attachmentRoutes from './routes/attachments';
import authRoutes from './routes/auth';
import commentRoutes from './routes/comments';
import cycleRoutes from './routes/cycles';
import issueRoutes from './routes/issues';
import labelRoutes from './routes/labels';
import notificationRoutes from './routes/notifications';
import projectRoutes from './routes/projects';
import searchRoutes from './routes/search';
import teamRoutes from './routes/teams';
import workspaceRoutes from './routes/workspaces';
import { getWebSocketStats, handleWebSocketUpgrade, wsManager } from './websocket';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use(
  '*',
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.get('/api/v1', (c) => {
  return c.json({
    message: 'Linear Clone API v1',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      workspaces: '/api/v1/workspaces',
      teams: '/api/v1/teams',
      issues: '/api/v1/issues',
      projects: '/api/v1/projects',
      cycles: '/api/v1/cycles',
      labels: '/api/v1/labels',
      comments: '/api/v1/comments',
      attachments: '/api/v1/attachments',
      notifications: '/api/v1/notifications',
      search: '/api/v1/search',
      activity: '/api/v1/activity',
    },
  });
});

// Auth routes
app.route('/api/v1/auth', authRoutes);

// Workspace routes
app.route('/api/v1/workspaces', workspaceRoutes);

// Team routes
app.route('/api/v1', teamRoutes);

// Issue routes
app.route('/api/v1', issueRoutes);

// Project routes
app.route('/api/v1', projectRoutes);

// Cycle routes
app.route('/api/v1', cycleRoutes);

// Label routes
app.route('/api/v1', labelRoutes);

// Comment routes
app.route('/api/v1/comments', commentRoutes);

// Attachment routes
app.route('/api/v1/attachments', attachmentRoutes);

// Notification routes
app.route('/api/v1/notifications', notificationRoutes);

// Search routes
app.route('/api/v1/search', searchRoutes);

// Activity routes
app.route('/api/v1/activity', activityRoutes);

// WebSocket stats endpoint
app.get('/api/v1/ws/stats', getWebSocketStats);

const port = Number(process.env.PORT) || 3001;

// Create HTTP server for WebSocket support
const httpServer = createServer(async (req, res) => {
  try {
    // Build URL
    const url = `http://${req.headers.host || 'localhost'}${req.url || '/'}`;

    // Build headers
    const headers: Record<string, string> = {};
    for (const [key, value] of Object.entries(req.headers)) {
      if (typeof value === 'string') {
        headers[key] = value;
      }
    }

    // Read request body for POST/PUT/PATCH requests
    let body: string | undefined;
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      body = Buffer.concat(chunks).toString();
    }

    // Forward request to Hono
    const request = new Request(url, {
      method: req.method || 'GET',
      headers,
      body: body,
    });

    const response = await app.fetch(request);

    // Copy response status and headers
    res.statusCode = response.status;
    response.headers.forEach((value: string, key: string) => {
      res.setHeader(key, value);
    });

    // Stream response body
    if (response.body) {
      const reader = response.body.getReader();
      const pump = async (): Promise<void> => {
        const { done, value } = await reader.read();
        if (done) {
          res.end();
          return;
        }
        res.write(value);
        return pump();
      };
      await pump();
    } else {
      res.end();
    }
  } catch (error) {
    console.error('[HTTP] Error handling request:', error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
});

// Create WebSocket server
const wss = new WebSocketServer({
  server: httpServer,
  path: '/ws',
});

// Handle WebSocket connections
wss.on('connection', (ws, req) => {
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  const clientId = `client_${Date.now()}_${Math.random().toString(36).substring(7)}`;

  // Create a minimal Hono context for auth
  const mockContext = {
    req: {
      query: (key: string): string | null => url.searchParams.get(key),
      header: (key: string): string | undefined =>
        req.headers[key.toLowerCase()] as string | undefined,
    },
  } as unknown as Parameters<typeof handleWebSocketUpgrade>[0];

  handleWebSocketUpgrade(mockContext, ws, clientId);
});

// Start heartbeat for connection health checks
wsManager.startHeartbeat();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down gracefully...');
  wsManager.shutdown();
  wss.close(() => {
    httpServer.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  });
});

process.on('SIGTERM', () => {
  console.log('\n👋 Shutting down gracefully...');
  wsManager.shutdown();
  wss.close(() => {
    httpServer.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  });
});

console.log(`🚀 Server starting on http://localhost:${port}`);
console.log(`🔌 WebSocket server available at ws://localhost:${port}/ws`);

httpServer.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
  console.log(`✅ WebSocket server running on ws://localhost:${port}/ws`);
});

export default app;
