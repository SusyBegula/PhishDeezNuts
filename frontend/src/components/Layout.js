import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Button,
  Badge,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
  ExitToApp as LogoutIcon,
  Notifications as NotificationsIcon,
  Help as HelpIcon,
  Search as SearchIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { logout } from '../services/authService';
import { syncEmails } from '../services/emailService';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';

const drawerWidth = 240;

const Layout = ({ user, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [syncing, setSyncing] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      await syncEmails();
      // Refresh the current page
      window.location.reload();
    } catch (error) {
      console.error('Error syncing emails:', error);
    } finally {
      setSyncing(false);
    }
  };

  const drawer = (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      background: theme.palette.mode === 'dark' 
        ? 'linear-gradient(180deg, #1e1e1e 0%, #252525 100%)' 
        : 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)'
    }}>
      <Toolbar sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        py: 2
      }}>
        <Logo size="medium" />
      </Toolbar>
      <Divider />
      
      {/* User Profile Section */}
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        mb: 2
      }}>
        <Avatar 
          src={user?.profile_pic} 
          alt={user?.name || 'User'} 
          sx={{ 
            width: 64, 
            height: 64, 
            mb: 1,
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            border: '2px solid',
            borderColor: 'primary.main'
          }}
        />
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {user?.name || 'User'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {user?.email}
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <List sx={{ flexGrow: 1, px: 1 }}>
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton 
            selected={location.pathname === '/dashboard' || location.pathname === '/'}
            onClick={() => navigate('/dashboard')}
            sx={{ 
              borderRadius: 2,
              '&.Mui-selected': {
                background: theme.palette.mode === 'dark' 
                  ? 'linear-gradient(45deg, rgba(58, 123, 213, 0.2) 0%, rgba(0, 210, 255, 0.2) 100%)'
                  : 'linear-gradient(45deg, rgba(58, 123, 213, 0.1) 0%, rgba(0, 210, 255, 0.1) 100%)',
                '&:hover': {
                  background: theme.palette.mode === 'dark' 
                    ? 'linear-gradient(45deg, rgba(58, 123, 213, 0.3) 0%, rgba(0, 210, 255, 0.3) 100%)'
                    : 'linear-gradient(45deg, rgba(58, 123, 213, 0.2) 0%, rgba(0, 210, 255, 0.2) 100%)',
                }
              }
            }}
          >
            <ListItemIcon>
              <DashboardIcon color={location.pathname === '/dashboard' || location.pathname === '/' ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText 
              primary="Dashboard" 
              primaryTypographyProps={{ 
                fontWeight: location.pathname === '/dashboard' || location.pathname === '/' ? 600 : 400 
              }}
            />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton 
            selected={location.pathname === '/settings'}
            onClick={() => navigate('/settings')}
            sx={{ 
              borderRadius: 2,
              '&.Mui-selected': {
                background: theme.palette.mode === 'dark' 
                  ? 'linear-gradient(45deg, rgba(58, 123, 213, 0.2) 0%, rgba(0, 210, 255, 0.2) 100%)'
                  : 'linear-gradient(45deg, rgba(58, 123, 213, 0.1) 0%, rgba(0, 210, 255, 0.1) 100%)',
                '&:hover': {
                  background: theme.palette.mode === 'dark' 
                    ? 'linear-gradient(45deg, rgba(58, 123, 213, 0.3) 0%, rgba(0, 210, 255, 0.3) 100%)'
                    : 'linear-gradient(45deg, rgba(58, 123, 213, 0.2) 0%, rgba(0, 210, 255, 0.2) 100%)',
                }
              }
            }}
          >
            <ListItemIcon>
              <SettingsIcon color={location.pathname === '/settings' ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText 
              primary="Settings" 
              primaryTypographyProps={{ 
                fontWeight: location.pathname === '/settings' ? 600 : 400 
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
      
      <Box sx={{ p: 2 }}>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ borderRadius: 2 }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(90deg, #1e1e1e 0%, #252525 100%)' 
            : 'linear-gradient(90deg, #ffffff 0%, #f8f9fa 100%)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
              {location.pathname === '/dashboard' || location.pathname === '/' ? 'Dashboard' : 
               location.pathname === '/settings' ? 'Settings' : 
               location.pathname.startsWith('/email/') ? 'Email Details' : ''}
            </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Search">
              <IconButton color="inherit" sx={{ mr: 1 }}>
                <SearchIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Filter">
              <IconButton color="inherit" sx={{ mr: 1 }}>
                <FilterIcon />
              </IconButton>
            </Tooltip>
            
            <Button
              color="primary"
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={handleSync}
              disabled={syncing}
              sx={{ 
                mr: 2,
                px: 2,
                boxShadow: '0 4px 10px rgba(58, 123, 213, 0.2)',
                background: 'linear-gradient(45deg, #3a7bd5 0%, #00d2ff 100%)',
                '&:hover': {
                  boxShadow: '0 6px 15px rgba(58, 123, 213, 0.3)',
                }
              }}
            >
              {syncing ? 'Syncing...' : 'Sync Emails'}
            </Button>
            
            <Tooltip title="Notifications">
              <IconButton 
                color="inherit" 
                onClick={handleNotificationMenuOpen}
                sx={{ mr: 1 }}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <ThemeToggle sx={{ mr: 1 }} />
            
            <Tooltip title="Help">
              <IconButton color="inherit" sx={{ mr: 1 }}>
                <HelpIcon />
              </IconButton>
            </Tooltip>
            
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar 
                alt={user?.name || 'User'} 
                src={user?.profile_pic} 
                sx={{ 
                  width: 32, 
                  height: 32,
                  border: '2px solid',
                  borderColor: 'primary.main'
                }}
              />
            </IconButton>
          </Box>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1.5,
                borderRadius: 2,
                minWidth: 180,
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: theme.palette.mode === 'dark' ? '#252525' : 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {user?.name || 'User'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => navigate('/settings')}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Settings</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
          
          <Menu
            anchorEl={notificationAnchorEl}
            open={Boolean(notificationAnchorEl)}
            onClose={handleNotificationMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1.5,
                borderRadius: 2,
                minWidth: 320,
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: theme.palette.mode === 'dark' ? '#252525' : 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Notifications
              </Typography>
              <Typography variant="caption" color="primary" sx={{ cursor: 'pointer' }}>
                Mark all as read
              </Typography>
            </Box>
            <Divider />
            <MenuItem sx={{ 
              py: 1.5, 
              borderLeft: '4px solid',
              borderColor: 'error.main',
              bgcolor: alpha(theme.palette.error.main, 0.05)
            }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  High-risk phishing email detected
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  A new email from security@accounts.google.com has been flagged
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  2 minutes ago
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem sx={{ 
              py: 1.5, 
              borderLeft: '4px solid',
              borderColor: 'warning.main',
              bgcolor: alpha(theme.palette.warning.main, 0.05)
            }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Suspicious link detected
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Email from newsletter@updates.com contains suspicious links
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  1 hour ago
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem sx={{ py: 1.5 }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Email sync completed
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Successfully synced 24 new emails
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  3 hours ago
                </Typography>
              </Box>
            </MenuItem>
            <Divider />
            <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
              <Button color="primary" size="small">
                View All Notifications
              </Button>
            </Box>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#f8f9fa',
          minHeight: '100vh'
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 