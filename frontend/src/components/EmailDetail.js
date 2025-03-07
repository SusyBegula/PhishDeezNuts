import AIAnalysis from './AIAnalysis';

return (
  <Box sx={{ p: 3 }}>
    {/* ... existing email detail content ... */}
    
    <Divider sx={{ my: 2 }} />
    
    <AIAnalysis emailId={email.id} />
    
    {/* ... rest of the existing content ... */}
  </Box>
); 