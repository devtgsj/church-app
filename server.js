const express = require('express');
const app = express();
const PORT = 3000;

// 메인 페이지 접속 시 응답
app.get('/', (req, res) => {
  res.send('<h1>교회 관리 시스템 서버가 성공적으로 작동 중입니다!</h1>');
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`서버가 실행되었습니다: http://localhost:${PORT}`);
});