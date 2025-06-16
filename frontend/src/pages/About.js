import React from 'react';
import { Container, Typography, Paper, Box, Grid } from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import PsychologyIcon from '@mui/icons-material/Psychology';

const About = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        このアプリについて
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          ポエム生成アプリとは
        </Typography>
        <Typography paragraph>
          このアプリケーションは、AI技術を活用して写真やキャラクター情報から
          ポエムを自動生成するサービスです。あなたの創造性を刺激し、
          新しい表現の可能性を広げるお手伝いをします。
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <PhotoCameraIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                写真から生成
              </Typography>
              <Typography variant="body2" color="text.secondary">
                アップロードした写真の雰囲気をAIが解析し、
                その世界観に合ったポエムを生成します。
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <AutoStoriesIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                キャラクターから生成
              </Typography>
              <Typography variant="body2" color="text.secondary">
                キャラクターの特徴やセリフを基に、
                そのキャラクターらしいポエムを生成します。
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <PsychologyIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                AI技術の活用
              </Typography>
              <Typography variant="body2" color="text.secondary">
                最新のAI技術を活用し、
                より自然で魅力的なポエムを生成します。
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            利用方法
          </Typography>
          <Typography paragraph>
            1. 写真をアップロードするか、キャラクター情報を入力します。
            <br />2. AIがポエムを生成します。
            <br />3. 生成されたポエムを編集したり、評価したりできます。
            <br />4. お気に入りのポエムはSNSで共有できます。
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            開発者について
          </Typography>
          <Typography paragraph>
            このアプリケーションは、AI技術とクリエイティブな表現の可能性を
            追求する開発者によって作成されました。
            ユーザーの皆様のフィードバックを大切にし、
            より良いサービスを提供するために日々改善を重ねています。
          </Typography>
        </Box>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            バージョン: 1.0.0
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default About; 