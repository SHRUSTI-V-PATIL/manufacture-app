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
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Timer,
  Checkbox,
  FormControlLabel,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Avatar
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  PlayArrow,
  Pause,
  Stop,
  CheckCircle,
  Error,
  Warning,
  Schedule,
  Assignment,
  Build,
  Person,
  AccessTime,
  ExpandMore,
  Timeline,
  QualityControl,
  Inventory,
  Notes,
  Print,
  GetApp,
  Start,
  Done
} from '@mui/icons-material';

interface WorkCenter {
  _id: string;
  code: string;
  name: string;
  department: string;
}

interface Operator {
  _id: string;
  name: string;
  employeeId: string;
  skills: string[];
}

interface QualityCheck {
  _id: string;
  parameter: string;
  specification: string;
  measuredValue?: string;
  status: 'pending' | 'passed' | 'failed';
  notes?: string;
  checkedBy?: string;
  checkedAt?: string;
}

interface MaterialConsumption {
  _id: string;
  materialCode: string;
  materialName: string;
  plannedQuantity: number;
  actualQuantity: number;
  unit: string;
  variance: number;
}

interface TimeEntry {
  _id: string;
  operator: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  activity: string;
  notes?: string;
}

interface WorkInstruction {
  _id: string;
  stepNumber: number;
  title: string;
  description: string;
  estimatedTime: number;
  tools: string[];
  safetyNotes?: string;
  isCompleted: boolean;
  completedBy?: string;
  completedAt?: string;
}

interface WorkOrder {
  _id: string;
  woNumber: string;
  moNumber: string;
  productCode: string;
  productName: string;
  workCenter: WorkCenter;
  operation: string;
  quantity: number;
  unit: string;
  status: 'pending' | 'in-progress' | 'completed' | 'on-hold' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  plannedStartTime: string;
  plannedEndTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  estimatedDuration: number;
  actualDuration?: number;
  assignedOperators: Operator[];
  progress: number;
  workInstructions: WorkInstruction[];
  qualityChecks: QualityCheck[];
  materialConsumption: MaterialConsumption[];
  timeEntries: TimeEntry[];
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

const WorkOrdersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [workCenters, setWorkCenters] = useState<WorkCenter[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTimers, setActiveTimers] = useState<{ [key: string]: number }>({});

  // Form state
  const [formData, setFormData] = useState({
    woNumber: '',
    moNumber: '',
    productCode: '',
    productName: '',
    workCenterId: '',
    operation: '',
    quantity: 0,
    priority: 'medium' as const,
    plannedStartTime: '',
    plannedEndTime: '',
    estimatedDuration: 0,
    assignedOperatorIds: [] as string[],
    notes: ''
  });

