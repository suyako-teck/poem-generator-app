import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PoemGenerator = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [poem, setPoem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    if (!location.state) {
      navigate('/');
      return;
    }

    generatePoem();
  }, [location.state]);

  const generatePoem = async () => {
    setLoading(true);
    try {
      const source = location.state.imageData ? 'image' : 'character';
      const data = location.state.imageData || location.state.characterData;

      const response = await axios.post('http://localhost:8000/generate-poem', {
        source,
        ...data
      });

      setPoem(response.data.poem);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'ポエムの生成に失敗しました',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async (rating) => {
    try {
      await axios.post('http://localhost:8000/rate-poem', {
        poem_id: poem.id,
        rating
      });

      setSnackbar({
        open: true,
        message: '評価ありがとうございます',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: '評価の送信に失敗しました',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom align="center">
        ポエム生成
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : poem ? (
        <Paper sx={{ p: 3, mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            生成されたポエム
          </Typography>
          <Typography
            variant="body1"
            sx={{
              whiteSpace: 'pre-line',
              fontStyle: 'italic',
              textAlign: 'center',
              my: 3
            }}
          >
            {poem.content}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleRate('良い')}
            >
              良い
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleRate('悪い')}
            >
              悪い
            </Button>
          </Box>
        </Paper>
      ) : null}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PoemGenerator; 