import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

const Privacy = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        プライバシーポリシー
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          1. 収集する情報
        </Typography>
        <Typography paragraph>
          本サービスでは、以下の情報を収集する場合があります：
          <br />・アップロードされた画像
          <br />・入力されたキャラクター情報
          <br />・生成されたポエム
          <br />・ポエムの評価データ
        </Typography>

        <Typography variant="h6" gutterBottom>
          2. 情報の利用目的
        </Typography>
        <Typography paragraph>
          収集した情報は、以下の目的で利用されます：
          <br />・ポエムの生成
          <br />・AIモデルの改善
          <br />・サービスの品質向上
          <br />・ユーザーサポート
        </Typography>

        <Typography variant="h6" gutterBottom>
          3. 情報の管理
        </Typography>
        <Typography paragraph>
          収集した情報は、適切なセキュリティ対策を講じて管理します。
          個人情報は、適切な方法で保護し、第三者に提供することはありません。
        </Typography>

        <Typography variant="h6" gutterBottom>
          4. データの保存期間
        </Typography>
        <Typography paragraph>
          収集したデータは、サービスの改善に必要な期間のみ保存されます。
          不要になったデータは、適切な方法で削除されます。
        </Typography>

        <Typography variant="h6" gutterBottom>
          5. お問い合わせ
        </Typography>
        <Typography paragraph>
          プライバシーポリシーに関するお問い合わせは、
          お問い合わせフォームからご連絡ください。
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

export default Privacy; 