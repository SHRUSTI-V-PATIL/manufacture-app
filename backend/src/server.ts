import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

import { connectDatabase } from '@/config/database.js';
import { logger } from '@/utils/logger.js';
import { errorHandler } from '@/middleware/errorHandler.js';

// Route imports
import authRoutes from '@/routes/auth.js';
import userRoutes from '@/routes/users.js';
import manufacturingOrderRoutes from '@/routes/manufacturingOrders.js';
import workOrderRoutes from '@/routes/workOrders.js';
import workCenterRoutes from '@/routes/workCenters.js';
import materialRoutes from '@/routes/materials.js';
import bomRoutes from '@/routes/bom.js';
import stockLedgerRoutes from '@/routes/stockLedger.js';
import dashboardRoutes from '@/routes/dashboard.js';
import reportRoutes from '@/routes/reports.js';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Data sanitization
app.use(mongoSanitize());
app.use(hpp());

// Body parsing middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/manufacturing-orders', manufacturingOrderRoutes);
app.use('/api/work-orders', workOrderRoutes);
app.use('/api/work-centers', workCenterRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/bom', bomRoutes);
app.use('/api/stock-ledger', stockLedgerRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorHandler);

// Socket.IO for real-time updates
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  socket.on('join-dashboard', () => {
    socket.join('dashboard');
  });

  socket.on('join-manufacturing-orders', () => {
    socket.join('manufacturing-orders');
  });

  socket.on('join-work-orders', () => {
    socket.join('work-orders');
  });

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Make io available globally
app.set('io', io);

// Start server
const startServer = async () => {
  try {
    await connectDatabase();
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export { app, io };
