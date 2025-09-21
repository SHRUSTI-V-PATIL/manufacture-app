import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDatabase } from '@/config/database.js';
import { User, Product, Material, WorkCenter, BOM, ManufacturingOrder } from '@/models/index.js';

// Load environment variables
dotenv.config();

const seedData = async () => {
  try {
    await connectDatabase();
    console.log('Connected to database');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Material.deleteMany({});
    await WorkCenter.deleteMany({});
    await BOM.deleteMany({});
    await ManufacturingOrder.deleteMany({});

    console.log('Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      email: 'admin@manufacturing.com',
      password: 'admin123',
      firstName: 'System',
      lastName: 'Administrator',
      role: 'admin',
      department: 'Management'
    });

    // Create sample users
    const manager = await User.create({
      email: 'manager@manufacturing.com',
      password: 'manager123',
      firstName: 'John',
      lastName: 'Manager',
      role: 'manager',
      department: 'Production'
    });

    const operator = await User.create({
      email: 'operator@manufacturing.com',
      password: 'operator123',
      firstName: 'Mike',
      lastName: 'Operator',
      role: 'operator',
      department: 'Production'
    });

    console.log('Created users');

    // Create sample materials
    const materials = await Material.create([
      {
        name: 'Steel Sheet',
        sku: 'MAT001',
        description: 'Cold rolled steel sheet 2mm thickness',
        category: 'Raw Materials',
        unitOfMeasure: 'kg',
        costPrice: 5.50,
        currentStock: 1000,
        minimumStock: 100,
        supplier: 'Steel Corp Ltd'
      },
      {
        name: 'Aluminum Rod',
        sku: 'MAT002',
        description: 'Aluminum rod 10mm diameter',
        category: 'Raw Materials',
        unitOfMeasure: 'm',
        costPrice: 8.25,
        currentStock: 500,
        minimumStock: 50,
        supplier: 'Metal Supply Co'
      },
      {
        name: 'Paint - Red',
        sku: 'MAT003',
        description: 'Industrial grade red paint',
        category: 'Consumables',
        unitOfMeasure: 'l',
        costPrice: 25.00,
        currentStock: 100,
        minimumStock: 20,
        supplier: 'Paint Solutions Inc'
      },
      {
        name: 'Screws M6x20',
        sku: 'MAT004',
        description: 'Stainless steel screws M6x20mm',
        category: 'Hardware',
        unitOfMeasure: 'pc',
        costPrice: 0.15,
        currentStock: 5000,
        minimumStock: 1000,
        supplier: 'Hardware Direct'
      }
    ]);

    console.log('Created materials');

    // Create sample products
    const products = await Product.create([
      {
        name: 'Industrial Widget A',
        sku: 'PROD001',
        description: 'Heavy duty industrial widget for manufacturing',
        category: 'Finished Goods',
        unitOfMeasure: 'pc',
        sellPrice: 150.00,
        standardCost: 85.00,
        productionTime: 120
      },
      {
        name: 'Control Panel B',
        sku: 'PROD002',
        description: 'Electronic control panel with LCD display',
        category: 'Electronics',
        unitOfMeasure: 'pc',
        sellPrice: 450.00,
        standardCost: 280.00,
        productionTime: 180
      }
    ]);

    console.log('Created products');

    // Create sample work centers
    const workCenters = await WorkCenter.create([
      {
        name: 'Assembly Line 1',
        code: 'ASM001',
        description: 'Main assembly line for widgets',
        capacity: 10,
        costPerHour: 75.00,
        location: 'Building A - Floor 1',
        responsiblePerson: operator._id
      },
      {
        name: 'Painting Station',
        code: 'PNT001',
        description: 'Automated painting station',
        capacity: 15,
        costPerHour: 45.00,
        location: 'Building B - Floor 1',
        responsiblePerson: operator._id
      },
      {
        name: 'Quality Control',
        code: 'QC001',
        description: 'Final quality control and testing',
        capacity: 8,
        costPerHour: 65.00,
        location: 'Building A - Floor 2',
        responsiblePerson: manager._id
      }
    ]);

    console.log('Created work centers');

    // Create sample BOMs
    const boms = await BOM.create([
      {
        product: products[0]._id,
        version: '1.0',
        items: [
          {
            material: materials[0]._id,
            quantity: 2.5,
            unit: 'kg',
            wastagePercentage: 5
          },
          {
            material: materials[1]._id,
            quantity: 0.8,
            unit: 'm',
            wastagePercentage: 3
          },
          {
            material: materials[3]._id,
            quantity: 8,
            unit: 'pc',
            wastagePercentage: 2
          }
        ],
        effectiveDate: new Date(),
        createdBy: adminUser._id,
        approvedBy: manager._id,
        approvedDate: new Date()
      },
      {
        product: products[1]._id,
        version: '1.0',
        items: [
          {
            material: materials[1]._id,
            quantity: 1.2,
            unit: 'm',
            wastagePercentage: 3
          },
          {
            material: materials[2]._id,
            quantity: 0.5,
            unit: 'l',
            wastagePercentage: 10
          },
          {
            material: materials[3]._id,
            quantity: 12,
            unit: 'pc',
            wastagePercentage: 2
          }
        ],
        effectiveDate: new Date(),
        createdBy: adminUser._id,
        approvedBy: manager._id,
        approvedDate: new Date()
      }
    ]);

    console.log('Created BOMs');

    // Create sample manufacturing orders
    const manufacturingOrders = await ManufacturingOrder.create([
      {
        product: products[0]._id,
        quantity: 50,
        priority: 'high',
        status: 'planned',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        assignee: operator._id,
        billOfMaterial: boms[0]._id,
        estimatedCost: 4250.00,
        notes: 'Urgent order for customer ABC Corp',
        createdBy: manager._id
      },
      {
        product: products[1]._id,
        quantity: 25,
        priority: 'medium',
        status: 'in_progress',
        startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
        actualStartDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        assignee: operator._id,
        billOfMaterial: boms[1]._id,
        estimatedCost: 7000.00,
        notes: 'Standard production run',
        createdBy: manager._id
      },
      {
        product: products[0]._id,
        quantity: 100,
        priority: 'low',
        status: 'completed',
        startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
        endDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        actualStartDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        actualEndDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // Completed 1 day early
        assignee: operator._id,
        billOfMaterial: boms[0]._id,
        estimatedCost: 8500.00,
        actualCost: 8200.00,
        notes: 'Completed ahead of schedule',
        createdBy: manager._id
      }
    ]);

    console.log('Created manufacturing orders');

    console.log('\n=== SEED DATA SUMMARY ===');
    console.log(`Created ${await User.countDocuments()} users`);
    console.log(`Created ${await Material.countDocuments()} materials`);
    console.log(`Created ${await Product.countDocuments()} products`);
    console.log(`Created ${await WorkCenter.countDocuments()} work centers`);
    console.log(`Created ${await BOM.countDocuments()} BOMs`);
    console.log(`Created ${await ManufacturingOrder.countDocuments()} manufacturing orders`);

    console.log('\n=== LOGIN CREDENTIALS ===');
    console.log('Admin: admin@manufacturing.com / admin123');
    console.log('Manager: manager@manufacturing.com / manager123');
    console.log('Operator: operator@manufacturing.com / operator123');

    console.log('\nSeed data created successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
};

// Run the seed function
seedData();
