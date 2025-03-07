import React from 'react';
import { Box, Paper, Typography, Grid, CircularProgress, Divider } from '@mui/material';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { useTheme } from '../contexts/ThemeContext';

const DashboardStats = ({ stats }) => {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? 'dark' : 'light';
  
  // Colors for charts
  const colors = {
    safe: '#4caf50',
    phishing: '#f44336',
    suspicious: '#ff9800',
    primary: '#1976d2',
    secondary: '#9c27b0',
    background: isDarkMode ? '#272727' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#333333',
    grid: isDarkMode ? '#444444' : '#e0e0e0'
  };

  // Sample data - replace with actual data from props
  const data = stats || {
    emailCount: 0,
    phishingCount: 0,
    safeCount: 0,
    suspiciousCount: 0,
    detectionMethods: [
      { name: 'Machine Learning', value: 0 },
      { name: 'Rule-based', value: 0 },
      { name: 'AI Analysis', value: 0 }
    ],
    timeData: [
      { name: 'Last 7 Days', phishing: 0, safe: 0 },
      { name: 'Last 30 Days', phishing: 0, safe: 0 },
      { name: 'All Time', phishing: 0, safe: 0 }
    ]
  };

  const pieData = [
    { name: 'Safe', value: data.safeCount, color: colors.safe },
    { name: 'Phishing', value: data.phishingCount, color: colors.phishing },
    { name: 'Suspicious', value: data.suspiciousCount, color: colors.suspicious }
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Dashboard Analytics
      </Typography>
      
      <Grid container spacing={3}>
        {/* Email Count Stats */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              height: '100%',
              backgroundColor: colors.background,
              border: `1px solid ${colors.grid}`
            }}
          >
            <Typography variant="h6" gutterBottom>
              Email Statistics
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', my: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {data.emailCount}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Emails
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: colors.phishing }}>
                  {data.phishingCount}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Phishing
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: colors.safe }}>
                  {data.safeCount}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Safe
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ mt: 4, height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} emails`, 'Count']}
                    contentStyle={{ 
                      backgroundColor: colors.background,
                      borderColor: colors.grid
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        {/* Detection Methods */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              height: '100%',
              backgroundColor: colors.background,
              border: `1px solid ${colors.grid}`
            }}
          >
            <Typography variant="h6" gutterBottom>
              Detection Methods
            </Typography>
            <Box sx={{ mt: 2, height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.detectionMethods}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                  <XAxis type="number" stroke={colors.text} />
                  <YAxis dataKey="name" type="category" stroke={colors.text} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: colors.background,
                      borderColor: colors.grid,
                      color: colors.text
                    }}
                  />
                  <Legend />
                  <Bar dataKey="value" name="Emails Detected" fill={colors.primary} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        {/* Time-based Analysis */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              height: '100%',
              backgroundColor: colors.background,
              border: `1px solid ${colors.grid}`
            }}
          >
            <Typography variant="h6" gutterBottom>
              Time Analysis
            </Typography>
            <Box sx={{ mt: 2, height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.timeData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                  <XAxis dataKey="name" stroke={colors.text} />
                  <YAxis stroke={colors.text} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: colors.background,
                      borderColor: colors.grid
                    }}
                  />
                  <Legend />
                  <Bar dataKey="phishing" name="Phishing" fill={colors.phishing} />
                  <Bar dataKey="safe" name="Safe" fill={colors.safe} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardStats; 