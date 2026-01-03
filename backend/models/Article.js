const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  // 新增：video类型
  type: {
    type: String,
    required: [true, '请选择博客类型'],
    enum: ['article', 'image', 'music', 'video'], // 新增video
    default: 'article'
  },
  title: {
    type: String,
    required: [true, '博客标题不能为空'],
    trim: true
  },
  category: {
    type: String,
    required: [true, '博客分类不能为空'],
    trim: true
  },
  // 文章专属字段
  content: {
    type: String,
    required: function() { return this.type === 'article'; }
  },
  excerpt: {
    type: String,
    trim: true,
    default: ''
  },
  coverImage: {
    type: String,
    default: ''
  },
  // 图片集专属字段
  imageGallery: [{
    type: String
  }],
  // 音乐专属字段
  musicUrl: {
    type: String,
    default: ''
  },
  localMusic: {
    type: String,
    default: ''
  },
  musicDesc: {
    type: String,
    default: ''
  },
  // 新增：视频专属字段
  videoUrl: { // 视频外链
    type: String,
    default: ''
  },
  localVideo: { // 本地视频Base64存储
    type: String,
    default: ''
  },
  videoDesc: { // 视频简介
    type: String,
    default: ''
  },
  // 通用字段
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    trim: true
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

// 前置校验：音乐/视频二选一
ArticleSchema.pre('save', function(next) {
  // 音乐类型校验
  if (this.type === 'music' && !this.musicUrl && !this.localMusic) {
    throw new Error('音乐外链或本地音乐文件必须填写一个');
  }
  // 新增：视频类型校验
  if (this.type === 'video' && !this.videoUrl && !this.localVideo) {
    throw new Error('视频外链或本地视频文件必须填写一个');
  }
  next();
});

module.exports = mongoose.model('Article', ArticleSchema);