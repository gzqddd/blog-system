const express = require('express');
const router = express.Router();
const { updateProfile, getProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

// 更新个人信息
router.put('/', protect, updateProfile);

// 获取个人信息
router.get('/', protect, getProfile);

module.exports = router;