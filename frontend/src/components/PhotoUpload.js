import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Paper, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'https://poem-app-backend.onrender.com';

const PhotoUpload = () => {
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1
  });

  const handleUpload = async () => {
    if (!preview) return;

    setUploading(true);
    try {
      const formData = new FormData();
      const file = await fetch(preview).then(r => r.blob());
      formData.append('file', file);

      const response = await axios.post(`${API_URL}/upload-photo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
        timeout: 30000,
        validateStatus: function (status) {
          return status >= 200 && status < 500;
        }
      });

      if (response.status === 200) {
        navigate('/generate', { state: { imageData: response.data } });
      } else {
        throw new Error(response.data.detail || 'アップロードに失敗しました');
      }
    } catch (error) {
      console.error('アップロードエラー:', error);
      let errorMessage = 'アップロードに失敗しました。';
      
      if (error.response) {
        errorMessage = error.response.data?.detail || errorMessage;
      } else if (error.request) {
        errorMessage = 'サーバーからの応答がありません。ネットワーク接続を確認してください。';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'タイムアウトしました。時間をおいて再度お試しください。';
      }
      
      alert(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom align="center">
        写真をアップロード
      </Typography>
      
      <Paper
        {...getRootProps()}
        sx={{
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: isDragActive ? 'action.hover' : 'background.paper',
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography>
          {isDragActive
            ? '写真をドロップしてください'
            : '写真をドラッグ＆ドロップするか、クリックして選択してください'}
        </Typography>
      </Paper>

      {preview && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <img
            src={preview}
            alt="プレビュー"
            style={{ maxWidth: '100%', maxHeight: 300 }}
          />
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={uploading}
            sx={{ mt: 2 }}
          >
            {uploading ? 'アップロード中...' : 'アップロード'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default PhotoUpload; 