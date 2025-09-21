import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkOrder extends Document {
  workOrderNumber: string;
  manufacturingOrder: mongoose.Types.ObjectId;
  workCenter: mongoose.Types.ObjectId;
  operation: string;
  description: string;
  estimatedDuration: number; // in minutes
  actualDuration?: number;
  estimatedCost?: number;
  actualCost?: number;
  status: 'pending' | 'started' | 'paused' | 'completed' | 'issues';
  assignedOperator?: mongoose.Types.ObjectId;
  startTime?: Date;
  endTime?: Date;
  pausedTime?: number; // total paused time in minutes
  pauseLog: Array<{
    pausedAt: Date;
    resumedAt?: Date;
    reason?: string;
  }>;
  qualityChecks?: Array<{
    checkType: string;
    result: 'pass' | 'fail';
    notes?: string;
    checkedBy: mongoose.Types.ObjectId;
    checkedAt: Date;
  }>;
  notes?: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const workOrderSchema = new Schema<IWorkOrder>({
  workOrderNumber: {
    type: String,
    required: [true, 'Work order number is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  manufacturingOrder: {
    type: Schema.Types.ObjectId,
    ref: 'ManufacturingOrder',
    required: [true, 'Manufacturing order is required']
  },
  workCenter: {
    type: Schema.Types.ObjectId,
    ref: 'WorkCenter',
    required: [true, 'Work center is required']
  },
  operation: {
    type: String,
    required: [true, 'Operation is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  estimatedDuration: {
    type: Number,
    required: [true, 'Estimated duration is required'],
    min: [1, 'Estimated duration must be at least 1 minute']
  },
  actualDuration: {
    type: Number,
    min: [0, 'Actual duration cannot be negative']
  },
  estimatedCost: {
    type: Number,
    min: [0, 'Estimated cost cannot be negative']
  },
  actualCost: {
    type: Number,
    min: [0, 'Actual cost cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'started', 'paused', 'completed', 'issues'],
    default: 'pending'
  },
  assignedOperator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  pausedTime: {
    type: Number,
    default: 0,
    min: [0, 'Paused time cannot be negative']
  },
  pauseLog: [{
    pausedAt: {
      type: Date,
      required: true
    },
    resumedAt: {
      type: Date
    },
    reason: {
      type: String,
      trim: true
    }
  }],
  qualityChecks: [{
    checkType: {
      type: String,
      required: true,
      trim: true
    },
    result: {
      type: String,
      enum: ['pass', 'fail'],
      required: true
    },
    notes: {
      type: String,
      trim: true
    },
    checkedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    checkedAt: {
      type: Date,
      required: true,
      default: Date.now
    }
  }],
  notes: {
    type: String,
    trim: true
  },
  attachments: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Indexes
workOrderSchema.index({ workOrderNumber: 1 });
workOrderSchema.index({ manufacturingOrder: 1 });
workOrderSchema.index({ workCenter: 1 });
workOrderSchema.index({ status: 1 });
workOrderSchema.index({ assignedOperator: 1 });
workOrderSchema.index({ startTime: 1, endTime: 1 });

// Auto-generate work order number
workOrderSchema.pre('save', async function(next) {
  if (!this.workOrderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const count = await mongoose.model('WorkOrder').countDocuments({
      createdAt: {
        $gte: new Date(date.getFullYear(), date.getMonth(), 1),
        $lt: new Date(date.getFullYear(), date.getMonth() + 1, 1)
      }
    });
    this.workOrderNumber = `WO${year}${month}${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

export const WorkOrder = mongoose.model<IWorkOrder>('WorkOrder', workOrderSchema);
