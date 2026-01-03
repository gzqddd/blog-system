const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// 生成Token
const generateToken = (id) => {
  return jwt.sign({ id }, 'blog-final-secret-2025', { expiresIn: '30d' });
};

// 注册
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }

  const { username, email, password } = req.body;

  try {
    // 检查用户是否存在
    const userExists = await User.findOne({ $or: [{ username }, { email }] });
    if (userExists) {
      return res.status(400).json({ success: false, message: '用户名或邮箱已存在' });
    }

    // 创建用户
    const user = await User.create({ username, email, password });
    res.status(201).json({
      success: true,
      message: '注册成功',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      },
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};

// 登录
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }

  const { username, password } = req.body;

  try {
    // 查找用户
    const user = await User.findOne({ username }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: '用户名不存在' });
    }

    // 验证密码
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: '密码错误' });
    }

    res.json({
      success: true,
      message: '登录成功',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      },
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};

// 获取当前用户
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};