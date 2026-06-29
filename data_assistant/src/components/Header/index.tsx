import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../../stores/appStore';
import './Header.css';

export default function Header() {
  const { toggleSidebar, user } = useAppStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!userMenuRef.current?.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowUserMenu(false);
        setShowSettingsModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleSettingsClick = () => {
    setShowUserMenu(false);
    setShowSettingsModal(true);
  };

  return (
    <>
      <header className="header">
        <button className="header__hamburger" onClick={toggleSidebar} aria-label="Toggle sidebar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
        <div className="header__user" ref={userMenuRef}>
          <button
            className="header__avatar"
            onClick={() => setShowUserMenu((show) => !show)}
            aria-label="Open user menu"
            aria-expanded={showUserMenu}
          >
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <span>{user.name.charAt(0)}</span>
            )}
          </button>
          {showUserMenu && (
            <div className="header__dropdown">
              <button className="header__dropdown-item" onClick={handleSettingsClick}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
                </svg>
                Settings
              </button>
            </div>
          )}
        </div>
      </header>

      {showSettingsModal && (
        <div className="settings-modal-overlay" onClick={() => setShowSettingsModal(false)}>
          <div className="settings-modal" onClick={(event) => event.stopPropagation()}>
            <div className="settings-modal__header">
              <h3 className="settings-modal__title">Settings</h3>
              <button
                className="settings-modal__close"
                onClick={() => setShowSettingsModal(false)}
                aria-label="Close settings"
              >
                x
              </button>
            </div>
            <div className="settings-modal__profile">
              <div className="settings-modal__avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <span>{user.name.charAt(0)}</span>
                )}
              </div>
              <div>
                <div className="settings-modal__name">{user.name}</div>
                <div className="settings-modal__description">Data Assistant account settings</div>
              </div>
            </div>
            <div className="settings-modal__footer">
              <button className="settings-modal__done" onClick={() => setShowSettingsModal(false)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
