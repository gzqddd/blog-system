import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Article = ({ user }) => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getArticle = async () => {
      try {
        const res = await api.get(`/articles/${id}`);
        if (res.success) {
          setArticle(res.article);
        } else {
          alert(res.message);
          navigate('/');
        }
      } catch (err) {
        alert('获取博客失败');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    getArticle();
  }, [id, navigate]);

  const handleLike = async () => {
    if (!user) {
      alert('请先登录后点赞');
      return;
    }
    try {
      const res = await api.post(`/articles/${id}/like`);
      if (res.success) {
        setArticle({
          ...article,
          likes: res.likes,
          likedBy: res.isLiked 
            ? [...article.likedBy, user._id] 
            : article.likedBy.filter(userId => userId !== user._id)
        });
      }
    } catch (err) {
      alert(err.response?.data?.message || '点赞失败');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>加载中...</h2>
      </div>
    );
  }

  if (!article) return null;

  return (
    <div className="container">
      <div className="card article-detail">
        {/* 通用封面 */}
        {article.coverImage && (
          <img src={article.coverImage} alt={article.title} className="article-detail-cover" />
        )}
        
        <h1 className="article-detail-title">{article.title}</h1>
        
        {/* 作者信息 */}
        <div className="article-detail-author">
          {article.author?.avatar && (
            <img src={article.author.avatar} alt={article.author.username} className="article-detail-avatar" />
          )}
          <div>
            <div className="article-detail-author-name">{article.author?.username}</div>
            <div className="article-detail-author-bio">{article.author?.bio}</div>
          </div>
        </div>
        
        <div className="article-detail-meta">
          <span>分类: {article.category}</span> | 
          <span> 类型: {
            article.type === 'article' ? '文章' : 
            article.type === 'image' ? '图片集' : 
            article.type === 'music' ? '音乐' : '视频'
          }</span> |
          <span> 阅读: {article.views}</span> | 
          <span> 点赞: {article.likes}</span> | 
          <span> 发布时间: {new Date(article.createdAt).toLocaleString()}</span>
        </div>
        
        {/* 文章类型 */}
        {article.type === 'article' && (
          <div className="article-detail-content">
            {article.content}
          </div>
        )}

        {/* 图片集类型 */}
        {article.type === 'image' && (
          <>
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>图片集</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                {article.imageGallery.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`图片集${index+1}`}
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                  />
                ))}
              </div>
            </div>
            <div className="article-detail-content" style={{ marginTop: '1rem' }}>
              <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>图片集说明</h3>
              {article.content || '暂无说明'}
            </div>
          </>
        )}

        {/* 音乐类型 */}
        {article.type === 'music' && (
          <>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>音乐播放</h3>
              <audio 
                src={article.localMusic || article.musicUrl} 
                controls 
                style={{ width: '100%', maxWidth: '500px' }}
              >
                您的浏览器不支持音频播放
              </audio>
            </div>
            <div className="article-detail-content">
              <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>音乐简介</h3>
              {article.musicDesc || '暂无简介'}
            </div>
          </>
        )}

        {/* 新增：视频类型 */}
        {article.type === 'video' && (
          <>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>视频播放</h3>
              <video 
                src={article.localVideo || article.videoUrl} 
                controls 
                poster={article.coverImage || ''} // 封面
                style={{ width: '100%', maxWidth: '700px', borderRadius: '8px' }}
              >
                您的浏览器不支持视频播放
              </video>
            </div>
            <div className="article-detail-content">
              <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>视频简介</h3>
              {article.videoDesc || '暂无简介'}
            </div>
          </>
        )}
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button onClick={() => navigate('/')} className="btn btn-outline" style={{ width: 'auto' }}>
            返回首页
          </button>
          
          <button 
            className={`btn ${article.likedBy.includes(user?._id) ? 'btn-danger' : 'btn-outline'}`}
            onClick={handleLike}
            style={{ width: 'auto' }}
          >
            {article.likedBy.includes(user?._id) ? '取消点赞' : '点赞'} ❤️ {article.likes}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Article;