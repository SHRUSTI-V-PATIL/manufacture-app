const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Store connected users
const connectedUsers = new Map();
const activeWorkOrders = new Map();

// Socket connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user authentication and room joining
  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
    connectedUsers.set(socket.id, { userId, socketId: socket.id, connectedAt: new Date() });
    console.log(`User ${userId} joined their room`);
    
    // Send welcome notification
    socket.emit('notification', {
      id: `welcome-${Date.now()}`,
      type: 'info',
      title: 'Connected',
      message: 'Real-time updates are now active',
      module: 'System',
      timestamp: new Date().toISOString()
    });
  });

  // Work Order events
  socket.on('join-work-order-room', (workOrderId) => {
    socket.join(`work-order-${workOrderId}`);
    console.log(`User joined work order room: ${workOrderId}`);
  });

  socket.on('leave-work-order-room', (workOrderId) => {
    socket.leave(`work-order-${workOrderId}`);
    console.log(`User left work order room: ${workOrderId}`);
  });

  socket.on('start-work-order', (data) => {
    const { workOrderId, operatorId } = data;
    activeWorkOrders.set(workOrderId, { 
      ...data, 
      startTime: new Date().toISOString(),
      status: 'In Progress'
    });

    // Broadcast to all users
    io.emit('work-order-started', {
      workOrderId,
      status: 'In Progress',
      progress: 0,
      operator: operatorId,
      timestamp: new Date().toISOString()
    });

    // Send notification to supervisors
    io.emit('notification', {
      id: `work-order-start-${workOrderId}-${Date.now()}`,
      type: 'info',
      title: 'Work Order Started',
      message: `Work Order ${workOrderId} has been started by operator ${operatorId}`,
      module: 'Work Orders',
      timestamp: new Date().toISOString(),
      workOrderId
    });
  });

  socket.on('update-work-order-progress', (data) => {
    const { workOrderId, progress, status } = data;
    
    // Update stored data
    if (activeWorkOrders.has(workOrderId)) {
      const workOrder = activeWorkOrders.get(workOrderId);
      activeWorkOrders.set(workOrderId, { ...workOrder, progress, status });
    }

    // Broadcast update
    io.to(`work-order-${workOrderId}`).emit('work-order-updated', {
      workOrderId,
      progress,
      status: status || 'In Progress',
      timestamp: new Date().toISOString()
    });

    // Send milestone notifications
    if (progress === 25 || progress === 50 || progress === 75) {
      io.emit('notification', {
        id: `progress-${workOrderId}-${progress}-${Date.now()}`,
        type: 'info',
        title: 'Progress Update',
        message: `Work Order ${workOrderId} is ${progress}% complete`,
        module: 'Work Orders',
        timestamp: new Date().toISOString(),
        workOrderId
      });
    }
  });

  socket.on('complete-work-order', (data) => {
    const { workOrderId, operatorId, timeSpent } = data;
    
    // Remove from active work orders
    activeWorkOrders.delete(workOrderId);

    // Broadcast completion
    io.emit('work-order-completed', {
      workOrderId,
      status: 'Completed',
      progress: 100,
      operator: operatorId,
      timestamp: new Date().toISOString(),
      timeSpent
    });

    // Send completion notification
    io.emit('notification', {
      id: `work-order-complete-${workOrderId}-${Date.now()}`,
      type: 'success',
      title: 'Work Order Completed',
      message: `Work Order ${workOrderId} has been completed by ${operatorId}`,
      module: 'Work Orders',
      timestamp: new Date().toISOString(),
      workOrderId
    });
  });

  // Quality events
  socket.on('quality-issue', (data) => {
    const { workOrderId, type, severity, description, inspector } = data;
    const alertId = `quality-${workOrderId}-${Date.now()}`;

    // Broadcast quality alert
    io.emit('quality-alert', {
      id: alertId,
      workOrderId,
      type,
      severity,
      description,
      inspector,
      timestamp: new Date().toISOString()
    });

    console.log(`Quality issue reported for work order ${workOrderId}:`, description);
  });

  // Stock events
  socket.on('update-stock', (data) => {
    const { materialId, quantity, operation, reason } = data;

    // Broadcast stock update
    io.emit('stock-updated', {
      materialId,
      materialName: `Material ${materialId}`, // In a real app, this would be fetched from database
      quantity,
      operation,
      reason,
      timestamp: new Date().toISOString()
    });

    // Send low stock alert if quantity is low
    if (operation === 'subtract' && quantity < 20) {
      io.emit('stock-low', {
        materialId,
        materialName: `Material ${materialId}`,
        quantity,
        operation,
        reason: 'Low stock detected',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Manufacturing Order events
  socket.on('update-manufacturing-order', (data) => {
    const { manufacturingOrderId, status, completedQuantity } = data;

    io.emit('manufacturing-order-updated', {
      manufacturingOrderId,
      status,
      completedQuantity,
      timestamp: new Date().toISOString()
    });
  });

  // Disconnect handling
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    connectedUsers.delete(socket.id);
  });
});

// Simulate some real-time events for demo
setInterval(() => {
  // Simulate random stock updates
  if (Math.random() > 0.7) {
    const materials = ['MAT-001', 'MAT-002', 'MAT-003', 'MAT-004'];
    const randomMaterial = materials[Math.floor(Math.random() * materials.length)];
    const randomQuantity = Math.floor(Math.random() * 100) + 1;

    io.emit('stock-updated', {
      materialId: randomMaterial,
      materialName: `Steel Pipe ${randomMaterial}`,
      quantity: randomQuantity,
      operation: 'adjust',
      reason: 'Automatic inventory adjustment',
      timestamp: new Date().toISOString()
    });
  }

  // Simulate work order progress updates
  activeWorkOrders.forEach((workOrder, workOrderId) => {
    if (Math.random() > 0.8) {
      const newProgress = Math.min(workOrder.progress + Math.floor(Math.random() * 10), 100);
      activeWorkOrders.set(workOrderId, { ...workOrder, progress: newProgress });

      io.to(`work-order-${workOrderId}`).emit('work-order-updated', {
        workOrderId,
        progress: newProgress,
        status: newProgress === 100 ? 'Completed' : 'In Progress',
        timestamp: new Date().toISOString()
      });

      if (newProgress === 100) {
        activeWorkOrders.delete(workOrderId);
      }
    }
  });
}, 10000); // Every 10 seconds

// API endpoints for testing
app.get('/api/status', (req, res) => {
  res.json({
    connectedUsers: connectedUsers.size,
    activeWorkOrders: activeWorkOrders.size,
    serverHealth: 'good'
  });
});

app.post('/api/trigger-notification', (req, res) => {
  const notification = {
    id: `manual-${Date.now()}`,
    type: req.body.type || 'info',
    title: req.body.title || 'Manual Notification',
    message: req.body.message || 'This is a test notification',
    module: req.body.module || 'System',
    timestamp: new Date().toISOString()
  };

  io.emit('notification', notification);
  res.json({ success: true, notification });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
  console.log(`Frontend should connect to: ws://localhost:${PORT}`);
});

module.exports = { app, server, io };
