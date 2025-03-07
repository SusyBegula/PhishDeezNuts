import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
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
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Link as LinkIcon,
  Attachment as AttachmentIcon,
  Refresh as RefreshIcon,
  Security as SecurityIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { getEmailById, analyzeEmail } from '../services/emailService';
import AIAnalysis from '../components/AIAnalysis';

const EmailDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        setLoading(true);
        const data = await getEmailById(parseInt(id));
        setEmail(data);
      } catch (error) {
        console.error('Error fetching email:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmail();
  }, [id]);

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);
      const result = await analyzeEmail(parseInt(id));
      setEmail(prev => ({ ...prev, ...result }));
    } catch (error) {
      console.error('Error analyzing email:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const renderPhishingScore = (score) => {
    const color = score > 70 ? 'error' : score > 40 ? 'warning' : 'success';
    const severity = score > 70 ? 'error' : score > 40 ? 'warning' : 'success';
    
    return (
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
          variant="determinate"
          value={score}
          color={color}
          size={80}
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
          }}
        >
          <Typography variant="h6" component="div" color={`${severity}.main`}>
            {`${Math.round(score)}%`}
          </Typography>
        </Box>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!email) {
    return (
      <Box sx={{ p: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
          Back to Dashboard
        </Button>
        <Alert severity="error">Email not found</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mr: 2 }}>
          Back
        </Button>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          Email Details
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={handleAnalyze}
          disabled={analyzing}
          sx={{ ml: 2 }}
        >
          {analyzing ? 'Analyzing...' : 'Re-analyze'}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Email Header */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                {email.subject || '(No Subject)'}
              </Typography>
              <Chip
                icon={email.is_phishing ? <WarningIcon /> : <CheckCircleIcon />}
                label={email.is_phishing ? 'Phishing' : 'Safe'}
                color={email.is_phishing ? 'error' : 'success'}
                sx={{ ml: 2 }}
              />
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">
                  From: {email.sender}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  To: {email.recipient}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Date: {formatDate(email.received_date)}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" color="textSecondary" sx={{ mr: 1 }}>
                    SPF:
                  </Typography>
                  {email.spf_pass === true ? (
                    <Chip size="small" icon={<CheckCircleIcon />} label="Pass" color="success" />
                  ) : email.spf_pass === false ? (
                    <Chip size="small" icon={<CancelIcon />} label="Fail" color="error" />
                  ) : (
                    <Chip size="small" label="Unknown" />
                  )}
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ mr: 1 }}>
                    DKIM:
                  </Typography>
                  {email.dkim_pass === true ? (
                    <Chip size="small" icon={<CheckCircleIcon />} label="Pass" color="success" />
                  ) : email.dkim_pass === false ? (
                    <Chip size="small" icon={<CancelIcon />} label="Fail" color="error" />
                  ) : (
                    <Chip size="small" label="Unknown" />
                  )}
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ mr: 1 }}>
                    DMARC:
                  </Typography>
                  {email.dmarc_pass === true ? (
                    <Chip size="small" icon={<CheckCircleIcon />} label="Pass" color="success" />
                  ) : email.dmarc_pass === false ? (
                    <Chip size="small" icon={<CancelIcon />} label="Fail" color="error" />
                  ) : (
                    <Chip size="small" label="Unknown" />
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Phishing Analysis */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Phishing Analysis
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                {renderPhishingScore(email.phishing_score)}
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Detection Method: {email.detection_method === 'ml' ? 'Machine Learning' : 
                                    email.detection_method === 'ai' ? 'AI Analysis' : 
                                    email.detection_method === 'rules' ? 'Rule-based' : 'None'}
                </Typography>
              </Box>
              
              {email.is_phishing && email.analysis_result && (
                <Box>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    Key Indicators:
                  </Typography>
                  
                  <List dense>
                    {email.analysis_result.ai_analysis?.key_indicators?.map((indicator, index) => (
                      <ListItem key={index} sx={{ py: 0 }}>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <WarningIcon color="error" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={indicator} />
                      </ListItem>
                    ))}
                    
                    {email.analysis_result.rule_analysis?.indicators?.map((indicator, index) => (
                      <ListItem key={`rule-${index}`} sx={{ py: 0 }}>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <SecurityIcon color="warning" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={indicator} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Email Content */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Email Content
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {email.body_html ? (
              <Box 
                sx={{ 
                  mt: 2, 
                  p: 2, 
                  border: '1px solid #e0e0e0', 
                  borderRadius: 1,
                  maxHeight: 500,
                  overflow: 'auto'
                }}
                dangerouslySetInnerHTML={{ __html: email.body_html }}
              />
            ) : (
              <Box 
                sx={{ 
                  mt: 2, 
                  p: 2, 
                  border: '1px solid #e0e0e0', 
                  borderRadius: 1,
                  whiteSpace: 'pre-wrap',
                  maxHeight: 500,
                  overflow: 'auto'
                }}
              >
                {email.body_text || '(No content)'}
              </Box>
            )}
            
            <Divider sx={{ my: 2 }} />
            <AIAnalysis emailId={parseInt(id)} />
          </Paper>
        </Grid>

        {/* Links and Attachments */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Links */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Links
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {email.links && email.links.length > 0 ? (
                  <List>
                    {email.links.map((link, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <LinkIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={link.text || link.url}
                          secondary={link.url}
                          secondaryTypographyProps={{ 
                            sx: { 
                              wordBreak: 'break-all',
                              color: email.is_phishing ? 'error.main' : 'inherit'
                            } 
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No links found in this email
                  </Typography>
                )}
              </Grid>
              
              {/* Attachments */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Attachments
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {email.has_attachment && email.attachment_info && email.attachment_info.length > 0 ? (
                  <List>
                    {email.attachment_info.map((attachment, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <AttachmentIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={attachment.filename}
                          secondary={`${attachment.content_type} (${Math.round(attachment.size / 1024)} KB)`}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No attachments found in this email
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmailDetail; 