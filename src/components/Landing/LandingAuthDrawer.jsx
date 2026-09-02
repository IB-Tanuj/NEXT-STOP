import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LandingAuthDrawer = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [isLogin, setIsLogin] = React.useState(initialMode === 'login');
  const { login } = useAuth();
  const navigate = useNavigate();

  // Reset to initialMode when opened
  useEffect(() => {
    if (isOpen) {
      setIsLogin(initialMode === 'login');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, initialMode]);

  const handleProviderLogin = async (provider) => {
    await login(provider);
    navigate('/app');
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="auth-drawer-overlay" onClick={onClose} aria-hidden="true" />
      <div className="auth-drawer" role="dialog" aria-modal="true">
        <button className="auth-drawer-close" onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="auth-drawer-content">
          <div className="auth-drawer-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>

          <h2 className="auth-drawer-title">
            {isLogin ? 'Log Into NEXT STOP' : 'Sign Up for NEXT STOP'}
          </h2>
          
          <p className="auth-drawer-subtitle">
            {isLogin ? 'New to NEXT STOP? ' : 'Already have an account? '}
            <span 
              onClick={() => setIsLogin(!isLogin)}
              className="auth-drawer-toggle"
            >
              {isLogin ? 'Sign up for free' : 'Log in'}
            </span>
          </p>

          <div className="auth-drawer-buttons">
            <button className="auth-btn" onClick={() => handleProviderLogin('google')}>
              <span className="auth-btn-icon">G</span> Log in with Google
            </button>

            <button className="auth-btn" onClick={() => handleProviderLogin('microsoft')}>
              <span className="auth-btn-icon">M</span> Log in with Microsoft
            </button>

            <button className="auth-btn" onClick={() => handleProviderLogin('phone')}>
              <svg className="auth-btn-icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg> 
              Log in with Phone
            </button>

            <div className="auth-btn-group">
              <button className="auth-btn" onClick={() => handleProviderLogin('email')}>
                Email
              </button>
              <button className="auth-btn" onClick={() => handleProviderLogin('sso')}>
                SSO
              </button>
            </div>
          </div>
          
          <div className="auth-drawer-footer">
            By clicking continue, you agree to our Terms of Service and Privacy Policy.
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingAuthDrawer;
