import { Router, Response } from 'express';
import { ManufacturingOrder, WorkOrder, Material, WorkCenter } from '@/models/index.js';
import { protect, AuthRequest } from '@/middleware/auth.js';

const router = Router();

// Apply auth middleware
router.use(protect);

// Get dashboard KPIs and statistics
router.get('/kpis', async (req: AuthRequest, res: Response) => {
  try {
    // Manufacturing Orders Statistics
    const moStats = await ManufacturingOrder.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Work Orders Statistics  
    const woStats = await WorkOrder.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Material Statistics
    const materialStats = await Material.aggregate([
      {
        $group: {
          _id: null,
          totalMaterials: { $sum: 1 },
          lowStockMaterials: {
            $sum: {
              $cond: {
                if: { $lte: ['$currentStock', '$minimumStock'] },
                then: 1,
                else: 0
              }
            }
          },
          totalStockValue: {
            $sum: { $multiply: ['$currentStock', '$costPrice'] }
          }
        }
      }
    ]);

    // Work Center Utilization
    const workCenterStats = await WorkCenter.aggregate([
      {
        $group: {
          _id: null,
          totalWorkCenters: { $sum: 1 },
          activeWorkCenters: {
            $sum: {
              $cond: {
                if: '$isActive',
                then: 1,
                else: 0
              }
            }
          },
          averageUtilization: { $avg: '$currentLoad' }
        }
      }
    ]);

    // Delayed Orders
    const delayedOrders = await ManufacturingOrder.countDocuments({
      endDate: { $lt: new Date() },
      status: { $in: ['planned', 'in_progress'] }
    });

    // Transform stats into more usable format
    const moStatusStats = moStats.reduce((acc: any, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    const woStatusStats = woStats.reduce((acc: any, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    const kpis = {
      manufacturingOrders: {
        total: Object.values(moStatusStats).reduce((sum: any, count: any) => sum + count, 0),
        planned: moStatusStats.planned || 0,
        inProgress: moStatusStats.in_progress || 0,
        completed: moStatusStats.completed || 0,
        cancelled: moStatusStats.cancelled || 0,
        onHold: moStatusStats.on_hold || 0,
        delayed: delayedOrders
      },
      workOrders: {
        total: Object.values(woStatusStats).reduce((sum: any, count: any) => sum + count, 0),
        pending: woStatusStats.pending || 0,
        started: woStatusStats.started || 0,
        paused: woStatusStats.paused || 0,
        completed: woStatusStats.completed || 0,
        issues: woStatusStats.issues || 0
      },
      materials: materialStats[0] || {
        totalMaterials: 0,
        lowStockMaterials: 0,
        totalStockValue: 0
      },
      workCenters: workCenterStats[0] || {
        totalWorkCenters: 0,
        activeWorkCenters: 0,
        averageUtilization: 0
      }
    };

    res.json({
      success: true,
      data: kpis
    });
  } catch (error) {
    console.error('Dashboard KPIs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get recent activities
router.get('/recent-activities', async (req: AuthRequest, res: Response) => {
  try {
    // Get recent manufacturing orders
    const recentMOs = await ManufacturingOrder.find()
      .populate('product', 'name sku')
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get recent work orders
    const recentWOs = await WorkOrder.find()
      .populate('manufacturingOrder', 'orderNumber')
      .populate('workCenter', 'name')
      .populate('assignedOperator', 'firstName lastName')
      .sort({ updatedAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        recentManufacturingOrders: recentMOs,
        recentWorkOrders: recentWOs
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get production trends (last 7 days)
router.get('/production-trends', async (req: AuthRequest, res: Response) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const trends = await ManufacturingOrder.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          ordersCreated: { $sum: 1 },
          ordersCompleted: {
            $sum: {
              $cond: {
                if: { $eq: ['$status', 'completed'] },
                then: 1,
                else: 0
              }
            }
          },
          totalQuantity: { $sum: '$quantity' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;
