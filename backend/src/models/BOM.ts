import mongoose, { Schema, Document } from 'mongoose';

export interface IBOMItem {
  material: mongoose.Types.ObjectId;
  quantity: number;
  unit: string;
  wastagePercentage?: number;
  notes?: string;
}

export interface IBOM extends Document {
  product: mongoose.Types.ObjectId;
  version: string;
  items: IBOMItem[];
  isActive: boolean;
  effectiveDate: Date;
  expiryDate?: Date;
  createdBy: mongoose.Types.ObjectId;
  approvedBy?: mongoose.Types.ObjectId;
  approvedDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const bomItemSchema = new Schema<IBOMItem>({
  material: {
    type: Schema.Types.ObjectId,
    ref: 'Material',
    required: [true, 'Material is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0.001, 'Quantity must be greater than 0']
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    enum: ['kg', 'g', 'lb', 'oz', 'l', 'ml', 'gal', 'm', 'cm', 'ft', 'in', 'pc', 'dozen', 'box']
  },
  wastagePercentage: {
    type: Number,
    default: 0,
    min: [0, 'Wastage percentage cannot be negative'],
    max: [100, 'Wastage percentage cannot exceed 100%']
  },
  notes: {
    type: String,
    trim: true
  }
});

const bomSchema = new Schema<IBOM>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required']
  },
  version: {
    type: String,
    required: [true, 'Version is required'],
    trim: true,
    default: '1.0'
  },
  items: {
    type: [bomItemSchema],
    required: [true, 'BOM items are required'],
    validate: {
      validator: function(items: IBOMItem[]) {
        return items.length > 0;
      },
      message: 'BOM must have at least one item'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  effectiveDate: {
    type: Date,
    required: [true, 'Effective date is required'],
    default: Date.now
  },
  expiryDate: {
    type: Date
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Created by is required']
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedDate: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Compound indexes
bomSchema.index({ product: 1, version: 1 }, { unique: true });
bomSchema.index({ product: 1, isActive: 1 });
bomSchema.index({ effectiveDate: 1 });

export const BOM = mongoose.model<IBOM>('BOM', bomSchema);
