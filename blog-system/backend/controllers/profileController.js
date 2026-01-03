const User = require('../models/User');

// 更新用户个人信息（新增用户名修改）
exports.updateProfile = async (req, res) => {
  try {
    const { username, avatar, bio } = req.body;
    let updateData = { avatar, bio };

    // 校验新用户名是否重复
    if (username && username !== req.user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: '用户名已存在'
        });
      }
      updateData.username = username;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: '个人信息更新成功',
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新失败：' + error.message
    });
  }
};

// 获取用户个人信息
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取信息失败：' + error.message
    });
  }
};