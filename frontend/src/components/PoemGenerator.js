import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const PoemGenerator = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [poem, setPoem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [shareAnchorEl, setShareAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    if (location.state?.imageData || location.state?.characterData) {
      generatePoem();
    }
  }, [location.state, generatePoem, navigate]);

  const generatePoem = async () => {
    setLoading(true);
    try {
      const source = location.state.imageData ? 'image' : 'character';
      const requestData = {
        source,
        imageData: location.state.imageData,
        characterData: location.state.characterData
      };

      const response = await axios.post(`${API_URL}/generate-poem`, requestData);

      setPoem(response.data.poem);
      setEditedContent(response.data.poem.content);
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

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(`${API_URL}/customize-poem`, {
        poem_id: poem.id,
        content: editedContent
      });

      setPoem(response.data.poem);
      setEditing(false);
      setSnackbar({
        open: true,
        message: 'ポエムが更新されました',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: '更新に失敗しました',
        severity: 'error'
      });
    }
  };

  const handleShare = async (platform) => {
    try {
      const response = await axios.post(`${API_URL}/share-on-sns`, {
        poem_id: poem.id,
        platform,
        image_url: location.state.imageData?.location
      });

      window.open(response.data.share_url, '_blank');
      setShareAnchorEl(null);
      setSnackbar({
        open: true,
        message: '共有が完了しました',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: '共有に失敗しました',
        severity: 'error'
      });
    }
  };

  const handleRate = async (rating) => {
    try {
      await axios.post(`${API_URL}/rate-poem`, {
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              生成されたポエム
            </Typography>
            <Box>
              <IconButton onClick={handleEdit} color="primary">
                <EditIcon />
              </IconButton>
              <IconButton onClick={(e) => setShareAnchorEl(e.currentTarget)} color="primary">
                <ShareIcon />
              </IconButton>
            </Box>
          </Box>

          {editing ? (
            <Dialog open={editing} onClose={() => setEditing(false)} maxWidth="md" fullWidth>
              <DialogTitle>ポエムを編集</DialogTitle>
              <DialogContent>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  margin="normal"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setEditing(false)}>キャンセル</Button>
                <Button onClick={handleSaveEdit} variant="contained">保存</Button>
              </DialogActions>
            </Dialog>
          ) : (
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
          )}

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

      <Menu
        anchorEl={shareAnchorEl}
        open={Boolean(shareAnchorEl)}
        onClose={() => setShareAnchorEl(null)}
      >
        <MenuItem onClick={() => handleShare('twitter')}>Twitter</MenuItem>
        <MenuItem onClick={() => handleShare('facebook')}>Facebook</MenuItem>
        <MenuItem onClick={() => handleShare('instagram')}>Instagram</MenuItem>
      </Menu>

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