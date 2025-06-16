import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

const Terms = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        利用規約
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          1. サービスの利用
        </Typography>
        <Typography paragraph>
          本サービスは、写真やキャラクター情報からポエムを自動生成するAIアプリケーションです。
          ユーザーは本規約に同意した上で、本サービスを利用することができます。
        </Typography>

        <Typography variant="h6" gutterBottom>
          2. 禁止事項
        </Typography>
        <Typography paragraph>
          以下の行為を禁止します：
          <br />・法令や公序良俗に反する行為
          <br />・他者の権利を侵害する行為
          <br />・本サービスの運営を妨害する行為
          <br />・その他、当社が不適切と判断する行為
        </Typography>

        <Typography variant="h6" gutterBottom>
          3. 知的財産権
        </Typography>
        <Typography paragraph>
          生成されたポエムの著作権は、ユーザーに帰属します。
          ただし、本サービスの改善のために、生成されたポエムを利用させていただく場合があります。
        </Typography>

        <Typography variant="h6" gutterBottom>
          4. 免責事項
        </Typography>
        <Typography paragraph>
          本サービスは、生成されるポエムの内容について一切の責任を負いません。
          また、サービスの中断や停止、データの消失等についても責任を負いません。
        </Typography>

        <Typography variant="h6" gutterBottom>
          5. 規約の変更
        </Typography>
        <Typography paragraph>
          当社は、必要に応じて本規約を変更することができます。
          変更後の規約は、本サービス上で公開された時点で効力を生じます。
        </Typography>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            最終更新日: 2024年3月15日
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Terms; 