  useEffect(() => {
    fetchData();
    // Update active timers every second
    const interval = setInterval(() => {
      setActiveTimers(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(woId => {
          updated[woId] += 1;
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Mock work centers
      const mockWorkCenters: WorkCenter[] = [
        { _id: '1', code: 'MC-001', name: 'Machining Center 1', department: 'Machining' },
        { _id: '2', code: 'AS-001', name: 'Assembly Line A', department: 'Assembly' },
        { _id: '3', code: 'QC-001', name: 'Quality Control', department: 'Quality' },
        { _id: '4', code: 'WD-001', name: 'Welding Station 1', department: 'Welding' }
      ];

      // Mock operators
      const mockOperators: Operator[] = [
        { _id: '1', name: 'John Smith', employeeId: 'EMP-001', skills: ['machining', 'setup'] },
        { _id: '2', name: 'Jane Doe', employeeId: 'EMP-002', skills: ['assembly', 'quality'] },
        { _id: '3', name: 'Mike Johnson', employeeId: 'EMP-003', skills: ['welding', 'finishing'] },
        { _id: '4', name: 'Sarah Wilson', employeeId: 'EMP-004', skills: ['quality', 'inspection'] }
      ];

      // Mock work orders with comprehensive data
      const mockWorkOrders: WorkOrder[] = [
        {
          _id: '1',
          woNumber: 'WO-2025-001',
          moNumber: 'MO-2025-001',
          productCode: 'PRD-001',
          productName: 'Finished Product A',
          workCenter: mockWorkCenters[0],
          operation: 'Roughing',
          quantity: 100,
          unit: 'ea',
          status: 'in-progress',
          priority: 'high',
          plannedStartTime: '2025-09-20T08:00:00Z',
          plannedEndTime: '2025-09-20T16:00:00Z',
          actualStartTime: '2025-09-20T08:15:00Z',
          estimatedDuration: 480, // minutes
          actualDuration: 320,
          assignedOperators: [mockOperators[0]],
          progress: 75,
          workInstructions: [
            {
              _id: '1',
              stepNumber: 1,
              title: 'Setup Machine',
              description: 'Mount workpiece and set cutting parameters',
              estimatedTime: 60,
              tools: ['Chuck', 'Cutting Tools', 'Measuring Tools'],
              safetyNotes: 'Ensure proper PPE is worn',
              isCompleted: true,
              completedBy: 'John Smith',
              completedAt: '2025-09-20T08:30:00Z'
            },
            {
              _id: '2',
              stepNumber: 2,
              title: 'Rough Machining',
              description: 'Perform rough cutting operation',
              estimatedTime: 300,
              tools: ['Rough Cutting Tool'],
              isCompleted: true,
              completedBy: 'John Smith',
              completedAt: '2025-09-20T13:30:00Z'
            },
            {
              _id: '3',
              stepNumber: 3,
              title: 'Quality Check',
              description: 'Measure dimensions and check tolerances',
              estimatedTime: 30,
              tools: ['Calipers', 'Micrometers'],
              isCompleted: false
            }
          ],
          qualityChecks: [
            {
              _id: '1',
              parameter: 'Diameter',
              specification: '25.0 ± 0.1 mm',
              measuredValue: '25.05',
              status: 'passed',
              checkedBy: 'Sarah Wilson',
              checkedAt: '2025-09-20T14:00:00Z'
            },
            {
              _id: '2',
              parameter: 'Surface Roughness',
              specification: 'Ra < 3.2 μm',
              status: 'pending'
            }
          ],
          materialConsumption: [
            {
              _id: '1',
              materialCode: 'STL-001',
              materialName: 'Steel Bar 30mm',
              plannedQuantity: 250,
              actualQuantity: 255,
              unit: 'kg',
              variance: 5
            }
          ],
          timeEntries: [
            {
              _id: '1',
              operator: 'John Smith',
              startTime: '2025-09-20T08:15:00Z',
              endTime: '2025-09-20T13:30:00Z',
              duration: 315,
              activity: 'Machining Operation'
            }
          ],
          notes: 'Priority order - expedite processing',
          createdBy: 'Production Manager',
          createdAt: '2025-09-19T10:00:00Z',
          updatedAt: '2025-09-20T14:00:00Z'
        },
        {
          _id: '2',
          woNumber: 'WO-2025-002',
          moNumber: 'MO-2025-001',
          productCode: 'PRD-001',
          productName: 'Finished Product A',
          workCenter: mockWorkCenters[1],
          operation: 'Assembly',
          quantity: 100,
          unit: 'ea',
          status: 'pending',
          priority: 'medium',
          plannedStartTime: '2025-09-21T08:00:00Z',
          plannedEndTime: '2025-09-21T17:00:00Z',
          estimatedDuration: 540,
          assignedOperators: [mockOperators[1]],
          progress: 0,
          workInstructions: [],
          qualityChecks: [],
          materialConsumption: [],
          timeEntries: [],
          createdBy: 'Production Manager',
          createdAt: '2025-09-19T10:00:00Z',
          updatedAt: '2025-09-19T10:00:00Z'
        }
      ];

      setWorkCenters(mockWorkCenters);
      setOperators(mockOperators);
      setWorkOrders(mockWorkOrders);
    } catch (err) {
      setError('Failed to fetch work orders data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (workOrder?: WorkOrder) => {
    if (workOrder) {
      setSelectedWorkOrder(workOrder);
      setFormData({
        woNumber: workOrder.woNumber,
        moNumber: workOrder.moNumber,
        productCode: workOrder.productCode,
        productName: workOrder.productName,
        workCenterId: workOrder.workCenter._id,
        operation: workOrder.operation,
        quantity: workOrder.quantity,
        priority: workOrder.priority,
        plannedStartTime: workOrder.plannedStartTime.split('T')[0] + 'T' + workOrder.plannedStartTime.split('T')[1].substring(0, 5),
        plannedEndTime: workOrder.plannedEndTime.split('T')[0] + 'T' + workOrder.plannedEndTime.split('T')[1].substring(0, 5),
        estimatedDuration: workOrder.estimatedDuration,
        assignedOperatorIds: workOrder.assignedOperators.map(op => op._id),
        notes: workOrder.notes || ''
      });
      setIsEditing(true);
    } else {
      setSelectedWorkOrder(null);
      setFormData({
        woNumber: `WO-${new Date().getFullYear()}-${String(workOrders.length + 1).padStart(3, '0')}`,
        moNumber: '',
        productCode: '',
        productName: '',
        workCenterId: '',
        operation: '',
        quantity: 0,
        priority: 'medium',
        plannedStartTime: '',
        plannedEndTime: '',
        estimatedDuration: 0,
        assignedOperatorIds: [],
        notes: ''
      });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedWorkOrder(null);
    setIsEditing(false);
  };

  const handleStartWork = (workOrderId: string) => {
    const currentTime = new Date().toISOString();
    setWorkOrders(prev => prev.map(wo => 
      wo._id === workOrderId 
        ? { 
            ...wo, 
            status: 'in-progress',
            actualStartTime: currentTime,
            updatedAt: currentTime
          }
        : wo
    ));
    setActiveTimers(prev => ({ ...prev, [workOrderId]: 0 }));
  };

  const handlePauseWork = (workOrderId: string) => {
    setWorkOrders(prev => prev.map(wo => 
      wo._id === workOrderId 
        ? { 
            ...wo, 
            status: 'on-hold',
            updatedAt: new Date().toISOString()
          }
        : wo
    ));
    setActiveTimers(prev => {
      const updated = { ...prev };
      delete updated[workOrderId];
      return updated;
    });
  };

  const handleCompleteWork = (workOrderId: string) => {
    const currentTime = new Date().toISOString();
    setWorkOrders(prev => prev.map(wo => 
      wo._id === workOrderId 
        ? { 
            ...wo, 
            status: 'completed',
            actualEndTime: currentTime,
            progress: 100,
            updatedAt: currentTime
          }
        : wo
    ));
    setActiveTimers(prev => {
      const updated = { ...prev };
      delete updated[workOrderId];
      return updated;
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatTimer = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'primary';
      case 'pending': return 'warning';
      case 'on-hold': return 'info';
      case 'cancelled': return 'error';
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
          Work Orders
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Create Work Order
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
                    Total Work Orders
                  </Typography>
                  <Typography variant="h4">
                    {workOrders.length}
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
                    {workOrders.filter(wo => wo.status === 'in-progress').length}
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
                    Completed Today
                  </Typography>
                  <Typography variant="h4">
                    {workOrders.filter(wo => wo.status === 'completed' && 
                      new Date(wo.updatedAt).toDateString() === new Date().toDateString()).length}
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
                    {workOrders.filter(wo => wo.status === 'on-hold').length}
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
                    Avg Efficiency
                  </Typography>
                  <Typography variant="h4">
                    92%
                  </Typography>
                </Box>
                <Timeline color="info" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Active Work Orders" />
          <Tab label="Work Instructions" />
          <Tab label="Quality Control" />
          <Tab label="Time Tracking" />
        </Tabs>

        <CardContent>
          {activeTab === 0 && (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>WO Number</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Work Center</TableCell>
                    <TableCell>Operator</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Progress</TableCell>
                    <TableCell>Timer</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {workOrders.map((workOrder) => (
                    <TableRow key={workOrder._id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {workOrder.woNumber}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {workOrder.operation}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {workOrder.productCode}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {workOrder.quantity} {workOrder.unit}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {workOrder.workCenter.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {workOrder.workCenter.department}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {workOrder.assignedOperators.map(op => (
                          <Box key={op._id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 24, height: 24, fontSize: '0.8rem' }}>
                              {op.name.split(' ').map(n => n[0]).join('')}
                            </Avatar>
                            <Typography variant="body2">{op.name}</Typography>
                          </Box>
                        ))}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={workOrder.status}
                          color={getStatusColor(workOrder.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ width: '100%' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body2" sx={{ mr: 1 }}>
                              {workOrder.progress}%
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={workOrder.progress} 
                            sx={{ height: 6, borderRadius: 3 }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        {activeTimers[workOrder._id] !== undefined ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTime color="primary" />
                            <Typography variant="body2" fontWeight="bold" color="primary">
                              {formatTimer(activeTimers[workOrder._id])}
                            </Typography>
                          </Box>
                        ) : workOrder.actualDuration ? (
                          <Typography variant="body2">
                            {formatDuration(workOrder.actualDuration)}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            Not started
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={workOrder.priority}
                          color={workOrder.priority === 'urgent' ? 'error' : 
                                 workOrder.priority === 'high' ? 'warning' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {workOrder.status === 'pending' && (
                            <IconButton 
                              size="small" 
                              onClick={() => handleStartWork(workOrder._id)}
                              color="primary"
                            >
                              <PlayArrow />
                            </IconButton>
                          )}
                          {workOrder.status === 'in-progress' && (
                            <>
                              <IconButton 
                                size="small" 
                                onClick={() => handlePauseWork(workOrder._id)}
                                color="warning"
                              >
                                <Pause />
                              </IconButton>
                              <IconButton 
                                size="small" 
                                onClick={() => handleCompleteWork(workOrder._id)}
                                color="success"
                              >
                                <CheckCircle />
                              </IconButton>
                            </>
                          )}
                          <IconButton size="small" onClick={() => handleOpenDialog(workOrder)}>
                            <Edit />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {activeTab === 1 && selectedWorkOrder && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Work Instructions - {selectedWorkOrder.woNumber}
              </Typography>
              <Stepper orientation="vertical">
                {selectedWorkOrder.workInstructions.map((instruction) => (
                  <Step key={instruction._id} active={!instruction.isCompleted}>
                    <StepLabel
                      optional={
                        <Typography variant="caption">
                          Est. {instruction.estimatedTime} min
                        </Typography>
                      }
                      StepIconComponent={() => (
                        instruction.isCompleted ? 
                          <CheckCircle color="success" /> : 
                          <Schedule color="action" />
                      )}
                    >
                      {instruction.title}
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body2" paragraph>
                        {instruction.description}
                      </Typography>
                      {instruction.tools.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" fontWeight="bold">Tools Required:</Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                            {instruction.tools.map((tool, index) => (
                              <Chip key={index} label={tool} size="small" />
                            ))}
                          </Box>
                        </Box>
                      )}
                      {instruction.safetyNotes && (
                        <Alert severity="warning" sx={{ mb: 2 }}>
                          <Typography variant="body2">
                            <strong>Safety:</strong> {instruction.safetyNotes}
                          </Typography>
                        </Alert>
                      )}
                      {instruction.isCompleted ? (
                        <Typography variant="body2" color="success.main">
                          ✓ Completed by {instruction.completedBy} at {new Date(instruction.completedAt!).toLocaleString()}
                        </Typography>
                      ) : (
                        <Button variant="contained" size="small" startIcon={<Done />}>
                          Mark Complete
                        </Button>
                      )}
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </Box>
          )}

          {activeTab === 2 && selectedWorkOrder && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Quality Control - {selectedWorkOrder.woNumber}
              </Typography>
              <Grid container spacing={3}>
                {selectedWorkOrder.qualityChecks.map((check) => (
                  <Grid item xs={12} md={6} key={check._id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6">{check.parameter}</Typography>
                          <Chip
                            label={check.status}
                            color={check.status === 'passed' ? 'success' : 
                                   check.status === 'failed' ? 'error' : 'default'}
                            size="small"
                          />
                        </Box>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          Specification: {check.specification}
                        </Typography>
                        {check.measuredValue && (
                          <Typography variant="body2" gutterBottom>
                            Measured: {check.measuredValue}
                          </Typography>
                        )}
                        {check.checkedBy && (
                          <Typography variant="body2" color="textSecondary">
                            Checked by: {check.checkedBy} at {new Date(check.checkedAt!).toLocaleString()}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {activeTab === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Time Tracking
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Work Order</TableCell>
                      <TableCell>Operator</TableCell>
                      <TableCell>Start Time</TableCell>
                      <TableCell>End Time</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Activity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {workOrders.flatMap(wo => 
                      wo.timeEntries.map(entry => (
                        <TableRow key={`${wo._id}-${entry._id}`}>
                          <TableCell>{wo.woNumber}</TableCell>
                          <TableCell>{entry.operator}</TableCell>
                          <TableCell>
                            {new Date(entry.startTime).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {entry.endTime ? new Date(entry.endTime).toLocaleString() : 'In Progress'}
                          </TableCell>
                          <TableCell>
                            {entry.duration ? formatDuration(entry.duration) : '-'}
                          </TableCell>
                          <TableCell>{entry.activity}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Work Order Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEditing ? 'Edit Work Order' : 'Create New Work Order'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="WO Number"
                value={formData.woNumber}
                onChange={(e) => setFormData({ ...formData, woNumber: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="MO Number"
                value={formData.moNumber}
                onChange={(e) => setFormData({ ...formData, moNumber: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Product Code"
                value={formData.productCode}
                onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Product Name"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Work Center</InputLabel>
                <Select
                  value={formData.workCenterId}
                  label="Work Center"
                  onChange={(e) => setFormData({ ...formData, workCenterId: e.target.value })}
                >
                  {workCenters.map((wc) => (
                    <MenuItem key={wc._id} value={wc._id}>
                      {wc.name} - {wc.department}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Operation"
                value={formData.operation}
                onChange={(e) => setFormData({ ...formData, operation: e.target.value })}
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Planned Start Time"
                type="datetime-local"
                value={formData.plannedStartTime}
                onChange={(e) => setFormData({ ...formData, plannedStartTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Planned End Time"
                type="datetime-local"
                value={formData.plannedEndTime}
                onChange={(e) => setFormData({ ...formData, plannedEndTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={operators}
                getOptionLabel={(option) => `${option.name} (${option.employeeId})`}
                value={operators.filter(op => formData.assignedOperatorIds.includes(op._id))}
                onChange={(event, newValue) => {
                  setFormData({ ...formData, assignedOperatorIds: newValue.map(op => op._id) });
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Assigned Operators" />
                )}
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
            onClick={() => {}} 
            variant="contained"
            disabled={!formData.workCenterId || !formData.operation}
          >
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkOrdersPage;
