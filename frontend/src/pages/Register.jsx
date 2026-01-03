import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/register', formData);
      if (res.success) {
        alert('注册成功，请登录');
        navigate('/login');
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || '注册失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card form">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#2c3e50' }}>注册</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="error-text">{error}</p>}
          
          <div className="form-group">
            <label className="form-label">用户名</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-input"
              placeholder="请输入用户名"
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">邮箱</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="请输入邮箱"
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">密码</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="请输入6位以上密码"
              disabled={loading}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '注册中...' : '注册'}
          </button>
          
          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#7f8c8d' }}>
            已有账号？<Link to="/login" style={{ color: '#3498db' }}>立即登录</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;