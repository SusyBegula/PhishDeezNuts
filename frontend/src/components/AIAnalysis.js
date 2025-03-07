import React, { useState } from 'react';
import { analyzeEmailWithAI } from '../services/emailService';
import { Box, Button, Typography, Paper, CircularProgress, Alert, AlertTitle, Divider, useTheme } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const AIAnalysis = ({ emailId }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [error, setError] = useState(null);
  const [statusMessages, setStatusMessages] = useState([]);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysis('');
    setError(null);
    setStatusMessages([]);

    await analyzeEmailWithAI(
      emailId,
      (chunk) => {
        // Check if this is a status message
        if (chunk.includes('Trying model:') || 
            chunk.includes('Successfully connected') || 
            chunk.includes('Model') || 
            chunk.includes('failed') ||
            chunk.includes('Starting analysis') ||
            chunk.includes('Streaming failed')) {
          setStatusMessages(prev => [...prev, chunk]);
        } else {
          setAnalysis(prev => prev + chunk);
        }
      },
      (error) => {
        setError(error);
        setIsAnalyzing(false);
      },
      () => {
        setIsAnalyzing(false);
      }
    );
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAnalyze}
        disabled={isAnalyzing}
        startIcon={isAnalyzing ? <CircularProgress size={20} color="inherit" /> : null}
        sx={{ mb: 2 }}
      >
        {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
      </Button>

      {statusMessages.length > 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <AlertTitle>Status</AlertTitle>
          {statusMessages.map((msg, index) => (
            <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
              {msg}
            </Typography>
          ))}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <AlertTitle>Analysis Error</AlertTitle>
          {error}
        </Alert>
      )}

      {analysis && (
        <Paper 
          elevation={3}
          sx={{ 
            p: 3, 
            maxHeight: 500, 
            overflow: 'auto',
            backgroundColor: isDarkMode ? '#272727' : '#fafafa',
            border: `1px solid ${isDarkMode ? '#444' : '#e0e0e0'}`,
            borderRadius: 2
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2,
            pb: 1,
            borderBottom: `1px solid ${isDarkMode ? '#444' : '#e0e0e0'}`
          }}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                color: isDarkMode ? theme.palette.primary.light : theme.palette.primary.main
              }}
            >
              AI Analysis
            </Typography>
          </Box>
          
          <Box className="markdown-content" sx={{ 
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              fontWeight: 'bold',
              mt: 2,
              mb: 1,
              color: isDarkMode ? '#fff' : '#333'
            },
            '& h1': { fontSize: '1.8rem' },
            '& h2': { fontSize: '1.5rem' },
            '& h3': { fontSize: '1.3rem' },
            '& h4': { fontSize: '1.1rem' },
            '& p': {
              mb: 1.5,
              lineHeight: 1.6
            },
            '& ul, & ol': {
              pl: 2,
              mb: 1.5
            },
            '& li': {
              mb: 0.5
            },
            '& strong': {
              fontWeight: 'bold',
              color: isDarkMode ? theme.palette.primary.light : theme.palette.primary.main
            },
            '& em': {
              fontStyle: 'italic'
            },
            '& table': {
              borderCollapse: 'collapse',
              width: '100%',
              mb: 2
            },
            '& th, & td': {
              border: `1px solid ${isDarkMode ? '#444' : '#ddd'}`,
              p: 1
            },
            '& th': {
              backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
              fontWeight: 'bold'
            },
            '& blockquote': {
              borderLeft: `4px solid ${isDarkMode ? theme.palette.primary.light : theme.palette.primary.main}`,
              pl: 2,
              fontStyle: 'italic',
              my: 1,
              py: 0.5,
              backgroundColor: isDarkMode ? 'rgba(25, 118, 210, 0.1)' : 'rgba(25, 118, 210, 0.05)'
            },
            '& code': {
              fontFamily: 'monospace',
              backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
              p: 0.5,
              borderRadius: 1
            },
            '& pre': {
              backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
              p: 1.5,
              borderRadius: 1,
              overflow: 'auto',
              mb: 1.5
            },
            '& a': {
              color: isDarkMode ? theme.palette.primary.light : theme.palette.primary.main,
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            }
          }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {analysis}
            </ReactMarkdown>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default AIAnalysis; 