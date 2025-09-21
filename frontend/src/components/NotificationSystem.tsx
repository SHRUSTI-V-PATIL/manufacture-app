import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Button,
  Divider,
  Paper,
  Snackbar,
  Alert,
  AlertTitle,
  Tooltip
} from '@mui/material';
import {
  Notifications,
  NotificationsActive,
  Info,
  CheckCircle,
  Warning,
  Error,
  Close,
  MarkEmailRead,
  Delete,
  Circle
} from '@mui/icons-material';
import socketService, { NotificationData } from '../services/socketService';

interface NotificationSystemProps {
  userId: string;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ userId }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [currentSnackbar, setCurrentSnackbar] = useState<NotificationData | null>(null);
  const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set());

  const open = Boolean(anchorEl);

  // Initialize real-time notifications
  useEffect(() => {
    const unsubscribe = socketService.onNotification((notification) => {
      setNotifications(prev => [notification, ...prev].slice(0, 50)); // Keep only last 50
      
      // Show snackbar for important notifications
      if (notification.type === 'error' || notification.actionRequired) {
        setCurrentSnackbar(notification);
        setSnackbarOpen(true);
      }
      
      // Play notification sound (in a real app)
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
          tag: notification.id
        });
      }
    });

    return unsubscribe;
  }, []);

  // Update unread count
  useEffect(() => {
    const unread = notifications.filter(n => !readNotifications.has(n.id)).length;
    setUnreadCount(unread);
  }, [notifications, readNotifications]);

  // Load initial notifications (mock data for demo)
  useEffect(() => {
    const mockNotifications: NotificationData[] = [
      {
        id: '1',
        type: 'info',
        title: 'Work Order Assignment',
        message: 'You have been assigned to work order WO-2025-001',
        module: 'Work Orders',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        workOrderId: 'WO-2025-001'
      },
      {
        id: '2',
        type: 'warning',
        title: 'Low Stock Alert',
        message: 'Steel Pipe 2" is running low (15 units remaining)',
        module: 'Stock Ledger',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        type: 'success',
        title: 'Manufacturing Order Completed',
        message: 'MO-2025-001 has been completed successfully',
        module: 'Manufacturing Orders',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        manufacturingOrderId: 'MO-2025-001'
      },
      {
        id: '4',
        type: 'error',
        title: 'Quality Issue Detected',
        message: 'Critical quality issue found in work order WO-2025-002',
        module: 'Quality Control',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        workOrderId: 'WO-2025-002',
        actionRequired: true
      }
    ];
    
    setNotifications(mockNotifications);
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const markAsRead = useCallback((notificationId: string) => {
    setReadNotifications(prev => new Set([...prev, notificationId]));
  }, []);

  const markAllAsRead = useCallback(() => {
    const allIds = notifications.map(n => n.id);
    setReadNotifications(new Set(allIds));
  }, [notifications]);

  const deleteNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    setReadNotifications(prev => {
      const newSet = new Set(prev);
      newSet.delete(notificationId);
      return newSet;
    });
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle color="success" />;
      case 'warning': return <Warning color="warning" />;
      case 'error': return <Error color="error" />;
      default: return <Info color="info" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'info';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffMs = now.getTime() - notificationTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const handleNotificationClick = (notification: NotificationData) => {
    markAsRead(notification.id);
    
    // Navigate to relevant page based on notification type
    if (notification.workOrderId) {
      // Navigate to work orders page
      window.location.hash = '/work-orders';
    } else if (notification.manufacturingOrderId) {
      // Navigate to manufacturing orders page
      window.location.hash = '/manufacturing-orders';
    } else if (notification.module === 'Stock Ledger') {
      // Navigate to stock ledger page
      window.location.hash = '/stock-ledger';
    }
    
    handleClose();
  };

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton
          color="inherit"
          onClick={handleClick}
          sx={{ ml: 1 }}
        >
          <Badge badgeContent={unreadCount} color="error">
            {unreadCount > 0 ? <NotificationsActive /> : <Notifications />}
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { 
            width: 400, 
            maxHeight: 500,
            overflow: 'visible'
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Button
                size="small"
                onClick={markAllAsRead}
                startIcon={<MarkEmailRead />}
              >
                Mark all read
              </Button>
            )}
          </Box>
          {unreadCount > 0 && (
            <Typography variant="body2" color="textSecondary">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </Typography>
          )}
        </Box>

        <Box sx={{ maxHeight: 350, overflow: 'auto' }}>
          {notifications.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="textSecondary">
                No notifications
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {notifications.map((notification, index) => {
                const isRead = readNotifications.has(notification.id);
                return (
                  <React.Fragment key={notification.id}>
                    <ListItem
                      button
                      onClick={() => handleNotificationClick(notification)}
                      sx={{
                        bgcolor: isRead ? 'inherit' : 'action.hover',
                        '&:hover': {
                          bgcolor: 'action.selected'
                        }
                      }}
                    >
                      <ListItemIcon>
                        <Box sx={{ position: 'relative' }}>
                          {getNotificationIcon(notification.type)}
                          {!isRead && (
                            <Circle
                              sx={{
                                position: 'absolute',
                                top: -2,
                                right: -2,
                                fontSize: 8,
                                color: 'primary.main'
                              }}
                            />
                          )}
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography
                              variant="body2"
                              fontWeight={isRead ? 'normal' : 'bold'}
                              sx={{ flex: 1 }}
                            >
                              {notification.title}
                            </Typography>
                            <Chip
                              label={notification.module}
                              size="small"
                              color={getNotificationColor(notification.type) as any}
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="textSecondary">
                              {notification.message}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {formatTimestamp(notification.timestamp)}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < notifications.length - 1 && <Divider />}
                  </React.Fragment>
                );
              })}
            </List>
          )}
        </Box>

        {notifications.length > 0 && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
            <Button
              size="small"
              onClick={() => {
                // Navigate to full notifications page
                window.location.hash = '/notifications';
                handleClose();
              }}
            >
              View All Notifications
            </Button>
          </Box>
        )}
      </Menu>

      {/* Snackbar for important notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={currentSnackbar?.actionRequired ? null : 6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity={currentSnackbar?.type === 'error' ? 'error' : 'warning'}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => setSnackbarOpen(false)}
            >
              <Close fontSize="small" />
            </IconButton>
          }
        >
          <AlertTitle>{currentSnackbar?.title}</AlertTitle>
          {currentSnackbar?.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default NotificationSystem;
