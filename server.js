require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
// public 폴더 내의 index.html 및 pages/system/... 하위 HTML/JS/CSS 자원을 모두 제공
app.use(express.static(path.join(__dirname, 'public')));

// 라우터 모듈 분리 연결
const menuRouter = require('./routes/menu');
const commonCodeRouter = require('./routes/common-code');

app.use('/api/menus', menuRouter);
app.use('/api/system', commonCodeRouter);


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});