import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Chip,
  Slider,
  Collapse,
  IconButton,
  Divider,
  Autocomplete
} from '@mui/material';
import { 
  Search as SearchIcon, 
  FilterList as FilterIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const AdvancedSearch = ({ onSearch }) => {
  const [expanded, setExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    phishingStatus: 'all', // 'all', 'phishing', 'safe', 'suspicious'
    dateFrom: null,
    dateTo: null,
    sender: '',
    recipient: '',
    phishingScoreRange: [0, 100],
    detectionMethod: 'all', // 'all', 'ml', 'rules', 'ai'
    hasAttachment: 'all', // 'all', 'yes', 'no'
    tags: []
  });

  // Sample tags for autocomplete
  const availableTags = [
    'Important', 'Urgent', 'Work', 'Personal', 'Financial', 
    'Social Media', 'Shopping', 'Travel', 'Suspicious', 'Reviewed'
  ];

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value
    });
  };

  const handleSliderChange = (event, newValue) => {
    handleFilterChange('phishingScoreRange', newValue);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({
      phishingStatus: 'all',
      dateFrom: null,
      dateTo: null,
      sender: '',
      recipient: '',
      phishingScoreRange: [0, 100],
      detectionMethod: 'all',
      hasAttachment: 'all',
      tags: []
    });
  };

  const handleSearch = () => {
    // Combine search term and filters
    const searchParams = {
      searchTerm,
      ...filters
    };
    
    // Call the parent component's search handler
    onSearch(searchParams);
  };

  return (
    <Paper elevation={3} sx={{ mb: 4, p: 2, borderRadius: 2 }}>
      {/* Basic Search */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search emails by subject, sender, or content..."
          value={searchTerm}
          onChange={handleSearchTermChange}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ mr: 2 }}
        />
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSearch}
          sx={{ minWidth: 100 }}
        >
          Search
        </Button>
        <IconButton onClick={handleToggleExpand} sx={{ ml: 1 }}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      {/* Advanced Filters */}
      <Collapse in={expanded}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <FilterIcon sx={{ mr: 1 }} /> Advanced Filters
        </Typography>
        
        <Grid container spacing={2}>
          {/* First Row */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Phishing Status</InputLabel>
              <Select
                value={filters.phishingStatus}
                onChange={(e) => handleFilterChange('phishingStatus', e.target.value)}
                label="Phishing Status"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="phishing">Phishing</MenuItem>
                <MenuItem value="safe">Safe</MenuItem>
                <MenuItem value="suspicious">Suspicious</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Detection Method</InputLabel>
              <Select
                value={filters.detectionMethod}
                onChange={(e) => handleFilterChange('detectionMethod', e.target.value)}
                label="Detection Method"
              >
                <MenuItem value="all">All Methods</MenuItem>
                <MenuItem value="ml">Machine Learning</MenuItem>
                <MenuItem value="rules">Rule-based</MenuItem>
                <MenuItem value="ai">AI Analysis</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Has Attachment</InputLabel>
              <Select
                value={filters.hasAttachment}
                onChange={(e) => handleFilterChange('hasAttachment', e.target.value)}
                label="Has Attachment"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {/* Second Row */}
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="From Date"
                value={filters.dateFrom}
                onChange={(date) => handleFilterChange('dateFrom', date)}
                renderInput={(params) => <TextField {...params} fullWidth />}
                maxDate={filters.dateTo || undefined}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="To Date"
                value={filters.dateTo}
                onChange={(date) => handleFilterChange('dateTo', date)}
                renderInput={(params) => <TextField {...params} fullWidth />}
                minDate={filters.dateFrom || undefined}
              />
            </LocalizationProvider>
          </Grid>
          
          {/* Third Row */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Sender"
              variant="outlined"
              value={filters.sender}
              onChange={(e) => handleFilterChange('sender', e.target.value)}
              placeholder="Filter by sender email..."
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Recipient"
              variant="outlined"
              value={filters.recipient}
              onChange={(e) => handleFilterChange('recipient', e.target.value)}
              placeholder="Filter by recipient email..."
            />
          </Grid>
          
          {/* Fourth Row */}
          <Grid item xs={12}>
            <Typography gutterBottom>
              Phishing Score Range: {filters.phishingScoreRange[0]} - {filters.phishingScoreRange[1]}%
            </Typography>
            <Slider
              value={filters.phishingScoreRange}
              onChange={handleSliderChange}
              valueLabelDisplay="auto"
              min={0}
              max={100}
              sx={{ mt: 1 }}
            />
          </Grid>
          
          {/* Fifth Row */}
          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={availableTags}
              value={filters.tags}
              onChange={(event, newValue) => handleFilterChange('tags', newValue)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option}
                    {...getTagProps({ index })}
                    color="primary"
                    variant="outlined"
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Tags"
                  placeholder="Select tags..."
                />
              )}
            />
          </Grid>
        </Grid>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={handleClearFilters}
            startIcon={<ClearIcon />}
            sx={{ mr: 2 }}
          >
            Clear Filters
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSearch}
            startIcon={<SearchIcon />}
          >
            Apply Filters
          </Button>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default AdvancedSearch; 