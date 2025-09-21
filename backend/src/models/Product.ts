import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  sku: string;
  description?: string;
  category: string;
  unitOfMeasure: string;
  sellPrice?: number;
  standardCost?: number;
  productionTime?: number; // in minutes
  isActive: boolean;
  imageUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  unitOfMeasure: {
    type: String,
    required: [true, 'Unit of measure is required'],
    enum: ['pc', 'dozen', 'box', 'set', 'kg', 'g', 'l', 'ml']
  },
  sellPrice: {
    type: Number,
    min: [0, 'Sell price cannot be negative']
  },
  standardCost: {
    type: Number,
    min: [0, 'Standard cost cannot be negative']
  },
  productionTime: {
    type: Number,
    min: [0, 'Production time cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  imageUrl: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes
productSchema.index({ sku: 1 });
productSchema.index({ category: 1 });
productSchema.index({ name: 'text', description: 'text' });

export const Product = mongoose.model<IProduct>('Product', productSchema);
