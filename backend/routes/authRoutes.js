const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { check } = require('express-validator');

// 注册
router.post('/register', [
  check('username', '用户名不能为空').not().isEmpty(),
  check('email', '请输入有效的邮箱').isEmail(),
  check('password', '密码长度不能少于6位').isLength({ min: 6 })
], register);

// 登录
router.post('/login', [
  check('username', '用户名不能为空').not().isEmpty(),
  check('password', '密码不能为空').not().isEmpty()
], login);

// 获取当前用户
router.get('/me', protect, getMe);

module.exports = router;