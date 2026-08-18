import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthPage = ({ theme }) => {
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleProviderLogin = async (provider) => {
    await login(provider);
    navigate('/app');
  };

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '12px',
    marginBottom: '12px',
    backgroundColor: `${theme.card}cc`,
    border: `1px solid ${theme.primary}44`,
    borderRadius: '8px',
    color: theme.text,
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  const buttonHoverStyle = {
    backgroundColor: `${theme.primary}22`,
    borderColor: theme.primary,
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: theme.bg,
      backgroundImage: theme.heroGradient,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--sans)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '40px',
        backgroundColor: `${theme.card}dd`,
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: `1px solid ${theme.primary}22`,
        boxShadow: `0 8px 32px rgba(0, 0, 0, 0.5)`,
        textAlign: 'center',
      }}>
        {/* Lock Icon Mock */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: `${theme.primary}22`,
          color: theme.primary,
          marginBottom: '20px',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>

        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: theme.text,
          marginBottom: '8px',
        }}>
          {isLogin ? 'Log Into NEXT STOP' : 'Sign Up for NEXT STOP'}
        </h2>
        
        <p style={{
          fontSize: '14px',
          color: theme.subtext,
          marginBottom: '32px',
        }}>
          {isLogin ? 'New to NEXT STOP? ' : 'Already have an account? '}
          <span 
            onClick={() => setIsLogin(!isLogin)}
            style={{ color: theme.primary, cursor: 'pointer', fontWeight: '600' }}
          >
            {isLogin ? 'Sign up for free' : 'Log in'}
          </span>
        </p>

        {/* Buttons */}
        <button 
          style={buttonStyle}
          onMouseEnter={e => Object.assign(e.currentTarget.style, buttonHoverStyle)}
          onMouseLeave={e => Object.assign(e.currentTarget.style, { backgroundColor: `${theme.card}cc`, borderColor: `${theme.primary}44` })}
          onClick={() => handleProviderLogin('google')}
        >
          <span style={{ marginRight: '12px', fontWeight: 'bold' }}>G</span> Log in with Google
        </button>

        <button 
          style={buttonStyle}
          onMouseEnter={e => Object.assign(e.currentTarget.style, buttonHoverStyle)}
          onMouseLeave={e => Object.assign(e.currentTarget.style, { backgroundColor: `${theme.card}cc`, borderColor: `${theme.primary}44` })}
          onClick={() => handleProviderLogin('microsoft')}
        >
          <span style={{ marginRight: '12px', fontWeight: 'bold' }}>M</span> Log in with Microsoft
        </button>

        <button 
          style={buttonStyle}
          onMouseEnter={e => Object.assign(e.currentTarget.style, buttonHoverStyle)}
          onMouseLeave={e => Object.assign(e.currentTarget.style, { backgroundColor: `${theme.card}cc`, borderColor: `${theme.primary}44` })}
          onClick={() => handleProviderLogin('phone')}
        >
          <svg style={{ marginRight: '12px' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg> 
          Log in with Phone Number
        </button>

        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
          <button 
            style={{ ...buttonStyle, marginBottom: 0, flex: 1 }}
            onMouseEnter={e => Object.assign(e.currentTarget.style, buttonHoverStyle)}
            onMouseLeave={e => Object.assign(e.currentTarget.style, { backgroundColor: `${theme.card}cc`, borderColor: `${theme.primary}44` })}
            onClick={() => handleProviderLogin('email')}
          >
            Email
          </button>
          
          <button 
            style={{ ...buttonStyle, marginBottom: 0, flex: 1 }}
            onMouseEnter={e => Object.assign(e.currentTarget.style, buttonHoverStyle)}
            onMouseLeave={e => Object.assign(e.currentTarget.style, { backgroundColor: `${theme.card}cc`, borderColor: `${theme.primary}44` })}
            onClick={() => handleProviderLogin('sso')}
          >
            SSO
          </button>
        </div>
        
        <div style={{ marginTop: '30px', fontSize: '12px', color: theme.subtext, opacity: 0.7 }}>
          By clicking continue, you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
