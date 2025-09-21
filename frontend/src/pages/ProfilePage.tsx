import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Avatar,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import {
  Person,
  Security,
  Notifications,
  History,
  Edit,
  Save,
  Cancel,
  Visibility,
  VisibilityOff,
  Email,
  Phone,
  Business,
  Badge,
  VpnKey,
  Schedule,
  Language,
  Palette,
  Settings,
  Lock,
  NotificationsActive,
  Group,
  Admin,
  Assignment
} from '@mui/icons-material';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  employeeId: string;
  department: string;
  position: string;
  role: 'admin' | 'manager' | 'operator' | 'viewer';
  avatar?: string;
  lastLogin: string;
  createdAt: string;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  dateFormat: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    workOrders: boolean;
    qualityAlerts: boolean;
    inventory: boolean;
    system: boolean;
  };
  dashboard: {
    autoRefresh: boolean;
    refreshInterval: number;
    defaultView: string;
  };
}

interface ActivityLog {
  _id: string;
  action: string;
  module: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

interface Permission {
  module: string;
  permissions: string[];
}

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  // Form states
  const [userForm, setUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    position: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Mock user data
      const mockUser: User = {
        _id: '1',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@company.com',
        phone: '+1 (555) 123-4567',
        employeeId: 'EMP-001',
        department: 'Production',
        position: 'Production Manager',
        role: 'manager',
        lastLogin: '2025-09-20T08:30:00Z',
        createdAt: '2024-01-15T10:00:00Z'
      };

      // Mock preferences
      const mockPreferences: UserPreferences = {
        theme: 'light',
        language: 'en',
        timezone: 'America/New_York',
        dateFormat: 'MM/DD/YYYY',
        notifications: {
          email: true,
          push: true,
          sms: false,
          workOrders: true,
          qualityAlerts: true,
          inventory: false,
          system: true
        },
        dashboard: {
          autoRefresh: true,
          refreshInterval: 30,
          defaultView: 'overview'
        }
      };

      // Mock activity log
      const mockActivityLog: ActivityLog[] = [
        {
          _id: '1',
          action: 'Login',
          module: 'Authentication',
          details: 'User logged in successfully',
          timestamp: '2025-09-20T08:30:00Z',
          ipAddress: '192.168.1.100'
        },
        {
          _id: '2',
          action: 'Create Work Order',
          module: 'Work Orders',
          details: 'Created work order WO-2025-001',
          timestamp: '2025-09-20T09:15:00Z',
          ipAddress: '192.168.1.100'
        },
        {
          _id: '3',
          action: 'Update Manufacturing Order',
          module: 'Manufacturing Orders',
          details: 'Updated status of MO-2025-001 to In Progress',
          timestamp: '2025-09-20T10:45:00Z',
          ipAddress: '192.168.1.100'
        },
        {
          _id: '4',
          action: 'Generate Report',
          module: 'Reports',
          details: 'Generated Daily Production Summary report',
          timestamp: '2025-09-20T14:20:00Z',
          ipAddress: '192.168.1.100'
        },
        {
          _id: '5',
          action: 'Profile Update',
          module: 'Profile',
          details: 'Updated notification preferences',
          timestamp: '2025-09-19T16:30:00Z',
          ipAddress: '192.168.1.100'
        }
      ];

      // Mock permissions
      const mockPermissions: Permission[] = [
        {
          module: 'Dashboard',
          permissions: ['view', 'export']
        },
        {
          module: 'Manufacturing Orders',
          permissions: ['view', 'create', 'edit', 'delete']
        },
        {
          module: 'Work Orders',
          permissions: ['view', 'create', 'edit', 'assign']
        },
        {
          module: 'Work Centers',
          permissions: ['view', 'edit']
        },
        {
          module: 'Stock Ledger',
          permissions: ['view', 'edit', 'adjust']
        },
        {
          module: 'BOM',
          permissions: ['view', 'create', 'edit']
        },
        {
          module: 'Reports',
          permissions: ['view', 'create', 'export']
        },
        {
          module: 'User Management',
          permissions: ['view']
        }
      ];

      setUser(mockUser);
      setPreferences(mockPreferences);
      setActivityLog(mockActivityLog);
      setPermissions(mockPermissions);
      
      setUserForm({
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        email: mockUser.email,
        phone: mockUser.phone,
        department: mockUser.department,
        position: mockUser.position
      });
    } catch (err) {
      setError('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Save changes
      if (user) {
        setUser({
          ...user,
          ...userForm
        });
      }
    }
  };

