import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Snackbar,
  Alert
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const CharacterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    work: '',
    traits: '',
    quotes: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/submit-character`, formData);
      setSnackbar({
        open: true,
        message: 'キャラクター情報が登録されました',
        severity: 'success'
      });
      // 成功後、ポエム生成画面へ遷移
      navigate('/generate', { state: { characterData: formData } });
    } catch (error) {
      setSnackbar({
        open: true,
        message: '登録に失敗しました',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom align="center">
        キャラクター情報登録
      </Typography>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="キャラクター名"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="作品名"
            name="work"
            value={formData.work}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="特徴"
            name="traits"
            value={formData.traits}
            onChange={handleChange}
            margin="normal"
            required
            multiline
            rows={3}
          />
          <TextField
            fullWidth
            label="セリフ（任意）"
            name="quotes"
            value={formData.quotes}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={2}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
          >
            登録
          </Button>
        </form>
      </Paper>

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

export default CharacterForm; 