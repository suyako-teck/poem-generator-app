import React from 'react';
import { Box, Typography, Link, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            ポエム生成アプリについて
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            このアプリケーションは、AI技術を活用して写真やキャラクター情報からポエムを自動生成するサービスです。
            生成されたポエムは、あなたの創造性を刺激し、新しい表現の可能性を広げるお手伝いをします。
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            データの取り扱いについて
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            ・アップロードされた画像は、ポエム生成の目的のみに使用されます。
            ・キャラクター情報は、AIモデルの学習に使用される場合があります。
            ・生成されたポエムの評価データは、サービスの改善に活用されます。
            ・個人情報は適切に管理され、第三者に提供されることはありません。
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Link component={RouterLink} to="/terms" color="inherit" underline="hover">
            利用規約
          </Link>
          <Link component={RouterLink} to="/privacy" color="inherit" underline="hover">
            プライバシーポリシー
          </Link>
          <Link component={RouterLink} to="/about" color="inherit" underline="hover">
            このアプリについて
          </Link>
        </Box>

        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
          © {new Date().getFullYear()} ポエム生成アプリ All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 