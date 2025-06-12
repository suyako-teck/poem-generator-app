import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <AutoStoriesIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ポエム生成アプリ
        </Typography>
        <Box>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
          >
            写真アップロード
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/character"
          >
            キャラクター登録
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 