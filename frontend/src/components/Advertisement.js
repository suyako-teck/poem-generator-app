import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

const Advertisement = () => {
  return (
    <Paper sx={{ p: 2, mt: 2, bgcolor: '#f5f5f5' }}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        スポンサード
      </Typography>
      <Box sx={{ textAlign: 'center' }}>
        {/* ここに実際の広告コードを配置 */}
        <Typography variant="body2" color="text.secondary">
          広告スペース
        </Typography>
      </Box>
    </Paper>
  );
};

export default Advertisement; 