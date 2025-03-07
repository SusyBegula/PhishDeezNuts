import React, { useState } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  KeyboardArrowDown as ArrowDownIcon,
  Delete as DeleteIcon,
  Compare as CompareIcon,
  Archive as ArchiveIcon,
  Label as LabelIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

const BulkActions = ({ selectedEmails, onAction, onCompare }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: null });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleActionClick = (action) => {
    handleClose();
    
    // Actions that need confirmation
    if (['delete', 'markSafe', 'markPhishing'].includes(action)) {
      setConfirmDialog({
        open: true,
        action
      });
      return;
    }
    
    // Actions that execute immediately
    if (action === 'compare') {
      if (selectedEmails.length < 2) {
        setSnackbar({
          open: true,
          message: 'Please select at least 2 emails to compare',
          severity: 'warning'
        });
        return;
      }
      
      if (selectedEmails.length > 3) {
        setSnackbar({
          open: true,
          message: 'You can compare up to 3 emails at a time',
          severity: 'warning'
        });
        return;
      }
      
      onCompare(selectedEmails);
      return;
    }
    
    // Other actions
    executeAction(action);
  };
  
  const handleConfirm = () => {
    executeAction(confirmDialog.action);
    setConfirmDialog({ open: false, action: null });
  };
  
  const handleCancel = () => {
    setConfirmDialog({ open: false, action: null });
  };
  
  const executeAction = async (action) => {
    setLoading(true);
    
    try {
      await onAction(action, selectedEmails);
      
      let message = '';
      switch (action) {
        case 'delete':
          message = `Deleted ${selectedEmails.length} email(s)`;
          break;
        case 'archive':
          message = `Archived ${selectedEmails.length} email(s)`;
          break;
        case 'markSafe':
          message = `Marked ${selectedEmails.length} email(s) as safe`;
          break;
        case 'markPhishing':
          message = `Marked ${selectedEmails.length} email(s) as phishing`;
          break;
        case 'reanalyze':
          message = `Reanalyzed ${selectedEmails.length} email(s)`;
          break;
        default:
          message = `Action completed on ${selectedEmails.length} email(s)`;
      }
      
      setSnackbar({
        open: true,
        message,
        severity: 'success'
      });
    } catch (error) {
      console.error(`Error executing action ${action}:`, error);
      setSnackbar({
        open: true,
        message: `Error: ${error.message || 'Failed to execute action'}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  const getConfirmationMessage = () => {
    switch (confirmDialog.action) {
      case 'delete':
        return `Are you sure you want to delete ${selectedEmails.length} email(s)? This action cannot be undone.`;
      case 'markSafe':
        return `Are you sure you want to mark ${selectedEmails.length} email(s) as safe?`;
      case 'markPhishing':
        return `Are you sure you want to mark ${selectedEmails.length} email(s) as phishing?`;
      default:
        return 'Are you sure you want to proceed?';
    }
  };
  
  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleClick}
          endIcon={<ArrowDownIcon />}
          disabled={selectedEmails.length === 0 || loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Processing...' : `Actions (${selectedEmails.length} selected)`}
        </Button>
        
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => handleActionClick('compare')}>
            <ListItemIcon>
              <CompareIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Compare Emails</ListItemText>
          </MenuItem>
          
          <MenuItem onClick={() => handleActionClick('reanalyze')}>
            <ListItemIcon>
              <RefreshIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Reanalyze</ListItemText>
          </MenuItem>
          
          <MenuItem onClick={() => handleActionClick('markSafe')}>
            <ListItemIcon>
              <CheckCircleIcon fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText>Mark as Safe</ListItemText>
          </MenuItem>
          
          <MenuItem onClick={() => handleActionClick('markPhishing')}>
            <ListItemIcon>
              <WarningIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Mark as Phishing</ListItemText>
          </MenuItem>
          
          <MenuItem onClick={() => handleActionClick('archive')}>
            <ListItemIcon>
              <ArchiveIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Archive</ListItemText>
          </MenuItem>
          
          <MenuItem onClick={() => handleActionClick('delete')}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
      
      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={handleCancel}
      >
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {getConfirmationMessage()}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            color="primary" 
            variant="contained" 
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default BulkActions; 