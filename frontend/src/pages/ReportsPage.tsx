import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  BarChart,
  PieChart,
  Timeline,
  Assessment,
  GetApp,
  Print,
  Share,
  Refresh,
  FilterList,
  DateRange,
  ExpandMore,
  Dashboard,
  Build,
  Inventory,
  Speed,
  Schedule,
  CheckCircle,
  Error,
  Warning,
  Analytics,
  InsertChart
} from '@mui/icons-material';

interface KPIData {
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
  color: string;
}

interface ChartData {
  name: string;
  value: number;
  color?: string;
}

interface ProductionMetrics {
  totalOrders: number;
  completedOrders: number;
  inProgressOrders: number;
  overdueOrders: number;
  averageLeadTime: number;
  onTimeDelivery: number;
  qualityRate: number;
  efficiency: number;
}

interface Report {
  _id: string;
  name: string;
  type: 'production' | 'inventory' | 'quality' | 'financial' | 'custom';
  description: string;
  createdBy: string;
  createdAt: string;
  lastRun?: string;
  parameters: any;
}

const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('last30days');
  const [kpiData, setKpiData] = useState<KPIData[]>([]);
  const [productionMetrics, setProductionMetrics] = useState<ProductionMetrics>({
    totalOrders: 0,
    completedOrders: 0,
    inProgressOrders: 0,
    overdueOrders: 0,
    averageLeadTime: 0,
    onTimeDelivery: 0,
    qualityRate: 0,
    efficiency: 0
  });
  const [reports, setReports] = useState<Report[]>([]);
  const [productionTrend, setProductionTrend] = useState<ChartData[]>([]);
  const [workCenterUtilization, setWorkCenterUtilization] = useState<ChartData[]>([]);
  const [qualityMetrics, setQualityMetrics] = useState<ChartData[]>([]);

  // Form state for custom reports
  const [reportForm, setReportForm] = useState({
    name: '',
    type: 'production' as const,
    description: '',
    dateFrom: '',
    dateTo: '',
    includeMetrics: [] as string[]
  });

  useEffect(() => {
    fetchData();
  }, [selectedDateRange]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Mock KPI data
      const mockKPIs: KPIData[] = [
        {
          title: 'Total Production',
          value: '2,485 units',
          change: 12.5,
          changeType: 'increase',
          icon: <Build />,
          color: '#1976d2'
        },
        {
          title: 'On-Time Delivery',
          value: '94.2%',
          change: 2.1,
          changeType: 'increase',
          icon: <Schedule />,
          color: '#2e7d32'
        },
        {
          title: 'Quality Rate',
          value: '98.7%',
          change: -0.5,
          changeType: 'decrease',
          icon: <CheckCircle />,
          color: '#ed6c02'
        },
        {
          title: 'Overall Efficiency',
          value: '87.3%',
          change: 5.2,
          changeType: 'increase',
          icon: <Speed />,
          color: '#9c27b0'
        },
        {
          title: 'Active Work Orders',
          value: 47,
          change: -8,
          changeType: 'decrease',
          icon: <Assessment />,
          color: '#d32f2f'
        },
        {
          title: 'Inventory Turnover',
          value: '4.2x',
          change: 0.8,
          changeType: 'increase',
          icon: <Inventory />,
          color: '#0288d1'
        }
      ];

      // Mock production metrics
      const mockMetrics: ProductionMetrics = {
        totalOrders: 156,
        completedOrders: 128,
        inProgressOrders: 23,
        overdueOrders: 5,
        averageLeadTime: 8.5,
        onTimeDelivery: 94.2,
        qualityRate: 98.7,
        efficiency: 87.3
      };

      // Mock production trend data
      const mockProductionTrend: ChartData[] = [
        { name: 'Week 1', value: 420 },
        { name: 'Week 2', value: 485 },
        { name: 'Week 3', value: 398 },
        { name: 'Week 4', value: 512 },
        { name: 'Week 5', value: 456 },
        { name: 'Week 6', value: 523 },
        { name: 'Week 7', value: 478 }
      ];

      // Mock work center utilization
      const mockUtilization: ChartData[] = [
        { name: 'Machining Center 1', value: 85, color: '#1976d2' },
        { name: 'Assembly Line A', value: 92, color: '#2e7d32' },
        { name: 'Quality Control', value: 78, color: '#ed6c02' },
        { name: 'Welding Station 1', value: 89, color: '#9c27b0' },
        { name: 'Packaging Line', value: 94, color: '#d32f2f' }
      ];

      // Mock quality metrics
      const mockQuality: ChartData[] = [
        { name: 'Passed', value: 987, color: '#2e7d32' },
        { name: 'Failed', value: 13, color: '#d32f2f' },
        { name: 'Rework', value: 25, color: '#ed6c02' }
      ];

      // Mock reports
      const mockReports: Report[] = [
        {
          _id: '1',
          name: 'Daily Production Summary',
          type: 'production',
          description: 'Daily overview of production metrics and KPIs',
          createdBy: 'Production Manager',
          createdAt: '2025-09-01T10:00:00Z',
          lastRun: '2025-09-20T08:00:00Z',
          parameters: { frequency: 'daily', metrics: ['production', 'efficiency'] }
        },
        {
          _id: '2',
          name: 'Weekly Quality Report',
          type: 'quality',
          description: 'Comprehensive quality metrics and defect analysis',
          createdBy: 'Quality Manager',
          createdAt: '2025-08-15T14:30:00Z',
          lastRun: '2025-09-19T17:00:00Z',
          parameters: { frequency: 'weekly', metrics: ['quality', 'defects'] }
        },
        {
          _id: '3',
          name: 'Monthly Inventory Analysis',
          type: 'inventory',
          description: 'Stock levels, turnover rates, and reorder analysis',
          createdBy: 'Inventory Manager',
          createdAt: '2025-08-01T09:00:00Z',
          lastRun: '2025-09-01T00:00:00Z',
          parameters: { frequency: 'monthly', metrics: ['inventory', 'turnover'] }
        },
        {
          _id: '4',
          name: 'Work Center Performance',
          type: 'production',
          description: 'Utilization and efficiency metrics by work center',
          createdBy: 'Operations Manager',
          createdAt: '2025-07-20T11:15:00Z',
          lastRun: '2025-09-20T06:00:00Z',
          parameters: { frequency: 'weekly', metrics: ['utilization', 'efficiency'] }
        }
      ];

      setKpiData(mockKPIs);
      setProductionMetrics(mockMetrics);
      setProductionTrend(mockProductionTrend);
      setWorkCenterUtilization(mockUtilization);
      setQualityMetrics(mockQuality);
      setReports(mockReports);
    } catch (err) {
      setError('Failed to fetch reports data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReportDialog = () => {
    setReportForm({
      name: '',
      type: 'production',
      description: '',
      dateFrom: '',
      dateTo: '',
      includeMetrics: []
    });
    setOpenReportDialog(true);
  };

  const handleCloseReportDialog = () => {
    setOpenReportDialog(false);
  };

  const handleCreateReport = () => {
    const newReport: Report = {
      _id: Date.now().toString(),
      ...reportForm,
      createdBy: 'Current User',
      createdAt: new Date().toISOString(),
      parameters: {
        dateFrom: reportForm.dateFrom,
        dateTo: reportForm.dateTo,
        metrics: reportForm.includeMetrics
      }
    };
    setReports(prev => [...prev, newReport]);
    handleCloseReportDialog();
  };

  const handleRunReport = (reportId: string) => {
    setReports(prev => prev.map(report => 
      report._id === reportId 
        ? { ...report, lastRun: new Date().toISOString() }
        : report
    ));
    // In a real app, this would generate and display the report
    alert('Report generated successfully!');
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'production': return 'primary';
      case 'quality': return 'success';
      case 'inventory': return 'warning';
      case 'financial': return 'info';
      case 'custom': return 'secondary';
      default: return 'default';
    }
  };

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
          Reports & Analytics
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Date Range</InputLabel>
            <Select
              value={selectedDateRange}
              label="Date Range"
              onChange={(e) => setSelectedDateRange(e.target.value)}
            >
              <MenuItem value="last7days">Last 7 Days</MenuItem>
              <MenuItem value="last30days">Last 30 Days</MenuItem>
              <MenuItem value="last3months">Last 3 Months</MenuItem>
              <MenuItem value="lastyear">Last Year</MenuItem>
              <MenuItem value="custom">Custom Range</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<Analytics />}
            onClick={handleOpenReportDialog}
          >
            Create Report
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Dashboard" />
          <Tab label="Production Analytics" />
          <Tab label="Quality Metrics" />
          <Tab label="Saved Reports" />
          <Tab label="Custom Reports" />
        </Tabs>
      </Card>

      {/* Dashboard Tab */}
      {activeTab === 0 && (
        <Box>
          {/* KPI Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {kpiData.map((kpi, index) => (
              <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ color: kpi.color }}>
                        {kpi.icon}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {kpi.changeType === 'increase' ? (
                          <TrendingUp sx={{ color: 'success.main', fontSize: 16 }} />
                        ) : (
                          <TrendingDown sx={{ color: 'error.main', fontSize: 16 }} />
                        )}
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: kpi.changeType === 'increase' ? 'success.main' : 'error.main',
                            fontWeight: 'bold'
                          }}
                        >
                          {kpi.change > 0 ? '+' : ''}{kpi.change}%
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                      {kpi.value}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {kpi.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Production Overview */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Production Trend (Last 7 Weeks)
                  </Typography>
                  <Box sx={{ height: 300, display: 'flex', alignItems: 'end', gap: 2, p: 2 }}>
                    {productionTrend.map((data, index) => (
                      <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                        <Box
                          sx={{
                            width: '100%',
                            height: `${(data.value / 600) * 100}%`,
                            backgroundColor: '#1976d2',
                            borderRadius: 1,
                            mb: 1,
                            minHeight: 20
                          }}
                        />
                        <Typography variant="caption" textAlign="center">
                          {data.name}
                        </Typography>
                        <Typography variant="caption" fontWeight="bold">
                          {data.value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Order Status
                  </Typography>
                  <Box sx={{ mt: 3 }}>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Completed</Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {productionMetrics.completedOrders}/{productionMetrics.totalOrders}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={(productionMetrics.completedOrders / productionMetrics.totalOrders) * 100}
                        sx={{ height: 8, borderRadius: 4 }}
                        color="success"
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">In Progress</Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {productionMetrics.inProgressOrders}/{productionMetrics.totalOrders}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={(productionMetrics.inProgressOrders / productionMetrics.totalOrders) * 100}
                        sx={{ height: 8, borderRadius: 4 }}
                        color="primary"
                      />
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Overdue</Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {productionMetrics.overdueOrders}/{productionMetrics.totalOrders}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={(productionMetrics.overdueOrders / productionMetrics.totalOrders) * 100}
                        sx={{ height: 8, borderRadius: 4 }}
                        color="error"
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Work Center Utilization */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Work Center Utilization
              </Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {workCenterUtilization.map((center, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                      <Typography variant="body2" fontWeight="bold" gutterBottom>
                        {center.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={center.value}
                          sx={{ 
                            flex: 1, 
                            height: 8, 
                            borderRadius: 4,
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: center.color
                            }
                          }}
                        />
                        <Typography variant="body2" fontWeight="bold">
                          {center.value}%
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Production Analytics Tab */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Production Efficiency Trends
                </Typography>
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="textSecondary">
                    Interactive chart showing efficiency trends over time
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Lead Time Analysis
                </Typography>
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="textSecondary">
                    Average lead time: {productionMetrics.averageLeadTime} days
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Detailed Production Metrics
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Metric</TableCell>
                        <TableCell>Current Period</TableCell>
                        <TableCell>Previous Period</TableCell>
                        <TableCell>Change</TableCell>
                        <TableCell>Target</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>On-Time Delivery</TableCell>
                        <TableCell>94.2%</TableCell>
                        <TableCell>92.1%</TableCell>
                        <TableCell>+2.1%</TableCell>
                        <TableCell>95%</TableCell>
                        <TableCell>
                          <Chip label="Good" color="warning" size="small" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Quality Rate</TableCell>
                        <TableCell>98.7%</TableCell>
                        <TableCell>99.2%</TableCell>
                        <TableCell>-0.5%</TableCell>
                        <TableCell>99%</TableCell>
                        <TableCell>
                          <Chip label="Below Target" color="error" size="small" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Efficiency</TableCell>
                        <TableCell>87.3%</TableCell>
                        <TableCell>82.1%</TableCell>
                        <TableCell>+5.2%</TableCell>
                        <TableCell>85%</TableCell>
                        <TableCell>
                          <Chip label="Excellent" color="success" size="small" />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Quality Metrics Tab */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quality Distribution
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
                  {qualityMetrics.map((metric, index) => (
                    <Box key={index}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">{metric.name}</Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {metric.value}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={(metric.value / 1025) * 100}
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: metric.color
                          }
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quality Trends
                </Typography>
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="textSecondary">
                    Quality trend analysis chart would be displayed here
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Defect Analysis
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Defect Type</TableCell>
                        <TableCell>Occurrences</TableCell>
                        <TableCell>Work Center</TableCell>
                        <TableCell>Root Cause</TableCell>
                        <TableCell>Action Taken</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Surface Finish</TableCell>
                        <TableCell>8</TableCell>
                        <TableCell>Machining Center 1</TableCell>
                        <TableCell>Tool wear</TableCell>
                        <TableCell>Tool replacement</TableCell>
                        <TableCell>
                          <Chip label="Resolved" color="success" size="small" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Dimensional</TableCell>
                        <TableCell>3</TableCell>
                        <TableCell>Assembly Line A</TableCell>
                        <TableCell>Setup error</TableCell>
                        <TableCell>Process update</TableCell>
                        <TableCell>
                          <Chip label="In Progress" color="warning" size="small" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Material</TableCell>
                        <TableCell>2</TableCell>
                        <TableCell>Quality Control</TableCell>
                        <TableCell>Supplier issue</TableCell>
                        <TableCell>Supplier audit</TableCell>
                        <TableCell>
                          <Chip label="Pending" color="error" size="small" />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Saved Reports Tab */}
      {activeTab === 3 && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Saved Reports
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={() => fetchData()}
              >
                Refresh
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Report Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Created By</TableCell>
                    <TableCell>Last Run</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report._id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {report.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={report.type} 
                          color={getReportTypeColor(report.type) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {report.description}
                        </Typography>
                      </TableCell>
                      <TableCell>{report.createdBy}</TableCell>
                      <TableCell>
                        {report.lastRun ? new Date(report.lastRun).toLocaleDateString() : 'Never'}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Run Report">
                            <IconButton 
                              size="small" 
                              onClick={() => handleRunReport(report._id)}
                            >
                              <InsertChart />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download">
                            <IconButton size="small">
                              <GetApp />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Print">
                            <IconButton size="small">
                              <Print />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Share">
                            <IconButton size="small">
                              <Share />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Custom Reports Tab */}
      {activeTab === 4 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Report Builder
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Create custom reports by selecting metrics, date ranges, and filters.
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography>Production Reports</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                      <ListItem>
                        <ListItemIcon><BarChart /></ListItemIcon>
                        <ListItemText 
                          primary="Production Volume Report"
                          secondary="Output quantities by period and work center"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><Timeline /></ListItemIcon>
                        <ListItemText 
                          primary="Efficiency Analysis"
                          secondary="Performance metrics and trends"
                        />
                      </ListItem>
                    </List>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography>Quality Reports</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                      <ListItem>
                        <ListItemIcon><CheckCircle /></ListItemIcon>
                        <ListItemText 
                          primary="Quality Dashboard"
                          secondary="Pass rates, defects, and rework analysis"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><Warning /></ListItemIcon>
                        <ListItemText 
                          primary="Non-Conformance Report"
                          secondary="Track and analyze quality issues"
                        />
                      </ListItem>
                    </List>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography>Inventory Reports</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                      <ListItem>
                        <ListItemIcon><Inventory /></ListItemIcon>
                        <ListItemText 
                          primary="Stock Analysis"
                          secondary="Current levels, turnover, and reorder points"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><TrendingUp /></ListItemIcon>
                        <ListItemText 
                          primary="Consumption Trends"
                          secondary="Material usage patterns and forecasting"
                        />
                      </ListItem>
                    </List>
                  </AccordionDetails>
                </Accordion>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Quick Report Templates
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button variant="outlined" startIcon={<Dashboard />}>
                    Executive Summary
                  </Button>
                  <Button variant="outlined" startIcon={<Assessment />}>
                    Operations Review
                  </Button>
                  <Button variant="outlined" startIcon={<PieChart />}>
                    Cost Analysis
                  </Button>
                  <Button variant="outlined" startIcon={<Speed />}>
                    Performance Metrics
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Create Report Dialog */}
      <Dialog open={openReportDialog} onClose={handleCloseReportDialog} maxWidth="md" fullWidth>
        <DialogTitle>Create Custom Report</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Report Name"
                value={reportForm.name}
                onChange={(e) => setReportForm({ ...reportForm, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={reportForm.type}
                  label="Report Type"
                  onChange={(e) => setReportForm({ ...reportForm, type: e.target.value as any })}
                >
                  <MenuItem value="production">Production</MenuItem>
                  <MenuItem value="quality">Quality</MenuItem>
                  <MenuItem value="inventory">Inventory</MenuItem>
                  <MenuItem value="financial">Financial</MenuItem>
                  <MenuItem value="custom">Custom</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={reportForm.description}
                onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date From"
                type="date"
                value={reportForm.dateFrom}
                onChange={(e) => setReportForm({ ...reportForm, dateFrom: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date To"
                type="date"
                value={reportForm.dateTo}
                onChange={(e) => setReportForm({ ...reportForm, dateTo: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReportDialog}>Cancel</Button>
          <Button 
            onClick={handleCreateReport} 
            variant="contained"
            disabled={!reportForm.name || !reportForm.type}
          >
            Create Report
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportsPage;
