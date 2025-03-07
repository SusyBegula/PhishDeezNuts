import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { 
  Email as EmailIcon, 
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { getEmails, getEmailStats } from '../services/emailService';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();
  const [emails, setEmails] = useState([]);
  const [stats, setStats] = useState({
    total_emails: 0,
    phishing_emails: 0,
    phishing_percentage: 0,
    detection_methods: {
      ml: 0,
      ai: 0,
      rules: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filter, setFilter] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch emails
        const filters = filter !== null ? { is_phishing: filter } : {};
        const emailsData = await getEmails(page + 1, rowsPerPage, filters);
        setEmails(emailsData.emails || []);
        
        // Fetch stats
        const statsData = await getEmailStats();
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, rowsPerPage, filter]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEmailClick = (id) => {
    navigate(`/email/${id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Chart data
  const chartData = {
    labels: ['Safe Emails', 'Phishing Emails'],
    datasets: [
      {
        data: [stats.total_emails - stats.phishing_emails, stats.phishing_emails],
        backgroundColor: ['#4caf50', '#f44336'],
        borderWidth: 1,
      },
    ],
  };

  // Detection methods chart
  const detectionMethodsData = {
    labels: ['ML Model', 'AI Analysis', 'Rule-based'],
    datasets: [
      {
        data: [
          stats.detection_methods.ml,
          stats.detection_methods.ai,
          stats.detection_methods.rules
        ],
        backgroundColor: ['#2196f3', '#9c27b0', '#ff9800'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Email Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Emails
              </Typography>
              <Typography variant="h4" component="div">
                {stats.total_emails}
              </Typography>
              <EmailIcon color="primary" sx={{ fontSize: 40, mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Phishing Emails
              </Typography>
              <Typography variant="h4" component="div">
                {stats.phishing_emails}
              </Typography>
              <WarningIcon color="error" sx={{ fontSize: 40, mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Safe Emails
              </Typography>
              <Typography variant="h4" component="div">
                {stats.total_emails - stats.phishing_emails}
              </Typography>
              <CheckCircleIcon color="success" sx={{ fontSize: 40, mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Phishing Rate
              </Typography>
              <Typography variant="h4" component="div">
                {stats.phishing_percentage.toFixed(1)}%
              </Typography>
              <Box sx={{ mt: 1, height: 40 }}>
                <Box
                  sx={{
                    height: 8,
                    borderRadius: 5,
                    bgcolor: '#e0e0e0',
                    position: 'relative',
                    mt: 2,
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      borderRadius: 5,
                      bgcolor: stats.phishing_percentage > 50 ? 'error.main' : 
                               stats.phishing_percentage > 20 ? 'warning.main' : 'success.main',
                      width: `${Math.min(stats.phishing_percentage, 100)}%`,
                    }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Email Safety Overview
            </Typography>
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
              {stats.total_emails > 0 ? (
                <Pie data={chartData} options={{ maintainAspectRatio: false }} />
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <Typography variant="body1" color="textSecondary">
                    No email data available
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Detection Methods
            </Typography>
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
              {stats.phishing_emails > 0 ? (
                <Pie data={detectionMethodsData} options={{ maintainAspectRatio: false }} />
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <Typography variant="body1" color="textSecondary">
                    No phishing emails detected
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Email List */}
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Recent Emails
          </Typography>
          <Box>
            <Button 
              variant={filter === null ? "contained" : "outlined"} 
              size="small" 
              onClick={() => setFilter(null)}
              sx={{ mr: 1 }}
            >
              All
            </Button>
            <Button 
              variant={filter === true ? "contained" : "outlined"} 
              color="error"
              size="small" 
              onClick={() => setFilter(true)}
              sx={{ mr: 1 }}
            >
              Phishing
            </Button>
            <Button 
              variant={filter === false ? "contained" : "outlined"} 
              color="success"
              size="small" 
              onClick={() => setFilter(false)}
            >
              Safe
            </Button>
          </Box>
        </Box>
        <Divider />
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Sender</TableCell>
                    <TableCell>Subject</TableCell>
                    <TableCell>Received</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Score</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {emails.length > 0 ? (
                    emails.map((email) => (
                      <TableRow
                        key={email.id}
                        hover
                        onClick={() => handleEmailClick(email.id)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell>{email.sender}</TableCell>
                        <TableCell>{email.subject || '(No Subject)'}</TableCell>
                        <TableCell>{formatDate(email.received_date)}</TableCell>
                        <TableCell>
                          <Chip
                            label={email.is_phishing ? 'Phishing' : 'Safe'}
                            color={email.is_phishing ? 'error' : 'success'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {email.is_phishing ? `${email.phishing_score.toFixed(1)}%` : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography variant="body1" sx={{ py: 2 }}>
                          No emails found
                        </Typography>
                        <Button
                          variant="outlined"
                          startIcon={<RefreshIcon />}
                          onClick={() => window.location.reload()}
                        >
                          Refresh
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={-1} // We don't know the total count
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>
    </Box>
  );
};

export default Dashboard; 