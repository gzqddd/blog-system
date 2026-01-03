const express = require('express');
const router = express.Router();
const { getArticles, getArticle, createArticle, deleteArticle, likeArticle } = require('../controllers/articleController');
const { protect } = require('../middleware/authMiddleware');
const { check, validationResult } = require('express-validator');

// 获取所有博客
router.get('/', getArticles);

// 获取单篇博客
router.get('/:id', getArticle);

// 发布博客（新增视频类型校验）
router.post('/', protect, [
  check('title', '博客标题不能为空').not().isEmpty(),
  check('category', '博客分类不能为空').not().isEmpty(),
  check('type', '请选择博客类型').isIn(['article', 'image', 'music', 'video']), // 新增video
  // 文章类型：必填content
  check('content').if((value, { req }) => req.body.type === 'article').not().isEmpty().withMessage('文章内容不能为空'),
  // 音乐类型：二选一
  check('').if((value, { req }) => req.body.type === 'music').custom((value, { req }) => {
    if (!req.body.musicUrl && !req.body.localMusic) {
      throw new Error('请填写音乐外链或上传本地音乐文件');
    }
    return true;
  }),
  // 新增：视频类型校验（二选一）
  check('').if((value, { req }) => req.body.type === 'video').custom((value, { req }) => {
    if (!req.body.videoUrl && !req.body.localVideo) {
      throw new Error('请填写视频外链或上传本地视频文件');
    }
    return true;
  })
], createArticle);

// 删除博客
router.delete('/:id', protect, deleteArticle);

// 点赞博客
router.post('/:id/like', protect, likeArticle);

module.exports = router;