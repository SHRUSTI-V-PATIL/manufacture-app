import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider
} from '@mui/material';
import {
  Dashboard,
  Assignment,
  Work,
  Inventory,
  Receipt,
  Analytics,
  AccountCircle,
  ExitToApp,
  Person,
  Assessment
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import NotificationSystem from '../NotificationSystem';
import RealTimeStatus from '../RealTimeStatus';
import socketService from '../../services/socketService';

const leftDrawerWidth = 240;
const rightDrawerWidth = 280;

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  // Initialize socket connection when layout mounts
  useEffect(() => {
    if (user) {
      socketService.connect(user.id);

      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }

    return () => {
      socketService.disconnect();
    };
  }, [user]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/login');
  };

  // Left Sidebar - Profile & Setup
  const leftMenuItems = [
    { text: 'My Profile', icon: <Person />, path: '/profile' },
    { text: 'My Reports', icon: <Assessment />, path: '/reports' },
  ];

  // Right Sidebar - Master Menu
  const rightMenuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Manufacturing Orders', icon: <Assignment />, path: '/manufacturing-orders' },
    { text: 'Work Orders', icon: <Work />, path: '/work-orders' },
    { text: 'Work Centers', icon: <Work />, path: '/work-centers' },
    { text: 'Stock Ledger', icon: <Inventory />, path: '/stock-ledger' },
    { text: 'Bills of Material', icon: <Receipt />, path: '/bom' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Manufacturing MES
          </Typography>

          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <RealTimeStatus />
              <NotificationSystem userId={user.id} />
              <Typography variant="body2" sx={{ mx: 2 }}>
                {user.firstName} {user.lastName}
              </Typography>
              <IconButton
                size="large"
                aria-label="account menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32 }}>
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                  <ListItemIcon>
                    <AccountCircle fontSize="small" />
                  </ListItemIcon>
                  My Profile
                </MenuItem>
                <MenuItem onClick={() => { navigate('/reports'); handleMenuClose(); }}>
                  <ListItemIcon>
                    <Assessment fontSize="small" />
                  </ListItemIcon>
                  My Reports
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <ExitToApp fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Left Sidebar - Profile & Setup */}
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: leftDrawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: leftDrawerWidth,
            boxSizing: 'border-box',
            top: '64px', // Account for AppBar height
            height: 'calc(100% - 64px)'
          },
        }}
      >
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <Typography variant="h6" sx={{ px: 2, mb: 2, color: 'text.secondary' }}>
            Profile & Setup
          </Typography>
          <List>
            {leftMenuItems.map((item) => (
              <ListItem button key={item.text} onClick={() => navigate(item.path)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Right Sidebar - Master Menu */}
      <Drawer
        variant="permanent"
        anchor="right"
        sx={{
          width: rightDrawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: rightDrawerWidth,
            boxSizing: 'border-box',
            top: '64px', // Account for AppBar height
            height: 'calc(100% - 64px)'
          },
        }}
      >
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <Typography variant="h6" sx={{ px: 2, mb: 2, color: 'text.secondary' }}>
            Master Menu
          </Typography>
          <List>
            {rightMenuItems.map((item) => (
              <ListItem button key={item.text} onClick={() => navigate(item.path)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: `${leftDrawerWidth}px`,
          marginRight: `${rightDrawerWidth}px`,
          width: `calc(100% - ${leftDrawerWidth + rightDrawerWidth}px)`
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
