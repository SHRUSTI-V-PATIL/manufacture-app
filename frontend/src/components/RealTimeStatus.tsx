import React, { useState, useEffect } from 'react';
import {
  Box,
  Chip,
  Tooltip,
  Typography,
  Popover,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Circle,
  Wifi,
  WifiOff,
  Sync,
  People,
  Schedule,
  CloudSync
} from '@mui/icons-material';
import socketService from '../services/socketService';

interface ActiveUser {
  id: string;
  name: string;
  role: string;
  lastSeen: string;
  currentModule?: string;
}

interface SystemStatus {
  connected: boolean;
  lastSync: string;
  serverHealth: 'good' | 'warning' | 'error';
  activeUsers: number;
  pendingSync: number;
}

const RealTimeStatus: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    connected: false,
    lastSync: new Date().toISOString(),
    serverHealth: 'good',
    activeUsers: 0,
    pendingSync: 0
  });
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);

  const open = Boolean(anchorEl);

  useEffect(() => {
    // Check connection status periodically
    const checkStatus = () => {
      const status = socketService.getConnectionStatus();
      setConnectionStatus(status);
      
      setSystemStatus(prev => ({
        ...prev,
        connected: status === 'connected',
        lastSync: status === 'connected' ? new Date().toISOString() : prev.lastSync
      }));
    };

    checkStatus();
    const interval = setInterval(checkStatus, 2000);

    // Mock active users data
    const mockUsers: ActiveUser[] = [
      {
        id: '1',
        name: 'John Smith',
        role: 'Manager',
        lastSeen: new Date().toISOString(),
        currentModule: 'Dashboard'
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        role: 'Operator',
        lastSeen: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        currentModule: 'Work Orders'
      },
      {
        id: '3',
        name: 'Mike Wilson',
        role: 'Quality Inspector',
        lastSeen: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        currentModule: 'Quality Control'
      },
      {
        id: '4',
        name: 'Emily Davis',
        role: 'Inventory Manager',
        lastSeen: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        currentModule: 'Stock Ledger'
      }
    ];

    setActiveUsers(mockUsers);
    setSystemStatus(prev => ({
      ...prev,
      activeUsers: mockUsers.length
    }));

    return () => clearInterval(interval);
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'success';
      case 'connecting': return 'warning';
      case 'disconnected': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <Wifi />;
      case 'connecting': return <Sync className="animate-spin" />;
      case 'disconnected': return <WifiOff />;
      default: return <Circle />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'Online';
      case 'connecting': return 'Connecting...';
      case 'disconnected': return 'Offline';
      default: return 'Unknown';
    }
  };

  const formatLastSeen = (lastSeen: string) => {
    const now = new Date();
    const seenTime = new Date(lastSeen);
    const diffMs = now.getTime() - seenTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'manager': return 'primary';
      case 'operator': return 'success';
      case 'quality inspector': return 'warning';
      case 'inventory manager': return 'info';
      default: return 'default';
    }
  };

  return (
    <>
      <Tooltip title={`System Status: ${getStatusText(connectionStatus)}`}>
        <Chip
          icon={getStatusIcon(connectionStatus)}
          label={getStatusText(connectionStatus)}
          color={getStatusColor(connectionStatus) as any}
          variant="outlined"
          size="small"
          onClick={handleClick}
          sx={{ 
            cursor: 'pointer',
            '& .MuiChip-icon': {
              animation: connectionStatus === 'connecting' ? 'spin 1s linear infinite' : 'none'
            }
          }}
        />
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { width: 320, maxHeight: 400 }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            System Status
          </Typography>

          {/* Connection Status */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              {getStatusIcon(connectionStatus)}
              <Typography variant="body2">
                Connection: {getStatusText(connectionStatus)}
              </Typography>
            </Box>
            <Typography variant="caption" color="textSecondary">
              Last sync: {new Date(systemStatus.lastSync).toLocaleTimeString()}
            </Typography>
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* System Health */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <CloudSync color={systemStatus.serverHealth === 'good' ? 'success' : 'warning'} />
              <Typography variant="body2">
                Server Health: {systemStatus.serverHealth.toUpperCase()}
              </Typography>
            </Box>
            <Typography variant="caption" color="textSecondary">
              {systemStatus.pendingSync > 0 && `${systemStatus.pendingSync} pending sync operations`}
            </Typography>
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* Active Users */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <People />
              <Typography variant="body2">
                Active Users ({systemStatus.activeUsers})
              </Typography>
            </Box>
            
            <List dense sx={{ maxHeight: 200, overflow: 'auto' }}>
              {activeUsers.map((user) => (
                <ListItem key={user.id} sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Circle 
                      sx={{ 
                        fontSize: 8,
                        color: new Date(user.lastSeen).getTime() > Date.now() - 5 * 60 * 1000 
                          ? 'success.main' 
                          : 'warning.main'
                      }} 
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">
                          {user.name}
                        </Typography>
                        <Chip
                          label={user.role}
                          size="small"
                          color={getRoleColor(user.role) as any}
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        {user.currentModule && (
                          <Typography variant="caption" color="textSecondary">
                            in {user.currentModule}
                          </Typography>
                        )}
                        <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                          • {formatLastSeen(user.lastSeen)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Popover>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  );
};

export default RealTimeStatus;
