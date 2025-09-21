import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Autocomplete,
  Divider
} from '@mui/material';
import {
  Add,
  Edit,
  Visibility,
  TrendingUp,
  TrendingDown,
  Inventory,
  Warning,
  Search,
  FilterList,
  GetApp
} from '@mui/icons-material';

interface Material {
  _id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitCost: number;
  location: string;
}

interface StockLedgerEntry {
  _id: string;
  material: Material;
  transactionType: 'receipt' | 'issue' | 'adjustment' | 'transfer';
  quantity: number;
  unit: string;
  unitCost: number;
  totalValue: number;
  reference: string;
  description: string;
  location: string;
  batch?: string;
  expiryDate?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface StockMovement {
  _id: string;
  material: Material;
  fromLocation: string;
  toLocation: string;
  quantity: number;
  reason: string;
  status: 'pending' | 'in-transit' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: string;
}

const StockLedgerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [stockEntries, setStockEntries] = useState<StockLedgerEntry[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'entry' | 'movement' | 'adjustment'>('entry');

  // Filters
  const [filters, setFilters] = useState({
    material: '',
    transactionType: '',
    location: '',
    dateFrom: '',
    dateTo: ''
  });

  // Form state for new entries
  const [formData, setFormData] = useState({
    materialId: '',
    transactionType: 'receipt' as const,
    quantity: 0,
    unitCost: 0,
    reference: '',
    description: '',
    location: '',
    batch: '',
    expiryDate: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Mock materials data
      const mockMaterials: Material[] = [
        {
          _id: '1',
          code: 'STL-001',
          name: 'Steel Plate 10mm',
          category: 'Raw Materials',
          unit: 'kg',
          currentStock: 450,
          minStock: 100,
          maxStock: 1000,
          unitCost: 2.50,
          location: 'Warehouse A-1'
        },
        {
          _id: '2',
          code: 'ALU-002',
          name: 'Aluminum Rod 20mm',
          category: 'Raw Materials',
          unit: 'm',
          currentStock: 75,
          minStock: 50,
          maxStock: 200,
          unitCost: 8.75,
          location: 'Warehouse A-2'
        },
        {
          _id: '3',
          code: 'BRG-003',
          name: 'Ball Bearing 6205',
          category: 'Components',
          unit: 'pcs',
          currentStock: 25,
          minStock: 50,
          maxStock: 500,
          unitCost: 12.30,
          location: 'Warehouse B-1'
        }
      ];

      // Mock stock entries
      const mockEntries: StockLedgerEntry[] = [
        {
          _id: '1',
          material: mockMaterials[0],
          transactionType: 'receipt',
          quantity: 100,
          unit: 'kg',
          unitCost: 2.50,
          totalValue: 250,
          reference: 'PO-2024-001',
          description: 'Purchase from Supplier ABC',
          location: 'Warehouse A-1',
          batch: 'BATCH-001',
          createdBy: 'John Doe',
          createdAt: '2024-01-20T10:30:00Z',
          updatedAt: '2024-01-20T10:30:00Z'
        },
        {
          _id: '2',
          material: mockMaterials[0],
          transactionType: 'issue',
          quantity: -50,
          unit: 'kg',
          unitCost: 2.50,
          totalValue: -125,
          reference: 'WO-2024-001',
          description: 'Issued to production for MO-001',
          location: 'Warehouse A-1',
          createdBy: 'Jane Smith',
          createdAt: '2024-01-21T14:15:00Z',
          updatedAt: '2024-01-21T14:15:00Z'
        },
        {
          _id: '3',
          material: mockMaterials[2],
          transactionType: 'adjustment',
          quantity: -5,
          unit: 'pcs',
          unitCost: 12.30,
          totalValue: -61.50,
          reference: 'ADJ-001',
          description: 'Physical count adjustment',
          location: 'Warehouse B-1',
          createdBy: 'Admin User',
          createdAt: '2024-01-22T09:00:00Z',
          updatedAt: '2024-01-22T09:00:00Z'
        }
      ];

      // Mock stock movements
      const mockMovements: StockMovement[] = [
        {
          _id: '1',
          material: mockMaterials[1],
          fromLocation: 'Warehouse A-2',
          toLocation: 'Production Floor',
          quantity: 25,
          reason: 'Production requirement for MO-002',
          status: 'completed',
          createdBy: 'Production Manager',
          createdAt: '2024-01-21T11:00:00Z'
        },
        {
          _id: '2',
          material: mockMaterials[2],
          fromLocation: 'Warehouse B-1',
          toLocation: 'Assembly Line A',
          quantity: 20,
          reason: 'Assembly line replenishment',
          status: 'in-transit',
          createdBy: 'Logistics Team',
          createdAt: '2024-01-22T08:30:00Z'
        }
      ];

      setMaterials(mockMaterials);
      setStockEntries(mockEntries);
      setStockMovements(mockMovements);
    } catch (err) {
      setError('Failed to fetch stock data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (type: 'entry' | 'movement' | 'adjustment') => {
    setDialogType(type);
    setFormData({
      materialId: '',
      transactionType: type === 'entry' ? 'receipt' : 'issue',
      quantity: 0,
      unitCost: 0,
      reference: '',
      description: '',
      location: '',
      batch: '',
      expiryDate: ''
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async () => {
    try {
      const selectedMaterial = materials.find(m => m._id === formData.materialId);
      if (!selectedMaterial) return;

      const newEntry: StockLedgerEntry = {
        _id: Date.now().toString(),
        material: selectedMaterial,
        transactionType: formData.transactionType,
        quantity: formData.transactionType === 'issue' ? -Math.abs(formData.quantity) : formData.quantity,
        unit: selectedMaterial.unit,
        unitCost: formData.unitCost,
        totalValue: formData.quantity * formData.unitCost * (formData.transactionType === 'issue' ? -1 : 1),
        reference: formData.reference,
        description: formData.description,
        location: formData.location,
        batch: formData.batch,
        createdBy: 'Current User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setStockEntries(prev => [newEntry, ...prev]);
      handleCloseDialog();
    } catch (err) {
      setError('Failed to create stock entry');
    }
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'receipt': return 'success';
      case 'issue': return 'error';
      case 'adjustment': return 'warning';
      case 'transfer': return 'info';
      default: return 'default';
    }
  };

  const getMovementStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-transit': return 'warning';
      case 'pending': return 'info';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getLowStockMaterials = () => {
    return materials.filter(m => m.currentStock <= m.minStock);
  };

  const filteredEntries = stockEntries.filter(entry => {
    if (filters.material && !entry.material.name.toLowerCase().includes(filters.material.toLowerCase())) return false;
    if (filters.transactionType && entry.transactionType !== filters.transactionType) return false;
    if (filters.location && !entry.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Stock Ledger
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => handleOpenDialog('entry')}
          >
            Add Entry
          </Button>
          <Button
            variant="outlined"
            startIcon={<TrendingUp />}
            onClick={() => handleOpenDialog('movement')}
          >
            Stock Movement
          </Button>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => handleOpenDialog('adjustment')}
          >
            Adjustment
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stock Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Materials
                  </Typography>
                  <Typography variant="h4">
                    {materials.length}
                  </Typography>
                </Box>
                <Inventory color="primary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Low Stock Items
                  </Typography>
                  <Typography variant="h4" color="error">
                    {getLowStockMaterials().length}
                  </Typography>
                </Box>
                <Warning color="error" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Stock Value
                  </Typography>
                  <Typography variant="h4">
                    ${materials.reduce((acc, m) => acc + (m.currentStock * m.unitCost), 0).toLocaleString()}
                  </Typography>
                </Box>
                <TrendingUp color="success" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Transactions Today
                  </Typography>
                  <Typography variant="h4">
                    {stockEntries.filter(e => {
                      const today = new Date().toDateString();
                      return new Date(e.createdAt).toDateString() === today;
                    }).length}
                  </Typography>
                </Box>
                <TrendingDown color="info" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Low Stock Alert */}
      {getLowStockMaterials().length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="h6">Low Stock Alert</Typography>
          <Typography>
            {getLowStockMaterials().map(m => m.name).join(', ')} are below minimum stock levels.
          </Typography>
        </Alert>
      )}

      {/* Tabs */}
      <Card>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Stock Entries" />
          <Tab label="Stock Movements" />
          <Tab label="Material Summary" />
        </Tabs>

        <CardContent>
          {/* Filters */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Search Material"
                value={filters.material}
                onChange={(e) => setFilters({ ...filters, material: e.target.value })}
                InputProps={{ startAdornment: <Search /> }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Transaction Type</InputLabel>
                <Select
                  value={filters.transactionType}
                  label="Transaction Type"
                  onChange={(e) => setFilters({ ...filters, transactionType: e.target.value })}
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="receipt">Receipt</MenuItem>
                  <MenuItem value="issue">Issue</MenuItem>
                  <MenuItem value="adjustment">Adjustment</MenuItem>
                  <MenuItem value="transfer">Transfer</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Location"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="From Date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="To Date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GetApp />}
                onClick={() => console.log('Export functionality')}
              >
                Export
              </Button>
            </Grid>
          </Grid>

          {/* Tab Content */}
          {activeTab === 0 && (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Material</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Unit Cost</TableCell>
                    <TableCell>Total Value</TableCell>
                    <TableCell>Reference</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Created By</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEntries.map((entry) => (
                    <TableRow key={entry._id}>
                      <TableCell>
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {entry.material.code}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {entry.material.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={entry.transactionType}
                          color={getTransactionTypeColor(entry.transactionType) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography 
                          color={entry.quantity < 0 ? 'error' : 'success'}
                          fontWeight="bold"
                        >
                          {entry.quantity > 0 ? '+' : ''}{entry.quantity} {entry.unit}
                        </Typography>
                      </TableCell>
                      <TableCell>${entry.unitCost.toFixed(2)}</TableCell>
                      <TableCell>
                        <Typography 
                          color={entry.totalValue < 0 ? 'error' : 'success'}
                          fontWeight="bold"
                        >
                          ${entry.totalValue.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>{entry.reference}</TableCell>
                      <TableCell>{entry.location}</TableCell>
                      <TableCell>{entry.createdBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {activeTab === 1 && (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Material</TableCell>
                    <TableCell>From</TableCell>
                    <TableCell>To</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Created By</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stockMovements.map((movement) => (
                    <TableRow key={movement._id}>
                      <TableCell>
                        {new Date(movement.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {movement.material.code}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {movement.material.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{movement.fromLocation}</TableCell>
                      <TableCell>{movement.toLocation}</TableCell>
                      <TableCell>{movement.quantity} {movement.material.unit}</TableCell>
                      <TableCell>
                        <Chip
                          label={movement.status}
                          color={getMovementStatusColor(movement.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{movement.reason}</TableCell>
                      <TableCell>{movement.createdBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {activeTab === 2 && (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Code</TableCell>
                    <TableCell>Material Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Current Stock</TableCell>
                    <TableCell>Min Stock</TableCell>
                    <TableCell>Max Stock</TableCell>
                    <TableCell>Unit Cost</TableCell>
                    <TableCell>Stock Value</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {materials.map((material) => (
                    <TableRow key={material._id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {material.code}
                        </Typography>
                      </TableCell>
                      <TableCell>{material.name}</TableCell>
                      <TableCell>{material.category}</TableCell>
                      <TableCell>
                        <Typography
                          color={material.currentStock <= material.minStock ? 'error' : 'text.primary'}
                          fontWeight={material.currentStock <= material.minStock ? 'bold' : 'normal'}
                        >
                          {material.currentStock} {material.unit}
                        </Typography>
                      </TableCell>
                      <TableCell>{material.minStock} {material.unit}</TableCell>
                      <TableCell>{material.maxStock} {material.unit}</TableCell>
                      <TableCell>${material.unitCost.toFixed(2)}</TableCell>
                      <TableCell>${(material.currentStock * material.unitCost).toFixed(2)}</TableCell>
                      <TableCell>{material.location}</TableCell>
                      <TableCell>
                        <Chip
                          label={material.currentStock <= material.minStock ? 'Low Stock' : 'OK'}
                          color={material.currentStock <= material.minStock ? 'error' : 'success'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Create Entry Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogType === 'entry' && 'Add Stock Entry'}
          {dialogType === 'movement' && 'Create Stock Movement'}
          {dialogType === 'adjustment' && 'Stock Adjustment'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={materials}
                getOptionLabel={(option) => `${option.code} - ${option.name}`}
                value={materials.find(m => m._id === formData.materialId) || null}
                onChange={(event, newValue) => {
                  setFormData({ ...formData, materialId: newValue?._id || '' });
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Material" fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Transaction Type</InputLabel>
                <Select
                  value={formData.transactionType}
                  label="Transaction Type"
                  onChange={(e) => setFormData({ ...formData, transactionType: e.target.value as any })}
                >
                  <MenuItem value="receipt">Receipt</MenuItem>
                  <MenuItem value="issue">Issue</MenuItem>
                  <MenuItem value="adjustment">Adjustment</MenuItem>
                  <MenuItem value="transfer">Transfer</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Unit Cost"
                type="number"
                value={formData.unitCost}
                onChange={(e) => setFormData({ ...formData, unitCost: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Reference"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            {formData.transactionType === 'receipt' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Batch Number"
                    value={formData.batch}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Expiry Date"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Create Entry
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StockLedgerPage;
