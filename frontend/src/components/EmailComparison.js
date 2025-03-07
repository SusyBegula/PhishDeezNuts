import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  Divider, 
  Button, 
  IconButton, 
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  CompareArrows as CompareIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Link as LinkIcon
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';
import { getEmailById } from '../services/emailService';

const EmailComparison = ({ emailIds, onClose }) => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        setLoading(true);
        const emailPromises = emailIds.map(id => getEmailById(id));
        const emailsData = await Promise.all(emailPromises);
        setEmails(emailsData);
      } catch (error) {
        console.error('Error fetching emails for comparison:', error);
        setError('Failed to load emails for comparison');
      } finally {
        setLoading(false);
      }
    };

    if (emailIds.length > 0) {
      fetchEmails();
    }
  }, [emailIds]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const renderPhishingScore = (score) => {
    const color = score > 70 ? 'error' : score > 40 ? 'warning' : 'success';
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ position: 'relative', display: 'inline-flex', mr: 1 }}>
          <CircularProgress
            variant="determinate"
            value={score}
            color={color}
            size={24}
            thickness={5}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.6rem',
              fontWeight: 'bold'
            }}
          >
            {`${Math.round(score)}%`}
          </Box>
        </Box>
        <Typography variant="body2">
          {score > 70 ? 'High' : score > 40 ? 'Medium' : 'Low'}
        </Typography>
      </Box>
    );
  };

  const renderAuthStatus = (status) => {
    return status === true ? (
      <Chip size="small" icon={<CheckCircleIcon />} label="Pass" color="success" />
    ) : status === false ? (
      <Chip size="small" icon={<WarningIcon />} label="Fail" color="error" />
    ) : (
      <Chip size="small" label="Unknown" />
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography color="error">{error}</Typography>
        <Button variant="outlined" onClick={onClose} sx={{ mt: 2 }}>
          Close Comparison
        </Button>
      </Paper>
    );
  }

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        mb: 3, 
        backgroundColor: isDarkMode ? '#272727' : '#ffffff',
        border: `1px solid ${isDarkMode ? '#444' : '#e0e0e0'}`,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
          <CompareIcon sx={{ mr: 1 }} /> Email Comparison
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      {emails.length === 0 ? (
        <Typography>No emails selected for comparison</Typography>
      ) : (
        <>
          {/* Basic Info Comparison */}
          <TableContainer component={Paper} sx={{ mb: 3, backgroundColor: isDarkMode ? '#333' : '#f5f5f5' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Attribute</TableCell>
                  {emails.map((email, index) => (
                    <TableCell key={index} sx={{ fontWeight: 'bold' }}>
                      Email {index + 1}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Subject</TableCell>
                  {emails.map((email, index) => (
                    <TableCell key={index}>{email.subject || '(No Subject)'}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Sender</TableCell>
                  {emails.map((email, index) => (
                    <TableCell key={index}>{email.sender}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Recipient</TableCell>
                  {emails.map((email, index) => (
                    <TableCell key={index}>{email.recipient}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  {emails.map((email, index) => (
                    <TableCell key={index}>{formatDate(email.received_date)}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Phishing Status</TableCell>
                  {emails.map((email, index) => (
                    <TableCell key={index}>
                      <Chip
                        icon={email.is_phishing ? <WarningIcon /> : <CheckCircleIcon />}
                        label={email.is_phishing ? 'Phishing' : 'Safe'}
                        color={email.is_phishing ? 'error' : 'success'}
                        size="small"
                      />
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Phishing Score</TableCell>
                  {emails.map((email, index) => (
                    <TableCell key={index}>
                      {renderPhishingScore(email.phishing_score)}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Detection Method</TableCell>
                  {emails.map((email, index) => (
                    <TableCell key={index}>
                      {email.detection_method === 'ml' ? 'Machine Learning' : 
                       email.detection_method === 'ai' ? 'AI Analysis' : 
                       email.detection_method === 'rules' ? 'Rule-based' : 'None'}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Authentication Comparison */}
          <Typography variant="h6" gutterBottom>
            Authentication Comparison
          </Typography>
          <TableContainer component={Paper} sx={{ mb: 3, backgroundColor: isDarkMode ? '#333' : '#f5f5f5' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Authentication</TableCell>
                  {emails.map((email, index) => (
                    <TableCell key={index} sx={{ fontWeight: 'bold' }}>
                      Email {index + 1}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>SPF</TableCell>
                  {emails.map((email, index) => (
                    <TableCell key={index}>
                      {renderAuthStatus(email.spf_pass)}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>DKIM</TableCell>
                  {emails.map((email, index) => (
                    <TableCell key={index}>
                      {renderAuthStatus(email.dkim_pass)}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>DMARC</TableCell>
                  {emails.map((email, index) => (
                    <TableCell key={index}>
                      {renderAuthStatus(email.dmarc_pass)}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Links Comparison */}
          <Typography variant="h6" gutterBottom>
            Links Comparison
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {emails.map((email, index) => {
              const links = email.links ? JSON.parse(email.links) : [];
              return (
                <Grid item xs={12} md={6 / emails.length} key={index}>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      height: '100%',
                      backgroundColor: isDarkMode ? '#333' : '#f5f5f5'
                    }}
                  >
                    <Typography variant="subtitle1" gutterBottom>
                      Email {index + 1} Links
                    </Typography>
                    {links.length === 0 ? (
                      <Typography variant="body2">No links found</Typography>
                    ) : (
                      <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                        {links.map((link, linkIndex) => (
                          <Box component="li" key={linkIndex} sx={{ mb: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <LinkIcon fontSize="small" sx={{ mr: 1 }} />
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  wordBreak: 'break-all',
                                  color: link.suspicious ? 'error.main' : 'inherit'
                                }}
                              >
                                {link.url}
                                {link.suspicious && (
                                  <Tooltip title="Suspicious Link">
                                    <WarningIcon 
                                      fontSize="small" 
                                      color="error" 
                                      sx={{ ml: 1, verticalAlign: 'middle' }} 
                                    />
                                  </Tooltip>
                                )}
                              </Typography>
                            </Box>
                            {link.displayText && link.displayText !== link.url && (
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  display: 'block', 
                                  ml: 4,
                                  color: 'text.secondary'
                                }}
                              >
                                Display text: {link.displayText}
                              </Typography>
                            )}
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
          
          {/* Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={onClose}
              startIcon={<CloseIcon />}
            >
              Close Comparison
            </Button>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default EmailComparison; 