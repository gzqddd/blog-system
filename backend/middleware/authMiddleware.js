const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 提取Token
      token = req.headers.authorization.split(' ')[1];
      // 验证Token
      const decoded = jwt.verify(token, 'blog-final-secret-2025');
      // 获取用户信息（排除密码）
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ success: false, message: 'Token无效，请重新登录' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: '未登录，请先登录' });
  }
};

module.exports = { protect };