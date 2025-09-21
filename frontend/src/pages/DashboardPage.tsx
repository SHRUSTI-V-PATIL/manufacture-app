import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  IconButton,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Inventory,
  Assignment,
  Build,
  CheckCircle,
  FilterList,
  Refresh,
  Search
} from '@mui/icons-material';
import dashboardService, { DashboardKPIs, RecentActivity } from '../services/dashboardService';

interface KPICardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  subtitle?: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, icon, trend, subtitle }) => {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp color="success" />;
    if (trend === 'down') return <TrendingDown color="error" />;
    return null;
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {icon}
            {getTrendIcon()}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const DashboardPage: React.FC = () => {
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [activities, setActivities] = useState<RecentActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtering states
  const [activeTab, setActiveTab] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [filteredWorkOrders, setFilteredWorkOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [kpisData, activitiesData] = await Promise.all([
          dashboardService.getKPIs(),
          dashboardService.getRecentActivities()
        ]);

        setKpis(kpisData);
        setActivities(activitiesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Apply filters whenever activities or filter states change
  useEffect(() => {
    if (activities) {
      applyFilters();
    }
  }, [activities, statusFilter, searchTerm]);

  const applyFilters = () => {
    if (!activities) return;

    // Filter manufacturing orders
    let filteredMfgOrders = activities.recentManufacturingOrders || [];

    if (statusFilter !== 'all') {
      filteredMfgOrders = filteredMfgOrders.filter((order: any) =>
        order.status === statusFilter
      );
    }

    if (searchTerm) {
      filteredMfgOrders = filteredMfgOrders.filter((order: any) =>
        order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.product?.code?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter work orders
    let filteredWoOrders = activities.recentWorkOrders || [];

    if (statusFilter !== 'all') {
      filteredWoOrders = filteredWoOrders.filter((wo: any) =>
        wo.status === statusFilter
      );
    }

    if (searchTerm) {
      filteredWoOrders = filteredWoOrders.filter((wo: any) =>
        wo.workOrderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wo.workCenter?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filteredMfgOrders);
    setFilteredWorkOrders(filteredWoOrders);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getStatusChip = (status: string) => {
    const statusColors: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
      'completed': 'success',
      'in-progress': 'warning',
      'pending': 'info',
      'cancelled': 'error',
      'draft': 'default',
      'planned': 'info',
      'started': 'warning',
      'paused': 'warning',
      'on-hold': 'warning'
    };

    return (
      <Chip 
        label={status.charAt(0).toUpperCase() + status.slice(1)} 
        color={statusColors[status] || 'default'}
        size="small"
      />
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Manufacturing Dashboard
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={handleRefresh}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Active Orders"
            value={kpis?.manufacturingOrders.inProgress || 0}
            icon={<Assignment color="primary" />}
            trend="up"
            subtitle="In Progress"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Work Orders"
            value={kpis?.workOrders.total || 0}
            icon={<Build color="secondary" />}
            trend="neutral"
            subtitle="Total Work Orders"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Materials"
            value={kpis?.materials.totalMaterials || 0}
            icon={<Inventory color="info" />}
            trend="up"
            subtitle="Available Items"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Completed"
            value={kpis?.manufacturingOrders.completed || 0}
            icon={<CheckCircle color="success" />}
            trend="up"
            subtitle="Orders Finished"
          />
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                placeholder="Search orders, products, work centers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status Filter"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="planned">Planned</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="completed">Done</MenuItem>
                  <MenuItem value="cancelled">Canceled</MenuItem>
                  <MenuItem value="on-hold">On Hold</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                fullWidth
                onClick={() => {
                  setStatusFilter('all');
                  setSearchTerm('');
                }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Manufacturing Orders
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Order Number</TableCell>
                      <TableCell>Product</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Priority</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredOrders && filteredOrders.length > 0 ? (
                      filteredOrders.slice(0, 5).map((order: any) => (
                        <TableRow key={order._id}>
                          <TableCell>{order.orderNumber || order.moNumber}</TableCell>
                          <TableCell>{order.product?.name || 'N/A'}</TableCell>
                          <TableCell>
                            {getStatusChip(order.status)}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={order.priority || 'medium'}
                              size="small"
                              color={order.priority === 'high' || order.priority === 'urgent' ? 'error' : order.priority === 'medium' ? 'warning' : 'default'}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Typography variant="body2" color="textSecondary">
                            {statusFilter !== 'all' || searchTerm ?
                              'No orders match the current filters' :
                              'No recent manufacturing orders found'
                            }
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Work Orders
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Work Order</TableCell>
                      <TableCell>Work Center</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Progress</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredWorkOrders && filteredWorkOrders.length > 0 ? (
                      filteredWorkOrders.slice(0, 5).map((workOrder: any) => (
                        <TableRow key={workOrder._id}>
                          <TableCell>{workOrder.workOrderNumber || workOrder.woNumber}</TableCell>
                          <TableCell>{workOrder.workCenter?.name || 'N/A'}</TableCell>
                          <TableCell>
                            {getStatusChip(workOrder.status)}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {workOrder.completedQuantity || workOrder.progress || 0}% / 100%
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Typography variant="body2" color="textSecondary">
                            {statusFilter !== 'all' || searchTerm ?
                              'No work orders match the current filters' :
                              'No recent work orders found'
                            }
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
