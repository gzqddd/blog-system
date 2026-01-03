import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Profile = ({ user, setUser }) => {
  const [formData, setFormData] = useState({
    username: user?.username || '', // 新增用户名字段
    avatar: user?.avatar || '',
    bio: user?.bio || ''
  });
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
        setFormData({ ...formData, avatar: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await api.put('/profile', formData);
      if (res.success) {
        setMessageType('success');
        setMessage(res.message);
        setUser(res.user);
        localStorage.setItem('blog-user', JSON.stringify(res.user));
      }
    } catch (err) {
      setMessageType('error');
      setMessage(err.response?.data?.message || '更新失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card profile-container">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#2c3e50' }}>个人信息设置</h2>
        
        <form onSubmit={handleSubmit}>
          {message && (
            <p className={messageType === 'success' ? 'success-text' : 'error-text'}>
              {message}
            </p>
          )}
          
          {/* 新增：用户名修改 */}
          <div className="form-group">
            <label className="form-label">用户名</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="form-input"
              placeholder="请输入新用户名"
              disabled={loading}
            />
          </div>
          
          {/* 头像上传 */}
          <div className="form-group">
            <label className="form-label">头像</label>
            <div className="upload-container" onClick={() => document.getElementById('avatar-input').click()}>
              <input
                type="file"
                id="avatar-input"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
              <p>点击上传头像（支持jpg/png）</p>
              {preview || formData.avatar ? (
                <img 
                  src={preview || formData.avatar} 
                  alt="头像预览" 
                  className="upload-preview profile-avatar"
                />
              ) : (
                <p style={{ marginTop: '1rem', color: '#7f8c8d' }}>暂无预览</p>
              )}
            </div>
          </div>
          
          {/* 个人简介 */}
          <div className="form-group">
            <label className="form-label">个人简介</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="form-textarea"
              placeholder="请输入个人简介"
              disabled={loading}
            />
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '保存中...' : '保存修改'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;