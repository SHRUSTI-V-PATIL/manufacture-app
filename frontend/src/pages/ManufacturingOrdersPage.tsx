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
  Autocomplete,
  LinearProgress,
  // ...existing code...
  Badge
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  PlayArrow,
  Pause,
  Build,
  CheckCircle,
  Warning,
  Assignment,
  FilterList,
  Search,
  Print,
  GetApp
} from '@mui/icons-material';

interface Material {
  _id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  unitCost: number;
}

interface BOM {
  _id: string;
  bomNumber: string;
  product: Material;
  version: string;
  totalCost: number;
  components: any[];
}

interface WorkOrder {
  _id: string;
  woNumber: string;
  workCenter: string;
  status: 'pending' | 'in-progress' | 'completed' | 'on-hold';
  plannedStart: string;
  plannedEnd: string;
  actualStart?: string;
  actualEnd?: string;
  assignedOperator?: string;
  progress: number;
}

interface ManufacturingOrder {
  _id: string;
  moNumber: string;
  product: Material;
  bom: BOM;
  quantity: number;
  unit: string;
  status: 'draft' | 'released' | 'in-progress' | 'completed' | 'on-hold' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  plannedStartDate: string;
  plannedEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  progress: number;
  workOrders: WorkOrder[];
  materialRequirements: any[];
  qualityChecks: any[];
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

const ManufacturingOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<ManufacturingOrder[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [boms, setBOMs] = useState<BOM[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<ManufacturingOrder | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    moNumber: '',
    productId: '',
    bomId: '',
    quantity: 0,
    priority: 'medium' as const,
    plannedStartDate: new Date().toISOString().split('T')[0],
    plannedEndDate: '',
    notes: ''
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
          code: 'PRD-001',
          name: 'Finished Product A',
          category: 'Finished Goods',
          unit: 'ea',
          unitCost: 150.00
        },
        {
          _id: '2',
          code: 'PRD-002',
          name: 'Finished Product B',
          category: 'Finished Goods',
          unit: 'ea',
          unitCost: 225.00
        },
        {
          _id: '3',
          code: 'PRD-003',
          name: 'Finished Product C',
          category: 'Finished Goods',
          unit: 'ea',
          unitCost: 180.00
        }
      ];

      // Mock BOM data
      const mockBOMs: BOM[] = [
        {
          _id: '1',
          bomNumber: 'BOM-PRD-001-V1.0',
          product: mockMaterials[0],
          version: '1.0',
          totalCost: 132.45,
          components: []
        },
        {
          _id: '2',
          bomNumber: 'BOM-PRD-002-V1.0',
          product: mockMaterials[1],
          version: '1.0',
          totalCost: 198.75,
          components: []
        }
      ];

      // Mock Manufacturing Orders
      const mockOrders: ManufacturingOrder[] = [
        {
          _id: '1',
          moNumber: 'MO-2024-001',
          product: mockMaterials[0],
          bom: mockBOMs[0],
          quantity: 100,
          unit: 'ea',
          status: 'in-progress',
          priority: 'high',
          plannedStartDate: '2024-01-15',
          plannedEndDate: '2024-01-25',
          actualStartDate: '2024-01-15',
          progress: 65,
          workOrders: [
            {
              _id: '1',
              woNumber: 'WO-2024-001-01',
              workCenter: 'Machining Center 1',
              status: 'completed',
              plannedStart: '2024-01-15T08:00:00Z',
              plannedEnd: '2024-01-16T17:00:00Z',
              actualStart: '2024-01-15T08:00:00Z',
              actualEnd: '2024-01-16T16:30:00Z',
              assignedOperator: 'John Smith',
              progress: 100
            },
            {
              _id: '2',
              woNumber: 'WO-2024-001-02',
              workCenter: 'Assembly Line A',
              status: 'in-progress',
              plannedStart: '2024-01-17T08:00:00Z',
              plannedEnd: '2024-01-20T17:00:00Z',
              actualStart: '2024-01-17T08:15:00Z',
              assignedOperator: 'Jane Doe',
              progress: 45
            },
            {
              _id: '3',
              woNumber: 'WO-2024-001-03',
              workCenter: 'Quality Control',
              status: 'pending',
              plannedStart: '2024-01-21T08:00:00Z',
              plannedEnd: '2024-01-22T17:00:00Z',
              progress: 0
            }
          ],
          materialRequirements: [],
          qualityChecks: [],
          notes: 'Priority order for key customer',
          createdBy: 'Production Manager',
          createdAt: '2024-01-10T10:00:00Z',
          updatedAt: '2024-01-17T14:30:00Z'
        },
        {
          _id: '2',
          moNumber: 'MO-2024-002',
          product: mockMaterials[1],
          bom: mockBOMs[1],
          quantity: 50,
          unit: 'ea',
          status: 'released',
          priority: 'medium',
          plannedStartDate: '2024-01-20',
          plannedEndDate: '2024-02-05',
          progress: 0,
          workOrders: [],
          materialRequirements: [],
          qualityChecks: [],
          createdBy: 'Production Manager',
          createdAt: '2024-01-12T09:00:00Z',
          updatedAt: '2024-01-12T09:00:00Z'
        },
        {
          _id: '3',
          moNumber: 'MO-2024-003',
          product: mockMaterials[0],
          bom: mockBOMs[0],
          quantity: 25,
          unit: 'ea',
          status: 'completed',
          priority: 'low',
          plannedStartDate: '2024-01-01',
          plannedEndDate: '2024-01-10',
          actualStartDate: '2024-01-01',
          actualEndDate: '2024-01-09',
          progress: 100,
          workOrders: [],
          materialRequirements: [],
          qualityChecks: [],
          createdBy: 'Production Manager',
          createdAt: '2024-01-01T08:00:00Z',
          updatedAt: '2024-01-09T17:00:00Z'
        }
      ];

