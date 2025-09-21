import api from './api';

export interface DashboardKPIs {
  manufacturingOrders: {
    total: number;
    planned: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    onHold: number;
    delayed: number;
  };
  workOrders: {
    total: number;
    pending: number;
    started: number;
    paused: number;
    completed: number;
    issues: number;
  };
  materials: {
    totalMaterials: number;
    lowStockMaterials: number;
    totalStockValue: number;
  };
  workCenters: {
    totalWorkCenters: number;
    activeWorkCenters: number;
    averageUtilization: number;
  };
}

export interface RecentActivity {
  recentManufacturingOrders: any[];
  recentWorkOrders: any[];
}

export interface ProductionTrend {
  _id: string;
  ordersCreated: number;
  ordersCompleted: number;
  totalQuantity: number;
}

class DashboardService {
  async getKPIs(): Promise<DashboardKPIs> {
    try {
      const response = await api.get('/dashboard/kpis');
      return response.data.data;
    } catch (error) {
      throw new Error('Failed to fetch dashboard KPIs');
    }
  }

  async getRecentActivities(): Promise<RecentActivity> {
    try {
      const response = await api.get('/dashboard/recent-activities');
      return response.data.data;
    } catch (error) {
      throw new Error('Failed to fetch recent activities');
    }
  }

  async getProductionTrends(): Promise<ProductionTrend[]> {
    try {
      const response = await api.get('/dashboard/production-trends');
      return response.data.data;
    } catch (error) {
      throw new Error('Failed to fetch production trends');
    }
  }
}

export default new DashboardService();
