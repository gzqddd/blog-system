import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Home = ({ user }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  
  const categories = [...new Set(articles.map(article => article.category))];
  // 定义类型数组（现在会被遍历使用）
  const types = ['article', 'image', 'music', 'video'];
  // 类型名称映射（用于显示中文）
  const typeNameMap = {
    article: '文章',
    image: '图片集',
    music: '音乐',
    video: '视频'
  };

  // 获取博客列表
  useEffect(() => {
    const getArticles = async () => {
      try {
        let url = '/articles';
        const params = [];
        if (selectedCategory) params.push(`category=${selectedCategory}`);
        if (selectedType) params.push(`type=${selectedType}`);
        if (params.length) url += `?${params.join('&')}`;

        const res = await api.get(url);
        if (res.success) {
          setArticles(res.articles);
        }
      } catch (err) {
        alert('获取博客失败');
      } finally {
        setLoading(false);
      }
    };

    getArticles();
  }, [selectedCategory, selectedType]);

  // 点赞功能
  const handleLike = async (id) => {
    if (!user) {
      alert('请先登录后点赞');
      return;
    }
    try {
      const res = await api.post(`/articles/${id}/like`);
      if (res.success) {
        setArticles(articles.map(article => 
          article._id === id 
            ? { 
                ...article, 
                likes: res.likes,
                likedBy: res.isLiked 
                  ? [...article.likedBy, user._id] 
                  : article.likedBy.filter(userId => userId !== user._id)
              }
            : article
        ));
      }
    } catch (err) {
      alert(err.response?.data?.message || '点赞失败');
    }
  };

  // 删除博客
  const handleDelete = async (id) => {
    if (window.confirm('确定要删除这篇博客吗？')) {
      try {
        const res = await api.delete(`/articles/${id}`);
        if (res.success) {
          setArticles(articles.filter(article => article._id !== id));
          alert('博客删除成功');
        }
      } catch (err) {
        alert(err.response?.data?.message || '删除失败');
      }
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>加载中...</h2>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>我的博客</h1>
        <p style={{ color: '#7f8c8d' }}>分享你的所思所想</p>
      </div>

      {/* 筛选栏（修复types变量未使用问题） */}
      <div className="article-filter">
        <h3 style={{ color: '#2c3e50' }}>筛选：</h3>
        {/* 分类筛选 */}
        <select 
          className="filter-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">全部分类</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        {/* 类型筛选（遍历types数组，使用变量） */}
        <select 
          className="filter-select"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">全部类型</option>
          {types.map(type => (
            <option key={type} value={type}>{typeNameMap[type]}</option>
          ))}
        </select>
      </div>

      {articles.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>暂无博客</h3>
          {user && <Link to="/publish" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block', width: 'auto' }}>发布第一篇博客</Link>}
          {!user && <Link to="/login" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block', width: 'auto' }}>登录后发布博客</Link>}
        </div>
      ) : (
        <div className="article-list">
          {articles.map(article => (
            <div className="article-card" key={article._id}>
              {/* 封面图 */}
              {article.coverImage && (
                <img src={article.coverImage} alt={article.title} className="article-card-img" />
              )}
              {/* 图片集默认封面 */}
              {article.type === 'image' && !article.coverImage && article.imageGallery?.length > 0 && (
                <img src={article.imageGallery[0]} alt={article.title} className="article-card-img" />
              )}
              
              <div className="article-card-body">
                <h3 className="article-title">
                  <Link to={`/article/${article._id}`}>{article.title}</Link>
                </h3>
                <div className="article-meta">
                  <div className="article-meta-author">
                    {article.author?.avatar && (
                      <img src={article.author.avatar} alt={article.author.username} className="author-avatar" />
                    )}
                    <span>{article.authorName}</span>
                  </div>
                  <span>
                    {typeNameMap[article.type] || '未知类型'}
                  </span>
                </div>
                {/* 摘要/说明 */}
                <p className="article-excerpt">
                  {article.type === 'article' ? article.excerpt : 
                   article.type === 'image' ? (article.content || '图片集分享') : 
                   article.type === 'music' ? (article.musicDesc || '音乐分享') : 
                   (article.videoDesc || '视频分享')}
                </p>
                <div className="article-actions">
                  <Link to={`/article/${article._id}`} className="btn-outline btn" style={{ padding: '0.5rem 1rem' }}>查看详情</Link>
                  
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {/* 点赞按钮 */}
                    <button 
                      className={`like-btn ${article.likedBy.includes(user?._id) ? 'liked' : ''}`}
                      onClick={() => handleLike(article._id)}
                    >
                      ❤️ {article.likes}
                    </button>
                    
                    {/* 删除按钮（仅作者可见） */}
                    {user && user._id === article.author?._id && (
                      <button onClick={() => handleDelete(article._id)} className="btn btn-danger" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>删除</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;