      setMaterials(mockMaterials);
      setBOMs(mockBOMs);
      setOrders(mockOrders);
    } catch (err) {
      setError('Failed to fetch manufacturing orders data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (order?: ManufacturingOrder) => {
    if (order) {
      setSelectedOrder(order);
      setFormData({
        moNumber: order.moNumber,
        productId: order.product._id,
        bomId: order.bom._id,
        quantity: order.quantity,
  priority: "medium",
        plannedStartDate: order.plannedStartDate,
        plannedEndDate: order.plannedEndDate,
        notes: order.notes || ''
      });
      setIsEditing(true);
    } else {
      setSelectedOrder(null);
      setFormData({
        moNumber: `MO-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`,
        productId: '',
        bomId: '',
        quantity: 0,
        priority: 'medium',
        plannedStartDate: new Date().toISOString().split('T')[0],
        plannedEndDate: '',
        notes: ''
      });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
    setIsEditing(false);
  };

  const handleSubmit = async () => {
    try {
      const product = materials.find(m => m._id === formData.productId);
      const bom = boms.find(b => b._id === formData.bomId);
      if (!product || !bom) return;

      if (isEditing && selectedOrder) {
        // Update order
        const updatedOrder: ManufacturingOrder = {
          ...selectedOrder,
          ...formData,
          product,
          bom,
          updatedAt: new Date().toISOString()
        };
        setOrders(prev => prev.map(o => o._id === selectedOrder._id ? updatedOrder : o));
      } else {
        // Create new order
        const newOrder: ManufacturingOrder = {
          _id: Date.now().toString(),
          ...formData,
          product,
          bom,
          unit: product.unit,
          status: 'draft',
          progress: 0,
          workOrders: [],
          materialRequirements: [],
          qualityChecks: [],
          createdBy: 'Current User',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setOrders(prev => [...prev, newOrder]);
      }
      handleCloseDialog();
    } catch (err) {
      setError('Failed to save manufacturing order');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this manufacturing order?')) {
      setOrders(prev => prev.filter(o => o._id !== id));
    }
  };

  const handleStatusChange = async (id: string, newStatus: ManufacturingOrder['status']) => {
    setOrders(prev => prev.map(o => 
      o._id === id 
        ? { 
            ...o, 
            status: newStatus,
            actualStartDate: newStatus === 'in-progress' && !o.actualStartDate 
              ? new Date().toISOString().split('T')[0] 
              : o.actualStartDate,
            actualEndDate: newStatus === 'completed' 
              ? new Date().toISOString().split('T')[0] 
              : undefined,
            progress: newStatus === 'completed' ? 100 : o.progress,
            updatedAt: new Date().toISOString()
          }
        : o
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle />;
      case 'in-progress': return <PlayArrow />;
      case 'released': return <Assignment />;
      case 'on-hold': return <Pause />;
      case 'cancelled': return <Warning />;
      case 'draft': return <Edit />;
      default: return <Assignment />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const filteredOrders = orders.filter((order: ManufacturingOrder) => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || order.priority === filterPriority;
    const matchesSearch = searchTerm === '' || 
      order.moNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesPriority && matchesSearch;
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
          Manufacturing Orders
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Create MO
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Orders
                  </Typography>
                  <Typography variant="h4">
                    {orders.length}
                  </Typography>
                </Box>
                <Assignment color="primary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    In Progress
                  </Typography>
                  <Typography variant="h4">
                    {orders.filter(o => o.status === 'in-progress').length}
                  </Typography>
                </Box>
                <PlayArrow color="primary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Completed
                  </Typography>
                  <Typography variant="h4">
                    {orders.filter(o => o.status === 'completed').length}
                  </Typography>
                </Box>
                <CheckCircle color="success" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    On Hold
                  </Typography>
                  <Typography variant="h4">
                    {orders.filter(o => o.status === 'on-hold').length}
                  </Typography>
                </Box>
                <Pause color="warning" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    High Priority
                  </Typography>
                  <Typography variant="h4">
                    {orders.filter(o => o.priority === 'high' || o.priority === 'urgent').length}
                  </Typography>
                </Box>
                <Warning color="error" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                placeholder="Search MO, Product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Status"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="released">Released</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="on-hold">On Hold</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={filterPriority}
                  label="Priority"
                  onChange={(e) => setFilterPriority(e.target.value)}
                >
                  <MenuItem value="all">All Priority</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button variant="outlined" startIcon={<FilterList />} fullWidth>
                More Filters
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="outlined" startIcon={<Print />}>
                  Print
                </Button>
                <Button variant="outlined" startIcon={<GetApp />}>
                  Export
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Manufacturing Orders Table */}
      <Card>
        <CardContent>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>MO Number</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Planned Dates</TableCell>
                  <TableCell>Work Orders</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getStatusIcon(order.status)}
                        <Typography variant="body2" fontWeight="bold">
                          {order.moNumber}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {order.product.code}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {order.product.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {order.quantity} {order.unit}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value as ManufacturingOrder['status'])}
                        >
                          <MenuItem value="draft">Draft</MenuItem>
                          <MenuItem value="released">Released</MenuItem>
                          <MenuItem value="in-progress">In Progress</MenuItem>
                          <MenuItem value="completed">Completed</MenuItem>
                          <MenuItem value="on-hold">On Hold</MenuItem>
                          <MenuItem value="cancelled">Cancelled</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.priority}
                        color={getPriorityColor(order.priority) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" sx={{ mr: 1 }}>
                            {order.progress}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={order.progress} 
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(order.plannedStartDate).toLocaleDateString()} -
                      </Typography>
                      <Typography variant="body2">
                        {new Date(order.plannedEndDate).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Badge badgeContent={order.workOrders.length} color="primary">
                        <Build />
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleOpenDialog(order)}>
                        <Edit />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(order._id)}>
                        <Delete />
                      </IconButton>
                      <IconButton size="small">
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Create/Edit Manufacturing Order Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEditing ? 'Edit Manufacturing Order' : 'Create New Manufacturing Order'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="MO Number"
                value={formData.moNumber}
                onChange={(e) => setFormData({ ...formData, moNumber: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  label="Priority"
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                options={materials}
                getOptionLabel={(option) => `${option.code} - ${option.name}`}
                value={materials.find(m => m._id === formData.productId) || null}
                onChange={(_, newValue) => {
                  setFormData({ 
                    ...formData, 
                    productId: newValue?._id || '',
                    bomId: '' // Reset BOM when product changes
                  });
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Product" fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                options={boms.filter(b => b.product._id === formData.productId)}
                getOptionLabel={(option) => `${option.bomNumber} (v${option.version})`}
                value={boms.find(b => b._id === formData.bomId) || null}
                onChange={(_, newValue) => {
                  setFormData({ ...formData, bomId: newValue?._id || '' });
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Bill of Material" fullWidth />
                )}
                disabled={!formData.productId}
              />
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
                label="Unit"
                value={materials.find(m => m._id === formData.productId)?.unit || ''}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Planned Start Date"
                type="date"
                value={formData.plannedStartDate}
                onChange={(e) => setFormData({ ...formData, plannedStartDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Planned End Date"
                type="date"
                value={formData.plannedEndDate}
                onChange={(e) => setFormData({ ...formData, plannedEndDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!formData.productId || !formData.bomId || formData.quantity <= 0}
          >
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManufacturingOrdersPage;
