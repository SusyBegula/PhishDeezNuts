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
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Build as BuildIcon,
  Storage as StorageIcon,
  Security as SecurityIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Settings = () => {
  const [modelStatus, setModelStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retraining, setRetraining] = useState(false);
  const [settings, setSettings] = useState({
    autoAnalyze: true,
    useAI: true,
    useML: true,
    useRules: true,
  });

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

  const handleSettingChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  // These settings would normally be saved to the backend
  const saveSettings = () => {
    alert('Settings saved successfully!');
    // In a real app, you would save these to the backend
    // axios.post(`${API_URL}/api/settings`, settings);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Grid container spacing={3}>
        {/* ML Model Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <StorageIcon sx={{ mr: 1 }} />
                <Typography variant="h6">
                  ML Model Status
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              {modelStatus ? (
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Model Exists" 
                      secondary={modelStatus.model_exists ? "Yes" : "No"} 
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemText 
                      primary="Last Trained" 
                      secondary={modelStatus.metadata?.trained_at || "Never"} 
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemText 
                      primary="Accuracy" 
                      secondary={modelStatus.metadata?.accuracy ? 
                        `${(parseFloat(modelStatus.metadata.accuracy) * 100).toFixed(2)}%` : 
                        "Unknown"} 
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemText 
                      primary="F1 Score" 
                      secondary={modelStatus.metadata?.f1_score || "Unknown"} 
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemText 
                      primary="Training Samples" 
                      secondary={modelStatus.metadata?.samples || "Unknown"} 
                    />
                  </ListItem>
                </List>
              ) : (
                <Alert severity="warning">
                  Could not retrieve model status
                </Alert>
              )}
              
              <Button
                variant="contained"
                color="primary"
                startIcon={<RefreshIcon />}
                onClick={handleRetrainModel}
                disabled={retraining}
                fullWidth
                sx={{ mt: 2 }}
              >
                {retraining ? 'Retraining...' : 'Retrain Model'}
              </Button>
              
              <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                Retraining may take several minutes depending on the dataset size.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Detection Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SecurityIcon sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Detection Settings
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <InfoIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Auto-analyze new emails" 
                    secondary="Automatically analyze emails when syncing" 
                  />
                  <Switch
                    edge="end"
                    checked={settings.autoAnalyze}
                    onChange={() => handleSettingChange('autoAnalyze')}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <StorageIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Use ML Model" 
                    secondary="Use machine learning for detection" 
                  />
                  <Switch
                    edge="end"
                    checked={settings.useML}
                    onChange={() => handleSettingChange('useML')}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <BuildIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Use AI Analysis" 
                    secondary="Use Gemini AI for detection" 
                  />
                  <Switch
                    edge="end"
                    checked={settings.useAI}
                    onChange={() => handleSettingChange('useAI')}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <SecurityIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Use Rule-based Detection" 
                    secondary="Use predefined rules for detection" 
                  />
                  <Switch
                    edge="end"
                    checked={settings.useRules}
                    onChange={() => handleSettingChange('useRules')}
                  />
                </ListItem>
              </List>
              
              <Button
                variant="contained"
                color="primary"
                onClick={saveSettings}
                fullWidth
                sx={{ mt: 2 }}
              >
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        {/* About */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              About PhishDeezNuts
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Typography variant="body1" paragraph>
              PhishDeezNuts is a phishing email detection tool that uses machine learning, AI, and rule-based approaches to identify potentially malicious emails.
            </Typography>
            
            <Typography variant="body2" color="textSecondary">
              Version: 1.0.0
            </Typography>
            <Typography variant="body2" color="textSecondary">
              © {new Date().getFullYear()} PhishDeezNuts. All rights reserved.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings; 