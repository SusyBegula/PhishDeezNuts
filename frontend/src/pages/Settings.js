import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  CardContent,
  Alert,
  Switch,
  FormControlLabel,
  Grid,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Snackbar,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Build as BuildIcon,
  Storage as StorageIcon,
  Security as SecurityIcon,
  Info as InfoIcon,
  Notifications as NotificationsIcon,
  Visibility as VisibilityIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Mock function to save settings
const saveUserSettings = async (settings) => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.setItem('userSettings', JSON.stringify(settings));
      resolve({ success: true });
    }, 1000);
  });
};

// Mock function to get settings
const getUserSettings = async () => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const settings = localStorage.getItem('userSettings');
      resolve(settings ? JSON.parse(settings) : defaultSettings);
    }, 500);
  });
};

// Default settings
const defaultSettings = {
  notifications: {
    emailAlerts: true,
    browserNotifications: false,
    alertThreshold: 70
  },
  display: {
    emailsPerPage: 20,
    defaultSort: 'date',
    compactView: false
  },
  security: {
    autoAnalyze: true,
    linkProtection: true
  }
};

const Settings = () => {
  const [modelStatus, setModelStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retraining, setRetraining] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchModelStatus = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/model/status`);
        setModelStatus(response.data);
      } catch (error) {
        console.error('Error fetching model status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModelStatus();
  }, []);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const userSettings = await getUserSettings();
        setSettings(userSettings);
      } catch (error) {
        console.error('Error loading settings:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load settings',
          severity: 'error'
        });
      }
    };

    loadSettings();
  }, []);

  const handleRetrainModel = async () => {
    try {
      setRetraining(true);
      const response = await axios.post(`${API_URL}/api/model/retrain`);
      setModelStatus(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          accuracy: response.data.accuracy,
          f1_score: response.data.f1_score,
          trained_at: new Date().toISOString(),
        }
      }));
      
      // Show success message
      alert('Model retrained successfully!');
    } catch (error) {
      console.error('Error retraining model:', error);
      alert('Error retraining model. Please try again.');
    } finally {
      setRetraining(false);
    }
  };

  const handleSettingChange = (category, setting, value) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [setting]: value
      }
    });
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      await saveUserSettings(settings);
      setSnackbar({
        open: true,
        message: 'Settings saved successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save settings',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleResetSettings = () => {
    setSettings(defaultSettings);
    setSnackbar({
      open: true,
      message: 'Settings reset to defaults',
      severity: 'info'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      
      {/* Appearance Settings */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <VisibilityIcon sx={{ mr: 1 }} /> Appearance
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Theme
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography sx={{ mr: 2 }}>
                    Dark Mode
                  </Typography>
                  <ThemeToggle />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Toggle between light and dark theme
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Display Options
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.display.compactView}
                      onChange={(e) => handleSettingChange('display', 'compactView', e.target.checked)}
                    />
                  }
                  label="Compact View"
                />
                
                <Box sx={{ mt: 2 }}>
                  <Typography gutterBottom>
                    Emails Per Page: {settings.display.emailsPerPage}
                  </Typography>
                  <Slider
                    value={settings.display.emailsPerPage}
                    onChange={(e, value) => handleSettingChange('display', 'emailsPerPage', value)}
                    valueLabelDisplay="auto"
                    step={5}
                    marks
                    min={5}
                    max={50}
                  />
                </Box>
                
                <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                  <InputLabel>Default Sort</InputLabel>
                  <Select
                    value={settings.display.defaultSort}
                    onChange={(e) => handleSettingChange('display', 'defaultSort', e.target.value)}
                    label="Default Sort"
                  >
                    <MenuItem value="date">Date (Newest First)</MenuItem>
                    <MenuItem value="date_asc">Date (Oldest First)</MenuItem>
                    <MenuItem value="phishing_score">Phishing Score (High to Low)</MenuItem>
                    <MenuItem value="phishing_score_asc">Phishing Score (Low to High)</MenuItem>
                    <MenuItem value="sender">Sender (A-Z)</MenuItem>
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Notification Settings */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <NotificationsIcon sx={{ mr: 1 }} /> Notifications
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.emailAlerts}
                  onChange={(e) => handleSettingChange('notifications', 'emailAlerts', e.target.checked)}
                />
              }
              label="Email Alerts"
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
              Receive email notifications for high-risk phishing emails
            </Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.browserNotifications}
                  onChange={(e) => handleSettingChange('notifications', 'browserNotifications', e.target.checked)}
                />
              }
              label="Browser Notifications"
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
              Receive browser notifications for high-risk phishing emails
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography gutterBottom>
              Phishing Alert Threshold: {settings.notifications.alertThreshold}%
            </Typography>
            <Slider
              value={settings.notifications.alertThreshold}
              onChange={(e, value) => handleSettingChange('notifications', 'alertThreshold', value)}
              valueLabelDisplay="auto"
              step={5}
              marks
              min={0}
              max={100}
            />
            <Typography variant="body2" color="text.secondary">
              You will be alerted when an email's phishing score exceeds this threshold
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Security Settings */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <SecurityIcon sx={{ mr: 1 }} /> Security
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.security.autoAnalyze}
                  onChange={(e) => handleSettingChange('security', 'autoAnalyze', e.target.checked)}
                />
              }
              label="Auto-Analyze Emails"
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
              Automatically analyze new emails for phishing
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.security.linkProtection}
                  onChange={(e) => handleSettingChange('security', 'linkProtection', e.target.checked)}
                />
              }
              label="Link Protection"
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
              Check links against known phishing databases
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
        <Button 
          variant="outlined" 
          color="secondary" 
          onClick={handleResetSettings}
          startIcon={<DeleteIcon />}
          sx={{ mr: 2 }}
        >
          Reset to Defaults
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSaveSettings}
          startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </Box>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings; 