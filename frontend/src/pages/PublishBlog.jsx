import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const PublishBlog = ({ user }) => {
  const [activeTab, setActiveTab] = useState('article');
  const [formData, setFormData] = useState({
    type: 'article',
    title: '',
    category: '',
    // 文章字段
    content: '',
    excerpt: '',
    coverImage: '',
    // 图片集字段
    imageGallery: [],
    // 音乐字段
    musicUrl: '',
    localMusic: '',
    musicDesc: '',
    // 新增：视频字段
    videoUrl: '',
    localVideo: '',
    videoDesc: ''
  });
  // 预览状态
  const [preview, setPreview] = useState('');
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [musicFileName, setMusicFileName] = useState('');
  const [videoFileName, setVideoFileName] = useState(''); // 本地视频文件名
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormData({ ...formData, type: tab });
    setError('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  // 封面图上传
  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
        setFormData({ ...formData, coverImage: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // 图片集上传
  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newPreviews = [];
      const newImages = [];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push(e.target.result);
          newImages.push(e.target.result);
          if (newPreviews.length === files.length) {
            setGalleryPreviews([...galleryPreviews, ...newPreviews]);
            setFormData({ ...formData, imageGallery: [...formData.imageGallery, ...newImages] });
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // 本地音乐上传
  const handleLocalMusicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.includes('audio')) {
        setError('请上传音频文件（MP3/WAV等）');
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        setError('音乐文件大小不能超过20MB');
        return;
      }
      setMusicFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, localMusic: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // 新增：本地视频上传（转Base64）
  const handleLocalVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 限制视频类型（仅MP4）
      if (file.type !== 'video/mp4') {
        setError('仅支持MP4格式视频');
        return;
      }
      // 限制大小（50MB，课程作业足够）
      if (file.size > 50 * 1024 * 1024) {
        setError('视频文件大小不能超过50MB');
        return;
      }
      setVideoFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, localVideo: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // 删除图片集图片
  const handleRemoveGalleryImage = (index) => {
    const newGallery = [...formData.imageGallery];
    newGallery.splice(index, 1);
    const newPreviews = [...galleryPreviews];
    newPreviews.splice(index, 1);
    setFormData({ ...formData, imageGallery: newGallery });
    setGalleryPreviews(newPreviews);
  };

  // 提交发布
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 类型校验
    if (activeTab === 'music' && !formData.musicUrl && !formData.localMusic) {
      setError('请填写音乐外链或上传本地音乐文件');
      setLoading(false);
      return;
    }
    // 新增：视频校验
    if (activeTab === 'video' && !formData.videoUrl && !formData.localVideo) {
      setError('请填写视频外链或上传本地视频文件');
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/articles', formData);
      if (res.success) {
        alert('博客发布成功');
        navigate('/');
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || '发布失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container">
      {/* 外层玻璃拟态容器 */}
      <div className="card" style={{ 
        background: 'rgba(15, 23, 42, 0.7)',
        border: '1px solid rgba(99, 102, 241, 0.4)',
        padding: '3rem',
        borderRadius: '24px'
      }}>
        {/* 标题渐变+发光 */}
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '2.5rem', 
          background: 'linear-gradient(90deg, #818cf8, #c084fc, #f472b6)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          textShadow: '0 0 15px rgba(129, 140, 248, 0.5)',
          fontSize: '2rem',
          fontWeight: 800
        }}>发表博客</h2>
        
        {/* 标签页导航（替换为华丽样式，保留功能） */}
        <div className="tab-container" style={{ marginBottom: '2.5rem' }}>
          <button
            onClick={() => handleTabChange('article')}
            className={`tab-btn ${activeTab === 'article' ? 'active' : ''}`}
          >
            文章
          </button>
          <button
            onClick={() => handleTabChange('image')}
            className={`tab-btn ${activeTab === 'image' ? 'active' : ''}`}
          >
            图片集
          </button>
          <button
            onClick={() => handleTabChange('music')}
            className={`tab-btn ${activeTab === 'music' ? 'active' : ''}`}
          >
            音乐
          </button>
          <button
            onClick={() => handleTabChange('video')}
            className={`tab-btn ${activeTab === 'video' ? 'active' : ''}`}
          >
            视频
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <p className="error-text">{error}</p>}
          
          {/* 通用字段 - 美化 */}
          <div className="form-group">
            <label className="form-label">博客标题</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              placeholder="请输入博客标题"
              disabled={loading}
              required
              style={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(99, 102, 241, 0.3)',
                color: '#e0e7ff'
              }}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">博客分类</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-input"
              placeholder="请输入博客分类（如：生活/视频/摄影）"
              disabled={loading}
              required
              style={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(99, 102, 241, 0.3)',
                color: '#e0e7ff'
              }}
            />
          </div>

          {/* 文章标签页 - 美化 */}
          {activeTab === 'article' && (
            <>
              <div className="form-group">
                <label className="form-label">文章封面</label>
                <div className="upload-container" onClick={() => document.getElementById('cover-input').click()}>
                  <input
                    type="file"
                    id="cover-input"
                    accept="image/*"
                    onChange={handleCoverChange}
                    style={{ display: 'none' }}
                    disabled={loading}
                  />
                  <p style={{ 
                    color: '#c7d2fe',
                    fontSize: '1.05rem'
                  }}>点击上传封面图（支持jpg/png，选填）</p>
                  {preview || formData.coverImage ? (
                    <img 
                      src={preview || formData.coverImage} 
                      alt="封面预览" 
                      className="upload-preview"
                      style={{ 
                        border: '2px solid rgba(99, 102, 241, 0.5)',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
                      }}
                    />
                  ) : (
                    <p style={{ marginTop: '1rem', color: '#a5b4fc' }}>暂无预览</p>
                  )}
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">文章摘要</label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="请输入文章摘要（选填，为空则自动截取正文前100字）"
                  disabled={loading}
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                    color: '#e0e7ff'
                  }}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">文章内容</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="请输入文章正文"
                  disabled={loading}
                  required
                  style={{ 
                    minHeight: '300px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                    color: '#e0e7ff'
                  }}
                />
              </div>
            </>
          )}

          {/* 图片集标签页 - 瀑布流+3D美化 */}
          {activeTab === 'image' && (
            <>
              <div className="form-group">
                <label className="form-label">图片集上传（支持多图）</label>
                <div className="upload-container" onClick={() => document.getElementById('gallery-input').click()}>
                  <input
                    type="file"
                    id="gallery-input"
                    accept="image/*"
                    onChange={handleGalleryChange}
                    multiple
                    style={{ display: 'none' }}
                    disabled={loading}
                  />
                  <p style={{ 
                    color: '#c7d2fe',
                    fontSize: '1.05rem'
                  }}>点击上传图片集（支持jpg/png，至少1张）</p>
                </div>
                
                {galleryPreviews.length > 0 ? (
                  <div className="gallery-grid" style={{ marginTop: '1.5rem' }}>
                    {galleryPreviews.map((src, index) => (
                      <div key={index} className="gallery-item">
                        <img src={src} alt={`图片${index+1}`} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                        <button
                          style={{ 
                            position: 'absolute', 
                            top: '10px', 
                            right: '10px', 
                            background: 'linear-gradient(90deg, #ec4899, #db2777)',
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '50%', 
                            width: '28px', 
                            height: '28px', 
                            cursor: 'pointer',
                            fontSize: '1rem',
                            boxShadow: '0 2px 8px rgba(236, 72, 153, 0.5)',
                            transition: 'all 0.3s'
                          }}
                          onClick={() => handleRemoveGalleryImage(index)}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.1)';
                            e.target.style.boxShadow = '0 4px 12px rgba(236, 72, 153, 0.8)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                            e.target.style.boxShadow = '0 2px 8px rgba(236, 72, 153, 0.5)';
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ marginTop: '1.5rem', color: '#a5b4fc', fontSize: '1.05rem' }}>暂无图片，请上传</p>
                )}
              </div>
              
              <div className="form-group">
                <label className="form-label">图片集说明</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="请输入图片集的文字说明（选填）"
                  disabled={loading}
                  style={{ 
                    minHeight: '150px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                    color: '#e0e7ff'
                  }}
                />
              </div>
            </>
          )}

          {/* 音乐标签页 - 霓虹+玻璃拟态美化 */}
          {activeTab === 'music' && (
            <>
              <div className="form-group">
                <label className="form-label">音乐封面</label>
                <div className="upload-container" onClick={() => document.getElementById('music-cover-input').click()}>
                  <input
                    type="file"
                    id="music-cover-input"
                    accept="image/*"
                    onChange={handleCoverChange}
                    style={{ display: 'none' }}
                    disabled={loading}
                  />
                  <p style={{ 
                    color: '#c7d2fe',
                    fontSize: '1.05rem'
                  }}>点击上传音乐封面（支持jpg/png，选填）</p>
                  {preview || formData.coverImage ? (
                    <img 
                      src={preview || formData.coverImage} 
                      alt="音乐封面预览" 
                      className="upload-preview"
                      style={{ 
                        border: '2px solid rgba(99, 102, 241, 0.5)',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
                      }}
                    />
                  ) : (
                    <p style={{ marginTop: '1rem', color: '#a5b4fc' }}>暂无预览</p>
                  )}
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">音乐外链（二选一）</label>
                <input
                  type="text"
                  name="musicUrl"
                  value={formData.musicUrl}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="请输入MP3链接/网易云音乐外链（如：https://xxx.mp3）"
                  disabled={loading}
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                    color: '#e0e7ff'
                  }}
                />
                <p style={{ marginTop: '0.5rem', color: '#a5b4fc', fontSize: '0.9rem' }}>
                  示例：网易云音乐外链、QQ音乐MP3链接
                </p>
              </div>
              
              <div className="form-group">
                <label className="form-label">本地音乐文件（二选一，支持MP3/WAV，≤20MB）</label>
                <div className="upload-container" onClick={() => document.getElementById('local-music-input').click()}>
                  <input
                    type="file"
                    id="local-music-input"
                    accept="audio/*"
                    onChange={handleLocalMusicChange}
                    style={{ display: 'none' }}
                    disabled={loading}
                  />
                  <p style={{ 
                    color: '#c7d2fe',
                    fontSize: '1.05rem'
                  }}>点击上传本地音乐文件</p>
                  {musicFileName && (
                    <p style={{ marginTop: '1rem', color: '#818cf8', fontSize: '1.05rem', textShadow: '0 0 5px rgba(129, 140, 248, 0.5)' }}>已选择：{musicFileName}</p>
                  )}
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">音乐简介</label>
                <textarea
                  name="musicDesc"
                  value={formData.musicDesc}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="请输入音乐介绍（选填）"
                  disabled={loading}
                  style={{ 
                    minHeight: '150px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                    color: '#e0e7ff'
                  }}
                />
              </div>

              {(formData.musicUrl || formData.localMusic) && (
                <div className="form-group">
                  <label className="form-label">音乐预览</label>
                  <audio 
                    src={formData.localMusic || formData.musicUrl} 
                    controls 
                    className="audio-player"
                    style={{ width: '100%', marginTop: '0.5rem' }}
                  >
                    您的浏览器不支持音频播放
                  </audio>
                </div>
              )}
            </>
          )}

          {/* 新增：视频标签页 - 华丽样式 */}
          {activeTab === 'video' && (
            <>
              <div className="form-group">
                <label className="form-label">视频封面</label>
                <div className="upload-container" onClick={() => document.getElementById('video-cover-input').click()}>
                  <input
                    type="file"
                    id="video-cover-input"
                    accept="image/*"
                    onChange={handleCoverChange}
                    style={{ display: 'none' }}
                    disabled={loading}
                  />
                  <p style={{ 
                    color: '#c7d2fe',
                    fontSize: '1.05rem'
                  }}>点击上传视频封面（支持jpg/png，选填）</p>
                  {preview || formData.coverImage ? (
                    <img 
                      src={preview || formData.coverImage} 
                      alt="视频封面预览" 
                      className="upload-preview"
                      style={{ 
                        border: '2px solid rgba(99, 102, 241, 0.5)',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
                      }}
                    />
                  ) : (
                    <p style={{ marginTop: '1rem', color: '#a5b4fc' }}>暂无预览</p>
                  )}
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">视频外链（二选一）</label>
                <input
                  type="text"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="请输入MP4外链（如：https://xxx.mp4）"
                  disabled={loading}
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                    color: '#e0e7ff'
                  }}
                />
                <p style={{ marginTop: '0.5rem', color: '#a5b4fc', fontSize: '0.9rem' }}>
                  示例：MP4格式视频外链、B站视频外链（需支持播放）
                </p>
              </div>
              
              <div className="form-group">
                <label className="form-label">本地视频文件（二选一，仅MP4格式，≤50MB）</label>
                <div className="upload-container" onClick={() => document.getElementById('local-video-input').click()}>
                  <input
                    type="file"
                    id="local-video-input"
                    accept="video/mp4"
                    onChange={handleLocalVideoChange}
                    style={{ display: 'none' }}
                    disabled={loading}
                  />
                  <p style={{ 
                    color: '#c7d2fe',
                    fontSize: '1.05rem'
                  }}>点击上传本地视频文件</p>
                  {videoFileName && (
                    <p style={{ marginTop: '1rem', color: '#818cf8', fontSize: '1.05rem', textShadow: '0 0 5px rgba(129, 140, 248, 0.5)' }}>已选择：{videoFileName}</p>
                  )}
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">视频简介</label>
                <textarea
                  name="videoDesc"
                  value={formData.videoDesc}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="请输入视频介绍（选填）"
                  disabled={loading}
                  style={{ 
                    minHeight: '150px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                    color: '#e0e7ff'
                  }}
                />
              </div>

              {/* 视频预览 - 华丽播放器 */}
              {(formData.videoUrl || formData.localVideo) && (
                <div className="form-group">
                  <label className="form-label">视频预览</label>
                  <video 
                    src={formData.localVideo || formData.videoUrl} 
                    controls 
                    className="video-player"
                    poster={formData.coverImage || ''} // 封面
                    style={{ width: '100%', maxWidth: '700px', marginTop: '0.5rem' }}
                  >
                    您的浏览器不支持视频播放
                  </video>
                </div>
              )}
            </>
          )}
          
          {/* 发布按钮 - 流光+3D美化 */}
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ 
              marginTop: '2rem',
              padding: '1.2rem 2rem',
              fontSize: '1.1rem',
              fontWeight: 700
            }}
          >
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}>
                <span className="loading"></span>
                发布中...
              </div>
            ) : (
              '发布博客'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PublishBlog;