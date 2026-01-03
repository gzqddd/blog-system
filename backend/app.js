const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const articleRoutes = require('./routes/articleRoutes');
const profileRoutes = require('./routes/profileRoutes'); // 新增

// 连接数据库
connectDB();

const app = express();

// 中间件（核心修改：增加10MB请求体大小限制，支持图片base64上传）
app.use(cors());
app.use(express.json({ limit: '50mb' })); // 允许50MB的JSON请求体
app.use(express.urlencoded({ extended: false, limit: '10mb' })); // 允许10MB的表单请求体

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/profile', profileRoutes); // 新增个人信息路由

// 根路由
app.get('/', (req, res) => {
  res.json({ success: true, message: '博客系统API' });
});

// 错误处理
app.use(errorHandler);

// 启动服务
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`服务器运行在端口 ${PORT}`));