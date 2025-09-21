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
  Fab,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Settings,
  TrendingUp,
  Schedule,
  Build
} from '@mui/icons-material';

interface WorkCenter {
  _id: string;
  name: string;
  code: string;
  description: string;
  location: string;
  type: 'machining' | 'assembly' | 'quality' | 'packaging' | 'other';
  capacity: number;
  currentUtilization: number;
  status: 'active' | 'inactive' | 'maintenance';
  costPerHour: number;
  setupTime: number;
  teardownTime: number;
  efficiency: number;
  availability: number;
  shifts: Array<{
    name: string;
    startTime: string;
    endTime: string;
    days: string[];
  }>;
  equipment: Array<{
    name: string;
    model: string;
    status: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

const WorkCentersPage: React.FC = () => {
  const [workCenters, setWorkCenters] = useState<WorkCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedWorkCenter, setSelectedWorkCenter] = useState<WorkCenter | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    location: '',
    type: 'machining' as const,
    capacity: 100,
    costPerHour: 50,
    setupTime: 30,
    teardownTime: 15
  });

  useEffect(() => {
    fetchWorkCenters();
  }, []);

  const fetchWorkCenters = async () => {
    try {
      setLoading(true);
      // Mock data for now
      const mockWorkCenters: WorkCenter[] = [
        {
          _id: '1',
          name: 'CNC Machining Center 1',
          code: 'CNC-001',
          description: 'High precision CNC machining for metal components',
          location: 'Building A - Floor 2',
          type: 'machining',
          capacity: 100,
          currentUtilization: 85,
          status: 'active',
          costPerHour: 120,
          setupTime: 45,
          teardownTime: 20,
          efficiency: 92,
          availability: 95,
          shifts: [
            { name: 'Day Shift', startTime: '06:00', endTime: '14:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
            { name: 'Evening Shift', startTime: '14:00', endTime: '22:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] }
          ],
          equipment: [
            { name: 'CNC Mill', model: 'Haas VF-4SS', status: 'running' },
            { name: 'Tool Changer', model: 'ATC-40', status: 'active' }
          ],
          createdAt: '2024-01-15T08:00:00Z',
          updatedAt: '2024-01-20T10:30:00Z'
        },
        {
          _id: '2',
          name: 'Assembly Line A',
          code: 'ASM-A01',
          description: 'Main assembly line for product family A',
          location: 'Building B - Floor 1',
          type: 'assembly',
          capacity: 150,
          currentUtilization: 78,
          status: 'active',
          costPerHour: 80,
          setupTime: 60,
          teardownTime: 30,
          efficiency: 88,
          availability: 98,
          shifts: [
            { name: 'Day Shift', startTime: '07:00', endTime: '15:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
            { name: 'Night Shift', startTime: '23:00', endTime: '07:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] }
          ],
          equipment: [
            { name: 'Conveyor System', model: 'FlexLink X85', status: 'running' },
            { name: 'Torque Station', model: 'Atlas Copco QST', status: 'active' }
          ],
          createdAt: '2024-01-10T09:00:00Z',
          updatedAt: '2024-01-18T14:15:00Z'
        },
        {
          _id: '3',
          name: 'Quality Control Station',
          code: 'QC-001',
          description: 'Inspection and testing station for final products',
          location: 'Building C - Floor 1',
          type: 'quality',
          capacity: 50,
          currentUtilization: 65,
          status: 'active',
          costPerHour: 60,
          setupTime: 15,
          teardownTime: 10,
          efficiency: 96,
          availability: 99,
          shifts: [
            { name: 'Day Shift', startTime: '08:00', endTime: '16:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] }
          ],
          equipment: [
            { name: 'CMM Machine', model: 'Zeiss Contura G2', status: 'running' },
            { name: 'Surface Tester', model: 'Mitutoyo SJ-410', status: 'active' }
          ],
          createdAt: '2024-01-12T11:00:00Z',
          updatedAt: '2024-01-19T16:45:00Z'
        }
      ];
      setWorkCenters(mockWorkCenters);
    } catch (err) {
      setError('Failed to fetch work centers');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (workCenter?: WorkCenter) => {
    if (workCenter) {
      setSelectedWorkCenter(workCenter);
      setFormData({
        name: workCenter.name,
        code: workCenter.code,
        description: workCenter.description,
        location: workCenter.location,
        type: workCenter.type,
        capacity: workCenter.capacity,
        costPerHour: workCenter.costPerHour,
        setupTime: workCenter.setupTime,
        teardownTime: workCenter.teardownTime
      });
      setIsEditing(true);
    } else {
      setSelectedWorkCenter(null);
      setFormData({
        name: '',
        code: '',
        description: '',
        location: '',
        type: 'machining',
        capacity: 100,
        costPerHour: 50,
        setupTime: 30,
        teardownTime: 15
      });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedWorkCenter(null);
    setIsEditing(false);
  };

  const handleSubmit = async () => {
    try {
      if (isEditing && selectedWorkCenter) {
        // Update work center
        const updatedWorkCenter = { ...selectedWorkCenter, ...formData };
        setWorkCenters(prev => prev.map(wc => wc._id === selectedWorkCenter._id ? updatedWorkCenter : wc));
      } else {
        // Create new work center
        const newWorkCenter: WorkCenter = {
          _id: Date.now().toString(),
          ...formData,
          currentUtilization: 0,
          status: 'active',
          efficiency: 100,
          availability: 100,
          shifts: [],
          equipment: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setWorkCenters(prev => [...prev, newWorkCenter]);
      }
      handleCloseDialog();
    } catch (err) {
      setError('Failed to save work center');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this work center?')) {
      setWorkCenters(prev => prev.filter(wc => wc._id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'maintenance': return 'warning';
      default: return 'default';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'machining': return 'primary';
      case 'assembly': return 'secondary';
      case 'quality': return 'info';
      case 'packaging': return 'warning';
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
          Work Centers
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Work Center
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Work Centers
                  </Typography>
                  <Typography variant="h4">
                    {workCenters.length}
                  </Typography>
                </Box>
                <Build color="primary" />
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
                    Active Centers
                  </Typography>
                  <Typography variant="h4">
                    {workCenters.filter(wc => wc.status === 'active').length}
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
                    Avg Utilization
                  </Typography>
                  <Typography variant="h4">
                    {Math.round(workCenters.reduce((acc, wc) => acc + wc.currentUtilization, 0) / workCenters.length)}%
                  </Typography>
                </Box>
                <Schedule color="info" />
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
                    Avg Efficiency
                  </Typography>
                  <Typography variant="h4">
                    {Math.round(workCenters.reduce((acc, wc) => acc + wc.efficiency, 0) / workCenters.length)}%
                  </Typography>
                </Box>
                <Settings color="secondary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Work Centers Table */}
      <Card>
        <CardContent>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Utilization</TableCell>
                  <TableCell>Efficiency</TableCell>
                  <TableCell>Cost/Hour</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {workCenters.map((workCenter) => (
                  <TableRow key={workCenter._id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {workCenter.code}
                      </Typography>
                    </TableCell>
                    <TableCell>{workCenter.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={workCenter.type}
                        color={getTypeColor(workCenter.type) as any}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{workCenter.location}</TableCell>
                    <TableCell>
                      <Chip
                        label={workCenter.status}
                        color={getStatusColor(workCenter.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={workCenter.currentUtilization} 
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {workCenter.currentUtilization}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{workCenter.efficiency}%</TableCell>
                    <TableCell>${workCenter.costPerHour}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleOpenDialog(workCenter)}>
                        <Edit />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(workCenter._id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEditing ? 'Edit Work Center' : 'Create New Work Center'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Work Center Code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Work Center Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Type"
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                >
                  <MenuItem value="machining">Machining</MenuItem>
                  <MenuItem value="assembly">Assembly</MenuItem>
                  <MenuItem value="quality">Quality</MenuItem>
                  <MenuItem value="packaging">Packaging</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Capacity (units/hour)"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cost per Hour ($)"
                type="number"
                value={formData.costPerHour}
                onChange={(e) => setFormData({ ...formData, costPerHour: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Setup Time (minutes)"
                type="number"
                value={formData.setupTime}
                onChange={(e) => setFormData({ ...formData, setupTime: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Teardown Time (minutes)"
                type="number"
                value={formData.teardownTime}
                onChange={(e) => setFormData({ ...formData, teardownTime: Number(e.target.value) })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkCentersPage;
