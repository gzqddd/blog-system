import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('blog-token');
    localStorage.removeItem('blog-user');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      {/* 极简博客标题 + 简介 - 华丽样式改造 */}
      <Link 
        to="/" 
        className="navbar-logo" 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'flex-start',
          textDecoration: 'none',
          zIndex: 1 // 保证logo层级
        }}
      >
        <span style={{
          fontSize: '1.8rem',
          fontWeight: 800,
          background: 'linear-gradient(90deg, #818cf8, #c084fc, #f472b6)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          textShadow: '0 0 10px rgba(129, 140, 248, 0.7)',
          letterSpacing: '1px'
        }}>我的博客</span>
        {/* 显示用户简介（字体更小，适配华丽样式） */}
        {user && user.bio && (
          <p style={{ 
            fontSize: '0.8rem', 
            color: '#a5b4fc', // 替换原ccc为适配的浅紫蓝
            margin: '0.2rem 0 0 0', 
            lineHeight: 1.2,
            textShadow: '0 0 5px rgba(165, 180, 252, 0.3)'
          }}>
            {user.bio}
          </p>
        )}
      </Link>
      
      {/* 导航链接 - 适配华丽样式，保留所有跳转逻辑 */}
      <div className="navbar-links">
        <Link 
          to="/" 
          className="navbar-link"
          style={{
            position: 'relative',
            padding: '0.5rem 0',
            fontSize: '1.05rem'
          }}
        >
          首页
        </Link>
        {user && (
          <Link 
            to="/publish" 
            className="navbar-link"
            style={{
              position: 'relative',
              padding: '0.5rem 0',
              fontSize: '1.05rem'
            }}
          >
            发表博客
          </Link>
        )}
        {user && (
          <Link 
            to="/profile" 
            className="navbar-link"
            style={{
              position: 'relative',
              padding: '0.5rem 0',
              fontSize: '1.05rem'
            }}
          >
            个人中心
          </Link>
        )}
        {!user && (
          <Link 
            to="/login" 
            className="navbar-link"
            style={{
              position: 'relative',
              padding: '0.5rem 0',
              fontSize: '1.05rem'
            }}
          >
            登录
          </Link>
        )}
        {!user && (
          <Link 
            to="/register" 
            className="navbar-link"
            style={{
              position: 'relative',
              padding: '0.5rem 0',
              fontSize: '1.05rem'
            }}
          >
            注册
          </Link>
        )}
      </div>
      
      {/* 登录用户信息 - 华丽样式改造，保留退出逻辑 */}
      {user && (
        <div className="navbar-user" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.2rem',
          padding: '0.5rem 0'
        }}>
          {user.avatar && (
            <img 
              src={user.avatar} 
              alt={user.username} 
              className="user-avatar"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #818cf8',
                boxShadow: '0 0 10px rgba(129, 140, 248, 0.8)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.1) rotate(5deg)';
                e.target.style.boxShadow = '0 0 15px rgba(129, 140, 248, 1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1) rotate(0)';
                e.target.style.boxShadow = '0 0 10px rgba(129, 140, 248, 0.8)';
              }}
            />
          )}
          <span style={{
            color: '#c7d2fe',
            fontSize: '1.05rem',
            textShadow: '0 0 5px rgba(199, 210, 254, 0.3)'
          }}>欢迎, {user.username}</span>
          <button 
            className="logout-btn" 
            onClick={handleLogout}
            style={{
              background: 'linear-gradient(90deg, #ec4899 0%, #be185d 100%)',
              border: 'none',
              color: 'white',
              padding: '0.7rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)',
              transition: 'all 0.3s ease',
              fontSize: '1rem'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 6px 20px rgba(236, 72, 153, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(236, 72, 153, 0.4)';
            }}
          >
            退出
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;