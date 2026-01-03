const Article = require('../models/Article');
const { validationResult } = require('express-validator');

// 获取所有博客
exports.getArticles = async (req, res) => {
  try {
    const { category = '', type = '' } = req.query;
    const query = {};
    if (category) query.category = category;
    if (type) query.type = type;

    const articles = await Article.find(query)
      .populate('author', 'username avatar bio')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: articles.length, articles });
  } catch (error) {
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};

// 获取单篇博客
exports.getArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('author', 'username avatar bio');

    if (!article) {
      return res.status(404).json({ success: false, message: '博客不存在' });
    }
    article.views += 1;
    await article.save();

    res.json({ success: true, article });
  } catch (error) {
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};

// 发布博客（新增视频类型适配）
exports.createArticle = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }

  try {
    const { 
      type, title, category, content, excerpt, 
      coverImage, imageGallery, musicUrl, localMusic, musicDesc,
      videoUrl, localVideo, videoDesc // 新增视频字段
    } = req.body;

    const blogData = {
      type,
      title,
      category,
      author: req.user._id,
      authorName: req.user.username
    };

    // 文章类型
    if (type === 'article') {
      blogData.content = content;
      blogData.excerpt = excerpt || content.slice(0, 100);
      blogData.coverImage = coverImage;
    }
    // 图片集类型
    else if (type === 'image') {
      blogData.content = content || '图片集说明';
      blogData.imageGallery = imageGallery || [];
      blogData.coverImage = coverImage || (imageGallery?.length ? imageGallery[0] : '');
    }
    // 音乐类型
    else if (type === 'music') {
      blogData.musicUrl = musicUrl || '';
      blogData.localMusic = localMusic || '';
      blogData.musicDesc = musicDesc || '';
      blogData.coverImage = coverImage;
    }
    // 新增：视频类型
    else if (type === 'video') {
      blogData.videoUrl = videoUrl || '';
      blogData.localVideo = localVideo || '';
      blogData.videoDesc = videoDesc || '';
      blogData.coverImage = coverImage; // 视频封面
    }

    const article = await Article.create(blogData);
    res.status(201).json({ success: true, message: '博客发布成功', article });
  } catch (error) {
    res.status(500).json({ success: false, message: '发布失败：' + error.message });
  }
};

// 原有删除/点赞方法保留
exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: '博客不存在' });
    }

    if (article.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: '无权限删除此博客' });
    }

    await article.deleteOne();
    res.json({ success: true, message: '博客删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};

exports.likeArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: '博客不存在' });
    }

    const isLiked = article.likedBy.includes(req.user._id);
    if (isLiked) {
      article.likes -= 1;
      article.likedBy = article.likedBy.filter(id => id.toString() !== req.user._id.toString());
    } else {
      article.likes += 1;
      article.likedBy.push(req.user._id);
    }
    await article.save();

    res.json({
      success: true,
      likes: article.likes,
      isLiked: !isLiked
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '服务器错误' });
  }
};