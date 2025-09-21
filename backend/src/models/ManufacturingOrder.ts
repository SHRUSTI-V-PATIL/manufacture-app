import mongoose, { Schema, Document } from 'mongoose';

export interface IManufacturingOrder extends Document {
  orderNumber: string;
  product: mongoose.Types.ObjectId;
  quantity: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';
  startDate: Date;
  endDate: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  assignee?: mongoose.Types.ObjectId;
  billOfMaterial: mongoose.Types.ObjectId;
  workOrders: mongoose.Types.ObjectId[];
  estimatedCost?: number;
  actualCost?: number;
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const manufacturingOrderSchema = new Schema<IManufacturingOrder>({
  orderNumber: {
    type: String,
    required: [true, 'Order number is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['planned', 'in_progress', 'completed', 'cancelled', 'on_hold'],
    default: 'planned'
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function(this: IManufacturingOrder, endDate: Date) {
        return endDate > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  actualStartDate: {
    type: Date
  },
  actualEndDate: {
    type: Date
  },
  assignee: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  billOfMaterial: {
    type: Schema.Types.ObjectId,
    ref: 'BOM',
    required: [true, 'Bill of Material is required']
  },
  workOrders: [{
    type: Schema.Types.ObjectId,
    ref: 'WorkOrder'
  }],
  estimatedCost: {
    type: Number,
    min: [0, 'Estimated cost cannot be negative']
  },
  actualCost: {
    type: Number,
    min: [0, 'Actual cost cannot be negative']
  },
  notes: {
    type: String,
    trim: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Created by is required']
  }
}, {
  timestamps: true
});

// Indexes
manufacturingOrderSchema.index({ orderNumber: 1 });
manufacturingOrderSchema.index({ status: 1 });
manufacturingOrderSchema.index({ priority: 1 });
manufacturingOrderSchema.index({ startDate: 1, endDate: 1 });
manufacturingOrderSchema.index({ product: 1 });
manufacturingOrderSchema.index({ createdBy: 1 });

// Auto-generate order number
manufacturingOrderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {  
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const count = await mongoose.model('ManufacturingOrder').countDocuments({
      createdAt: {
        $gte: new Date(date.getFullYear(), date.getMonth(), 1),
        $lt: new Date(date.getFullYear(), date.getMonth() + 1, 1)
      }
    });
    console.log("\n\n\n---",this.orderNumber)
    this.orderNumber = `MOoooo${year}${month}${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

export const ManufacturingOrder = mongoose.model<IManufacturingOrder>('ManufacturingOrder', manufacturingOrderSchema);
