import mongoose, { Schema, Document } from 'mongoose';

export interface IStockLedgerEntry extends Document {
  material: mongoose.Types.ObjectId;
  transactionType: 'inward' | 'outward' | 'adjustment' | 'transfer';
  quantity: number;
  unitCost?: number;
  totalCost?: number;
  reference: string; // MO ID, WO ID, etc.
  referenceType: 'manufacturing_order' | 'work_order' | 'purchase' | 'sale' | 'adjustment' | 'transfer';
  referenceDocument?: mongoose.Types.ObjectId;
  balanceAfterTransaction: number;
  warehouse?: string;
  location?: string;
  batchNumber?: string;
  expiryDate?: Date;
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const stockLedgerSchema = new Schema<IStockLedgerEntry>({
  material: {
    type: Schema.Types.ObjectId,
    ref: 'Material',
    required: [true, 'Material is required']
  },
  transactionType: {
    type: String,
    enum: ['inward', 'outward', 'adjustment', 'transfer'],
    required: [true, 'Transaction type is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    validate: {
      validator: function(this: IStockLedgerEntry, quantity: number) {
        return quantity !== 0;
      },
      message: 'Quantity cannot be zero'
    }
  },
  unitCost: {
    type: Number,
    min: [0, 'Unit cost cannot be negative']
  },
  totalCost: {
    type: Number
  },
  reference: {
    type: String,
    required: [true, 'Reference is required'],
    trim: true
  },
  referenceType: {
    type: String,
    enum: ['manufacturing_order', 'work_order', 'purchase', 'sale', 'adjustment', 'transfer'],
    required: [true, 'Reference type is required']
  },
  referenceDocument: {
    type: Schema.Types.ObjectId,
    refPath: 'referenceType'
  },
  balanceAfterTransaction: {
    type: Number,
    required: [true, 'Balance after transaction is required'],
    min: [0, 'Balance cannot be negative']
  },
  warehouse: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  batchNumber: {
    type: String,
    trim: true
  },
  expiryDate: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
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
  approvedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes
stockLedgerSchema.index({ material: 1, createdAt: -1 });
stockLedgerSchema.index({ transactionType: 1 });
stockLedgerSchema.index({ reference: 1 });
stockLedgerSchema.index({ referenceType: 1 });
stockLedgerSchema.index({ createdAt: -1 });
stockLedgerSchema.index({ warehouse: 1, location: 1 });

// Calculate total cost before saving
stockLedgerSchema.pre('save', function(next) {
  if (this.unitCost && this.quantity) {
    this.totalCost = Math.abs(this.unitCost * this.quantity);
  }
  next();
});

export const StockLedgerEntry = mongoose.model<IStockLedgerEntry>('StockLedgerEntry', stockLedgerSchema);
