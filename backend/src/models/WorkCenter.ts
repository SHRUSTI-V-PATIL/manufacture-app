import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkCenter extends Document {
  name: string;
  code: string;
  description?: string;
  capacity: number; // units per hour
  costPerHour: number;
  isActive: boolean;
  currentLoad: number;
  location?: string;
  responsiblePerson?: mongoose.Types.ObjectId;
  downtime: Array<{
    reason: string;
    startTime: Date;
    endTime?: Date;
    description?: string;
  }>;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const workCenterSchema = new Schema<IWorkCenter>({
  name: {
    type: String,
    required: [true, 'Work center name is required'],
    trim: true,
    maxlength: [100, 'Work center name cannot exceed 100 characters']
  },
  code: {
    type: String,
    required: [true, 'Work center code is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  description: {
    type: String,
    trim: true
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: [0.1, 'Capacity must be greater than 0']
  },
  costPerHour: {
    type: Number,
    required: [true, 'Cost per hour is required'],
    min: [0, 'Cost per hour cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  currentLoad: {
    type: Number,
    default: 0,
    min: [0, 'Current load cannot be negative'],
    max: [100, 'Current load cannot exceed 100%']
  },
  location: {
    type: String,
    trim: true
  },
  responsiblePerson: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  downtime: [{
    reason: {
      type: String,
      required: true,
      enum: ['maintenance', 'breakdown', 'setup', 'material_shortage', 'other']
    },
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date
    },
    description: {
      type: String,
      trim: true
    }
  }],
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes
workCenterSchema.index({ code: 1 });
workCenterSchema.index({ isActive: 1 });
workCenterSchema.index({ name: 'text', description: 'text' });

export const WorkCenter = mongoose.model<IWorkCenter>('WorkCenter', workCenterSchema);