  const handlePreferenceChange = (category: keyof UserPreferences, key: string, value: any) => {
    if (!preferences) return;
    
    setPreferences({
      ...preferences,
      [category]: {
        ...preferences[category],
        [key]: value
      }
    });
  };

  const handlePasswordChange = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    // In a real app, this would make an API call to change the password
    setOpenPasswordDialog(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    alert('Password changed successfully!');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'error';
      case 'manager': return 'primary';
      case 'operator': return 'success';
      case 'viewer': return 'default';
      default: return 'default';
    }
  };

  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case 'delete': return 'error';
      case 'create': return 'success';
      case 'edit': return 'warning';
      case 'view': return 'default';
      default: return 'info';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user || !preferences) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Failed to load user data</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Profile Settings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Summary Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    mb: 2,
                    bgcolor: 'primary.main',
                    fontSize: '2rem'
                  }}
                >
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </Avatar>
                <Typography variant="h5" gutterBottom>
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                  {user.position}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {user.department}
                </Typography>
                <Chip 
                  label={user.role.toUpperCase()} 
                  color={getRoleColor(user.role) as any}
                  size="small"
                />
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <List dense>
                <ListItem>
                  <ListItemIcon><Badge /></ListItemIcon>
                  <ListItemText 
                    primary="Employee ID" 
                    secondary={user.employeeId}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Email /></ListItemIcon>
                  <ListItemText 
                    primary="Email" 
                    secondary={user.email}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Phone /></ListItemIcon>
                  <ListItemText 
                    primary="Phone" 
                    secondary={user.phone}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Schedule /></ListItemIcon>
                  <ListItemText 
                    primary="Last Login" 
                    secondary={new Date(user.lastLogin).toLocaleString()}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Card>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
              <Tab label="Personal Info" />
              <Tab label="Preferences" />
              <Tab label="Security" />
              <Tab label="Permissions" />
              <Tab label="Activity Log" />
            </Tabs>

            <CardContent>
              {/* Personal Info Tab */}
              {activeTab === 0 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6">Personal Information</Typography>
                    <Button
                      variant={isEditing ? "contained" : "outlined"}
                      startIcon={isEditing ? <Save /> : <Edit />}
                      onClick={handleEditToggle}
                    >
                      {isEditing ? 'Save Changes' : 'Edit Profile'}
                    </Button>
                  </Box>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        value={userForm.firstName}
                        onChange={(e) => setUserForm({ ...userForm, firstName: e.target.value })}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        value={userForm.lastName}
                        onChange={(e) => setUserForm({ ...userForm, lastName: e.target.value })}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        value={userForm.email}
                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone"
                        value={userForm.phone}
                        onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Department"
                        value={userForm.department}
                        onChange={(e) => setUserForm({ ...userForm, department: e.target.value })}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Position"
                        value={userForm.position}
                        onChange={(e) => setUserForm({ ...userForm, position: e.target.value })}
                        disabled={!isEditing}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Preferences Tab */}
              {activeTab === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Application Preferences
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Theme</InputLabel>
                        <Select
                          value={preferences.theme}
                          label="Theme"
                          onChange={(e) => handlePreferenceChange('theme', '', e.target.value)}
                        >
                          <MenuItem value="light">Light</MenuItem>
                          <MenuItem value="dark">Dark</MenuItem>
                          <MenuItem value="auto">Auto</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Language</InputLabel>
                        <Select
                          value={preferences.language}
                          label="Language"
                          onChange={(e) => handlePreferenceChange('language', '', e.target.value)}
                        >
                          <MenuItem value="en">English</MenuItem>
                          <MenuItem value="es">Spanish</MenuItem>
                          <MenuItem value="fr">French</MenuItem>
                          <MenuItem value="de">German</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Timezone</InputLabel>
                        <Select
                          value={preferences.timezone}
                          label="Timezone"
                          onChange={(e) => handlePreferenceChange('timezone', '', e.target.value)}
                        >
                          <MenuItem value="America/New_York">Eastern Time</MenuItem>
                          <MenuItem value="America/Chicago">Central Time</MenuItem>
                          <MenuItem value="America/Denver">Mountain Time</MenuItem>
                          <MenuItem value="America/Los_Angeles">Pacific Time</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Date Format</InputLabel>
                        <Select
                          value={preferences.dateFormat}
                          label="Date Format"
                          onChange={(e) => handlePreferenceChange('dateFormat', '', e.target.value)}
                        >
                          <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                          <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                          <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                    Notification Settings
                  </Typography>
                  
                  <List>
                    <ListItem>
                      <ListItemIcon><Email /></ListItemIcon>
                      <ListItemText 
                        primary="Email Notifications" 
                        secondary="Receive notifications via email"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={preferences.notifications.email}
                          onChange={(e) => handlePreferenceChange('notifications', 'email', e.target.checked)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><NotificationsActive /></ListItemIcon>
                      <ListItemText 
                        primary="Push Notifications" 
                        secondary="Receive browser push notifications"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={preferences.notifications.push}
                          onChange={(e) => handlePreferenceChange('notifications', 'push', e.target.checked)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Phone /></ListItemIcon>
                      <ListItemText 
                        primary="SMS Notifications" 
                        secondary="Receive urgent alerts via SMS"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={preferences.notifications.sms}
                          onChange={(e) => handlePreferenceChange('notifications', 'sms', e.target.checked)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Assignment /></ListItemIcon>
                      <ListItemText 
                        primary="Work Order Updates" 
                        secondary="Notifications for work order changes"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={preferences.notifications.workOrders}
                          onChange={(e) => handlePreferenceChange('notifications', 'workOrders', e.target.checked)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>

                  <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                    Dashboard Settings
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={preferences.dashboard.autoRefresh}
                            onChange={(e) => handlePreferenceChange('dashboard', 'autoRefresh', e.target.checked)}
                          />
                        }
                        label="Auto-refresh dashboard"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Refresh Interval (seconds)"
                        type="number"
                        value={preferences.dashboard.refreshInterval}
                        onChange={(e) => handlePreferenceChange('dashboard', 'refreshInterval', Number(e.target.value))}
                        disabled={!preferences.dashboard.autoRefresh}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Security Tab */}
              {activeTab === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Security Settings
                  </Typography>
                  
                  <List>
                    <ListItem>
                      <ListItemIcon><VpnKey /></ListItemIcon>
                      <ListItemText 
                        primary="Change Password" 
                        secondary="Update your account password"
                      />
                      <ListItemSecondaryAction>
                        <Button
                          variant="outlined"
                          onClick={() => setOpenPasswordDialog(true)}
                        >
                          Change
                        </Button>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Security /></ListItemIcon>
                      <ListItemText 
                        primary="Two-Factor Authentication" 
                        secondary="Add an extra layer of security"
                      />
                      <ListItemSecondaryAction>
                        <Button variant="outlined">
                          Enable
                        </Button>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><History /></ListItemIcon>
                      <ListItemText 
                        primary="Active Sessions" 
                        secondary="Manage your logged in devices"
                      />
                      <ListItemSecondaryAction>
                        <Button variant="outlined">
                          View
                        </Button>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </Box>
              )}

              {/* Permissions Tab */}
              {activeTab === 3 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Your Permissions
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    These are the permissions assigned to your role. Contact your administrator to request changes.
                  </Typography>
                  
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Module</TableCell>
                          <TableCell>Permissions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {permissions.map((permission) => (
                          <TableRow key={permission.module}>
                            <TableCell>
                              <Typography variant="body2" fontWeight="bold">
                                {permission.module}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {permission.permissions.map((perm) => (
                                  <Chip 
                                    key={perm}
                                    label={perm}
                                    color={getPermissionColor(perm) as any}
                                    size="small"
                                  />
                                ))}
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* Activity Log Tab */}
              {activeTab === 4 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Recent Activity
                  </Typography>
                  
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Action</TableCell>
                          <TableCell>Module</TableCell>
                          <TableCell>Details</TableCell>
                          <TableCell>Timestamp</TableCell>
                          <TableCell>IP Address</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {activityLog.map((log) => (
                          <TableRow key={log._id}>
                            <TableCell>
                              <Typography variant="body2" fontWeight="bold">
                                {log.action}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={log.module}
                                color="primary"
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {log.details}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {new Date(log.timestamp).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="textSecondary">
                                {log.ipAddress}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Change Password Dialog */}
      <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Current Password"
                type={showPassword ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm New Password"
                type={showPassword ? 'text' : 'password'}
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)}>Cancel</Button>
          <Button 
            onClick={handlePasswordChange} 
            variant="contained"
            disabled={!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;
