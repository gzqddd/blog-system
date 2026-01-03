import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({
    username: '',
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
      const res = await api.post('/auth/login', formData);
      if (res.success) {
        // 存储Token和用户信息
        localStorage.setItem('blog-token', res.token);
        localStorage.setItem('blog-user', JSON.stringify(res.user));
        setUser(res.user);
        navigate('/');
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || '登录失败，请检查账号密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card form">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#2c3e50' }}>登录</h2>
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
            <label className="form-label">密码</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="请输入密码"
              disabled={loading}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '登录中...' : '登录'}
          </button>
          
          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#7f8c8d' }}>
            还没有账号？<Link to="/register" style={{ color: '#3498db' }}>立即注册</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;