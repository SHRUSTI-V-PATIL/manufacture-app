import { Router, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import { ManufacturingOrder, BOM, Product, WorkOrder } from '@/models/index.js';
import { protect, restrictTo, AuthRequest } from '@/middleware/auth.js';
import { Types } from 'mongoose';

const router = Router();

// Apply auth middleware to all routes
router.use(protect);

// Get all manufacturing orders with filtering and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['planned', 'in_progress', 'completed', 'cancelled', 'on_hold']),
  query('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  query('search').optional().isString()
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};
    
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    if (req.query.priority) {
      filter.priority = req.query.priority;
    }

    if (req.query.search) {
      filter.$or = [
        { orderNumber: { $regex: req.query.search, $options: 'i' } },
        { notes: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Get manufacturing orders with populated data
    const manufacturingOrders = await ManufacturingOrder.find(filter)
      .populate('product', 'name sku category')
      .populate('assignee', 'firstName lastName email')
      .populate('billOfMaterial', 'version')
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ManufacturingOrder.countDocuments(filter);

    res.json({
      success: true,
      data: manufacturingOrders,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: manufacturingOrders.length,
        totalRecords: total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get single manufacturing order by ID
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid manufacturing order ID'
      });
    }

    const manufacturingOrder = await ManufacturingOrder.findById(req.params.id)
      .populate('product')
      .populate('assignee', 'firstName lastName email role')
      .populate('billOfMaterial')
      .populate('workOrders')
      .populate('createdBy', 'firstName lastName');

    if (!manufacturingOrder) {
      return res.status(404).json({
        success: false,
        message: 'Manufacturing order not found'
      });
    }

    res.json({
      success: true,
      data: manufacturingOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Create new manufacturing order
router.post('/', restrictTo('admin', 'manager'), [
  body('product').isMongoId().withMessage('Valid product ID required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('startDate').isISO8601().withMessage('Valid start date required'),
  body('endDate').isISO8601().withMessage('Valid end date required'),
  body('assignee').optional().isMongoId(),
  body('billOfMaterial').isMongoId().withMessage('Valid BOM ID required'),
  body('notes').optional().isString()
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input',
        errors: errors.array()
      });
    }

    const { product, quantity, priority, startDate, endDate, assignee, billOfMaterial, notes } = req.body;

    // Validate dates
    if (new Date(endDate) <= new Date(startDate)) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    // Verify product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Verify BOM exists and is active
    const bomExists = await BOM.findById(billOfMaterial);
    if (!bomExists || !bomExists.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Active BOM not found'
      });
    }

    // Create manufacturing order
    const manufacturingOrder = await ManufacturingOrder.create({
      product,
      quantity,
      priority: priority || 'medium',
      startDate,
      endDate,
      assignee,
      billOfMaterial,
      notes,
      createdBy: req.user!._id
    });

    // Populate the created order for response
    await manufacturingOrder.populate('product', 'name sku');
    await manufacturingOrder.populate('assignee', 'firstName lastName');
    await manufacturingOrder.populate('createdBy', 'firstName lastName');

    res.status(201).json({
      success: true,
      data: manufacturingOrder,
      message: 'Manufacturing order created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update manufacturing order
router.put('/:id', restrictTo('admin', 'manager'), [
  body('quantity').optional().isInt({ min: 1 }),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('status').optional().isIn(['planned', 'in_progress', 'completed', 'cancelled', 'on_hold']),
  body('startDate').optional().isISO8601(),
  body('endDate').optional().isISO8601(),
  body('assignee').optional().isMongoId(),
  body('notes').optional().isString()
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input',
        errors: errors.array()
      });
    }

    if (!Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid manufacturing order ID'
      });
    }

    const manufacturingOrder = await ManufacturingOrder.findById(req.params.id);
    if (!manufacturingOrder) {
      return res.status(404).json({
        success: false,
        message: 'Manufacturing order not found'
      });
    }

    // Validate dates if both are provided
    const startDate = req.body.startDate || manufacturingOrder.startDate;
    const endDate = req.body.endDate || manufacturingOrder.endDate;

    if (new Date(endDate) <= new Date(startDate)) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    // Update fields
    Object.assign(manufacturingOrder, req.body);
    await manufacturingOrder.save();

    // Populate for response
    await manufacturingOrder.populate('product', 'name sku');
    await manufacturingOrder.populate('assignee', 'firstName lastName');

    res.json({
      success: true,
      data: manufacturingOrder,
      message: 'Manufacturing order updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Delete manufacturing order
router.delete('/:id', restrictTo('admin', 'manager'), async (req: AuthRequest, res: Response) => {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid manufacturing order ID'
      });
    }

    const manufacturingOrder = await ManufacturingOrder.findById(req.params.id);
    if (!manufacturingOrder) {
      return res.status(404).json({
        success: false,
        message: 'Manufacturing order not found'
      });
    }

    // Check if order can be deleted (not in progress or completed)
    if (['in_progress', 'completed'].includes(manufacturingOrder.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete manufacturing order that is in progress or completed'
      });
    }

    // Delete associated work orders
    await WorkOrder.deleteMany({ manufacturingOrder: req.params.id });

    // Delete manufacturing order
    await ManufacturingOrder.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Manufacturing order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get dashboard stats for manufacturing orders
router.get('/stats/dashboard', async (req: AuthRequest, res: Response) => {
  try {
    const stats = await ManufacturingOrder.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalOrders = await ManufacturingOrder.countDocuments();
    const delayedOrders = await ManufacturingOrder.countDocuments({
      endDate: { $lt: new Date() },
      status: { $in: ['planned', 'in_progress'] }
    });

    // Transform stats into more usable format
    const statusStats = stats.reduce((acc: any, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        total: totalOrders,
        planned: statusStats.planned || 0,
        inProgress: statusStats.in_progress || 0,
        completed: statusStats.completed || 0,
        cancelled: statusStats.cancelled || 0,
        onHold: statusStats.on_hold || 0,
        delayed: delayedOrders
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;
