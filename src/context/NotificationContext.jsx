import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children, theme }) => {
  const [toasts, setToasts] = useState([]);
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'alert', // 'alert', 'confirm', 'prompt'
    message: '',
    inputValue: '',
    resolve: null,
  });
  const inputRef = useRef(null);

  // Default fallback theme if not provided
  const t = theme || {
    bg: '#1a1a2e',
    card: '#16213e',
    primary: '#0f3460',
    text: '#ffffff',
    subtext: '#a0a0a0'
  };

  const showAlert = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto remove toast
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 4000);
  }, []);

  const showConfirm = useCallback((message) => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        type: 'confirm',
        message,
        inputValue: '',
        resolve
      });
    });
  }, []);

  const showPrompt = useCallback((message, defaultValue = '') => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        type: 'prompt',
        message,
        inputValue: defaultValue,
        resolve
      });
      // Focus input on next tick
      setTimeout(() => inputRef.current?.focus(), 10);
    });
  }, []);

  const handleModalClose = (confirmed) => {
    if (modalState.resolve) {
      if (modalState.type === 'prompt') {
        modalState.resolve(confirmed ? modalState.inputValue : null);
      } else {
        modalState.resolve(confirmed);
      }
    }
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <NotificationContext.Provider value={{ showAlert, showConfirm, showPrompt }}>
      {children}

      {/* TOASTS CONTAINER */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none'
      }}>
        {toasts.map(toast => (
          <div key={toast.id} style={{
            background: t.card,
            border: `1px solid ${toast.type === 'error' ? '#ff6b6b' : t.primary}66`,
            color: toast.type === 'error' ? '#ff6b6b' : t.text,
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: `0 8px 24px rgba(0,0,0,0.4)`,
            fontSize: '14px',
            fontWeight: '600',
            animation: 'fadeInUp 0.3s ease forwards',
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            {toast.type === 'error' ? '⚠️' : '🔔'} {toast.message}
          </div>
        ))}
      </div>

      {/* MODAL CONTAINER */}
      {modalState.isOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.2s ease',
          padding: '20px'
        }}>
          <div style={{
            background: t.bg,
            border: `1px solid ${t.primary}33`,
            borderRadius: '20px',
            padding: '30px',
            width: '100%',
            maxWidth: '400px',
            boxShadow: `0 20px 40px rgba(0,0,0,0.5)`,
            animation: 'slideUp 0.3s ease',
          }}>
            <div style={{ color: t.text, fontSize: '18px', fontWeight: '700', marginBottom: '20px', lineHeight: '1.5' }}>
              {modalState.message}
            </div>

            {modalState.type === 'prompt' && (
              <input
                ref={inputRef}
                type="text"
                value={modalState.inputValue}
                onChange={(e) => setModalState(prev => ({ ...prev, inputValue: e.target.value }))}
                onKeyDown={(e) => { if (e.key === 'Enter') handleModalClose(true); }}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: t.card,
                  border: `1px solid ${t.primary}66`,
                  color: t.text,
                  outline: 'none',
                  fontSize: '15px',
                  marginBottom: '20px',
                  boxSizing: 'border-box'
                }}
              />
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              {(modalState.type === 'confirm' || modalState.type === 'prompt') && (
                <button
                  onClick={() => handleModalClose(false)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    background: 'transparent',
                    border: `1px solid ${t.subtext}44`,
                    color: t.subtext,
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = `${t.subtext}11`}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  Cancel
                </button>
              )}
              
              <button
                onClick={() => handleModalClose(true)}
                style={{
                  padding: '10px 24px',
                  borderRadius: '10px',
                  background: t.primary,
                  border: 'none',
                  color: '#fff',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: `0 4px 12px ${t.primary}44`,
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                {modalState.type === 'alert' ? 'OK' : (modalState.type === 'prompt' ? 'Submit' : 'Confirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </NotificationContext.Provider>
  );
};
