import { io, Socket } from 'socket.io-client';

interface NotificationData {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  module: string;
  timestamp: string;
  userId?: string;
  workOrderId?: string;
  manufacturingOrderId?: string;
  actionRequired?: boolean;
}

interface WorkOrderUpdate {
  workOrderId: string;
  status: string;
  progress: number;
  operator?: string;
  timestamp: string;
  timeSpent?: number;
}

interface ManufacturingOrderUpdate {
  manufacturingOrderId: string;
  status: string;
  completedQuantity: number;
  timestamp: string;
  workOrders?: string[];
}

interface StockUpdate {
  materialId: string;
  materialName: string;
  quantity: number;
  operation: 'add' | 'subtract' | 'adjust';
  reason: string;
  timestamp: string;
}

interface QualityAlert {
  id: string;
  workOrderId: string;
  type: 'defect' | 'measurement' | 'compliance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  inspector: string;
  timestamp: string;
}

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private notificationCallbacks: ((notification: NotificationData) => void)[] = [];
  private workOrderCallbacks: ((update: WorkOrderUpdate) => void)[] = [];
  private manufacturingOrderCallbacks: ((update: ManufacturingOrderUpdate) => void)[] = [];
  private stockCallbacks: ((update: StockUpdate) => void)[] = [];
  private qualityCallbacks: ((alert: QualityAlert) => void)[] = [];

  connect(userId: string) {
    if (this.socket?.connected) {
      return;
    }

    // In a real app, this would be the backend server URL
    const serverUrl = process.env.NODE_ENV === 'production' 
      ? 'wss://your-backend-url.com' 
      : 'ws://localhost:5000';

    this.socket = io(serverUrl, {
      auth: {
        userId,
        token: localStorage.getItem('token')
      },
      transports: ['websocket'],
      timeout: 20000,
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      // Join user-specific room
      const userId = localStorage.getItem('userId');
      if (userId) {
        this.socket?.emit('join-user-room', userId);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.handleReconnect();
    });

    // Notification events
    this.socket.on('notification', (data: NotificationData) => {
      this.notificationCallbacks.forEach(callback => callback(data));
    });

    // Work Order events
    this.socket.on('work-order-updated', (data: WorkOrderUpdate) => {
      this.workOrderCallbacks.forEach(callback => callback(data));
    });

    this.socket.on('work-order-started', (data: WorkOrderUpdate) => {
      this.workOrderCallbacks.forEach(callback => callback(data));
    });

    this.socket.on('work-order-completed', (data: WorkOrderUpdate) => {
      this.workOrderCallbacks.forEach(callback => callback(data));
    });

    // Manufacturing Order events
    this.socket.on('manufacturing-order-updated', (data: ManufacturingOrderUpdate) => {
      this.manufacturingOrderCallbacks.forEach(callback => callback(data));
    });

    // Stock events
    this.socket.on('stock-updated', (data: StockUpdate) => {
      this.stockCallbacks.forEach(callback => callback(data));
    });

    this.socket.on('stock-low', (data: StockUpdate) => {
      // Convert to notification
      const notification: NotificationData = {
        id: `stock-${data.materialId}-${Date.now()}`,
        type: 'warning',
        title: 'Low Stock Alert',
        message: `${data.materialName} is running low (${data.quantity} remaining)`,
        module: 'Stock Ledger',
        timestamp: data.timestamp
      };
      this.notificationCallbacks.forEach(callback => callback(notification));
    });

    // Quality events
    this.socket.on('quality-alert', (data: QualityAlert) => {
      this.qualityCallbacks.forEach(callback => callback(data));
      
      // Convert to notification
      const notification: NotificationData = {
        id: data.id,
        type: data.severity === 'critical' ? 'error' : 'warning',
        title: 'Quality Alert',
        message: data.description,
        module: 'Quality Control',
        timestamp: data.timestamp,
        workOrderId: data.workOrderId,
        actionRequired: data.severity === 'critical'
      };
      this.notificationCallbacks.forEach(callback => callback(notification));
    });

    // Dashboard updates
    this.socket.on('dashboard-refresh', () => {
      // Trigger dashboard refresh
      window.dispatchEvent(new CustomEvent('dashboard-refresh'));
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Reconnection attempt ${this.reconnectAttempts}`);
        this.socket?.connect();
      }, Math.pow(2, this.reconnectAttempts) * 1000); // Exponential backoff
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Subscription methods
  onNotification(callback: (notification: NotificationData) => void) {
    this.notificationCallbacks.push(callback);
    return () => {
      this.notificationCallbacks = this.notificationCallbacks.filter(cb => cb !== callback);
    };
  }

  onWorkOrderUpdate(callback: (update: WorkOrderUpdate) => void) {
    this.workOrderCallbacks.push(callback);
    return () => {
      this.workOrderCallbacks = this.workOrderCallbacks.filter(cb => cb !== callback);
    };
  }

  onManufacturingOrderUpdate(callback: (update: ManufacturingOrderUpdate) => void) {
    this.manufacturingOrderCallbacks.push(callback);
    return () => {
      this.manufacturingOrderCallbacks = this.manufacturingOrderCallbacks.filter(cb => cb !== callback);
    };
  }

  onStockUpdate(callback: (update: StockUpdate) => void) {
    this.stockCallbacks.push(callback);
    return () => {
      this.stockCallbacks = this.stockCallbacks.filter(cb => cb !== callback);
    };
  }

  onQualityAlert(callback: (alert: QualityAlert) => void) {
    this.qualityCallbacks.push(callback);
    return () => {
      this.qualityCallbacks = this.qualityCallbacks.filter(cb => cb !== callback);
    };
  }

  // Emit methods
  startWorkOrder(workOrderId: string, operatorId: string) {
    this.socket?.emit('start-work-order', { workOrderId, operatorId });
  }

  updateWorkOrderProgress(workOrderId: string, progress: number, status?: string) {
    this.socket?.emit('update-work-order-progress', { workOrderId, progress, status });
  }

  completeWorkOrder(workOrderId: string, operatorId: string, timeSpent: number) {
    this.socket?.emit('complete-work-order', { workOrderId, operatorId, timeSpent });
  }

  reportQualityIssue(workOrderId: string, issue: Omit<QualityAlert, 'id' | 'timestamp' | 'workOrderId'>) {
    this.socket?.emit('quality-issue', { workOrderId, ...issue });
  }

  updateStock(materialId: string, quantity: number, operation: 'add' | 'subtract' | 'adjust', reason: string) {
    this.socket?.emit('update-stock', { materialId, quantity, operation, reason });
  }

  joinWorkOrderRoom(workOrderId: string) {
    this.socket?.emit('join-work-order-room', workOrderId);
  }

  leaveWorkOrderRoom(workOrderId: string) {
    this.socket?.emit('leave-work-order-room', workOrderId);
  }

  // Utility methods
  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  getConnectionStatus(): 'connected' | 'disconnected' | 'connecting' {
    if (!this.socket) return 'disconnected';
    if (this.socket.connected) return 'connected';
    if (this.socket.disconnected === false && !this.socket.connected) return 'connecting';
    return 'disconnected';
  }
}

// Create a singleton instance
const socketService = new SocketService();

export default socketService;
export type { NotificationData, WorkOrderUpdate, ManufacturingOrderUpdate, StockUpdate, QualityAlert };
