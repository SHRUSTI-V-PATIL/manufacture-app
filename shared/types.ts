// Shared types for Manufacturing Management Application

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  OPERATOR = 'operator',
  INVENTORY_MANAGER = 'inventory_manager',
  BUSINESS_OWNER = 'business_owner'
}

export interface ManufacturingOrder {
  id: string;
  orderNumber: string;
  product: Product;
  quantity: number;
  priority: OrderPriority;
  status: OrderStatus;
  startDate: Date;
  endDate: Date;
  assignee?: User;
  billOfMaterial: BillOfMaterial;
  workOrders: WorkOrder[];
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
}

export enum OrderStatus {
  PLANNED = 'planned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  ON_HOLD = 'on_hold'
}

export enum OrderPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface WorkOrder {
  id: string;
  workOrderNumber: string;
  manufacturingOrder: string; // MO ID
  workCenter: WorkCenter;
  operation: string;
  description: string;
  estimatedDuration: number; // in minutes
  actualDuration?: number;
  status: WorkOrderStatus;
  assignedOperator?: User;
  startTime?: Date;
  endTime?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum WorkOrderStatus {
  PENDING = 'pending',
  STARTED = 'started',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  ISSUES = 'issues'
}

export interface WorkCenter {
  id: string;
  name: string;
  description: string;
  capacity: number; // units per hour
  costPerHour: number;
  isActive: boolean;
  currentLoad: number;
  downtime?: DowntimeRecord[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DowntimeRecord {
  id: string;
  reason: string;
  startTime: Date;
  endTime?: Date;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  unitOfMeasure: string;
  sellPrice?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BillOfMaterial {
  id: string;
  product: Product;
  version: string;
  items: BOMItem[];
  isActive: boolean;
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface BOMItem {
  id: string;
  material: Material;
  quantity: number;
  unit: string;
  wastagePercentage?: number;
  notes?: string;
}

export interface Material {
  id: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  unitOfMeasure: string;
  costPrice: number;
  currentStock: number;
  minimumStock: number;
  supplier?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StockLedgerEntry {
  id: string;
  material: Material;
  transactionType: TransactionType;
  quantity: number;
  unitCost?: number;
  totalCost?: number;
  reference: string; // MO ID, WO ID, etc.
  referenceType: ReferenceType;
  notes?: string;
  createdBy: User;
  createdAt: Date;
}

export enum TransactionType {
  INWARD = 'inward',
  OUTWARD = 'outward',
  ADJUSTMENT = 'adjustment',
  TRANSFER = 'transfer'
}

export enum ReferenceType {
  MANUFACTURING_ORDER = 'manufacturing_order',
  WORK_ORDER = 'work_order',
  PURCHASE = 'purchase',
  SALE = 'sale',
  ADJUSTMENT = 'adjustment'
}

export interface DashboardKPI {
  ordersCompleted: number;
  ordersInProgress: number;
  ordersDelayed: number;
  totalOrders: number;
  resourceUtilization: number;
  averageThroughput: number;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface OTPRequest {
  email: string;
}

export interface OTPVerification {
  email: string;
  otp: string;
  newPassword?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FilterOptions {
  status?: OrderStatus[];
  priority?: OrderPriority[];
  assignee?: string;
  dateFrom?: Date;
  dateTo?: Date;
  workCenter?: string;
}

export interface ReportOptions {
  type: ReportType;
  dateFrom: Date;
  dateTo: Date;
  format: 'excel' | 'pdf';
  filters?: FilterOptions;
}

export enum ReportType {
  ORDERS_SUMMARY = 'orders_summary',
  WORK_CENTER_UTILIZATION = 'work_center_utilization',
  STOCK_MOVEMENT = 'stock_movement',
  PRODUCTION_EFFICIENCY = 'production_efficiency'
}
