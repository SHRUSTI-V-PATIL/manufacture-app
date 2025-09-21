// Simple API test endpoints
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});

// Mock login endpoint for testing
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'admin@example.com' && password === 'admin123') {
    res.json({
      success: true,
      token: 'mock-jwt-token',
      user: {
        id: '1',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

// Mock dashboard KPIs endpoint
app.get('/api/dashboard/kpis', (req, res) => {
  res.json({
    manufacturingOrders: {
      total: 25,
      planned: 5,
      inProgress: 8,
      completed: 10,
      cancelled: 1,
      onHold: 1,
      delayed: 0
    },
    workOrders: {
      total: 15,
      pending: 3,
      started: 7,
      paused: 1,
      completed: 4,
      issues: 0
    },
    materials: {
      totalMaterials: 156,
      lowStockMaterials: 5,
      totalStockValue: 125000
    },
    workCenters: {
      totalWorkCenters: 8,
      activeWorkCenters: 6,
      averageUtilization: 78.5
    }
  });
});

// Mock recent activities endpoint
app.get('/api/dashboard/recent-activities', (req, res) => {
  res.json({
    recentManufacturingOrders: [
      {
        _id: '1',
        orderNumber: 'MO-2024-001',
        product: { name: 'Steel Frame Assembly' },
        status: 'in-progress',
        priority: 'high'
      },
      {
        _id: '2',
        orderNumber: 'MO-2024-002',
        product: { name: 'Motor Housing' },
        status: 'completed',
        priority: 'medium'
      }
    ],
    recentWorkOrders: [
      {
        _id: '1',
        workOrderNumber: 'WO-2024-001',
        workCenter: { name: 'Assembly Line 1' },
        status: 'started',
        completedQuantity: 5,
        plannedQuantity: 10
      },
      {
        _id: '2',
        workOrderNumber: 'WO-2024-002',
        workCenter: { name: 'Machining Center' },
        status: 'completed',
        completedQuantity: 20,
        plannedQuantity: 20
      }
    ]
  });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
});
