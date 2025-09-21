import mongoose, { Schema, Document } from 'mongoose';

export interface IMaterial extends Document {
  name: string;
  sku: string;
  description?: string;
  category: string;
  unitOfMeasure: string;
  costPrice: number;
  currentStock: number;
  minimumStock: number;
  maximumStock?: number;
  supplier?: string;
  supplierPartNumber?: string;
  isActive: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const materialSchema = new Schema<IMaterial>({
  name: {
    type: String,
    required: [true, 'Material name is required'],
    trim: true,
    maxlength: [100, 'Material name cannot exceed 100 characters']
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
    enum: ['kg', 'g', 'lb', 'oz', 'l', 'ml', 'gal', 'm', 'cm', 'ft', 'in', 'pc', 'dozen', 'box']
  },
  costPrice: {
    type: Number,
    required: [true, 'Cost price is required'],
    min: [0, 'Cost price cannot be negative']
  },
  currentStock: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  minimumStock: {
    type: Number,
    required: [true, 'Minimum stock is required'],
    min: [0, 'Minimum stock cannot be negative']
  },
  maximumStock: {
    type: Number,
    min: [0, 'Maximum stock cannot be negative']
  },
  supplier: {
    type: String,
    trim: true
  },
  supplierPartNumber: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes
materialSchema.index({ sku: 1 });
materialSchema.index({ category: 1 });
materialSchema.index({ name: 'text', description: 'text' });

export const Material = mongoose.model<IMaterial>('Material', materialSchema);
