import { useState } from 'react';
import { useAppStore } from '../../stores/appStore';
import DataRangeSelector from './DataRangeSelector';
import QueryHistory from './QueryHistory';
import MetadataPanel from '../MetadataPanel';
import hsbcLogo from '../../assets/hsbc-logo.svg';
import './Sidebar.css';

export default function Sidebar() {
  const { sidebarCollapsed } = useAppStore();
  const [showMetadata, setShowMetadata] = useState(false);

  return (
    <>
      <aside className={`sidebar ${sidebarCollapsed ? 'sidebar--collapsed' : ''}`}>
        <div className="sidebar__brand">
          <img src={hsbcLogo} alt="HSBC" className="sidebar__logo" />
          {!sidebarCollapsed && <span className="sidebar__brand-text">HSBC</span>}
        </div>

        {sidebarCollapsed ? (
          <div className="sidebar__icons">
            <button className="sidebar__icon-btn" title="Data Assistent">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b9fff" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </button>
            <button className="sidebar__icon-btn" title="Data Range">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            </button>
            <button className="sidebar__icon-btn" title="History">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </button>
            <button className="sidebar__icon-btn" title="Saved Queries">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
              </svg>
            </button>
            <div className="sidebar__icons-spacer" />
            <button className="sidebar__icon-btn" title="Show Metadata" onClick={() => setShowMetadata(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </button>
          </div>
        ) : (
          <>
            <div className="sidebar__app-name">
              <div className="sidebar__app-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b9fff" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
              </div>
              <span>Data Assistent</span>
            </div>

            <DataRangeSelector />

            <QueryHistory />

            <div className="sidebar__footer">
              <button className="sidebar__footer-btn" onClick={() => setShowMetadata(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
                <span>Show Metadata</span>
              </button>
              <button className="sidebar__footer-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                </svg>
                <span>Saved Queries</span>
              </button>
            </div>
          </>
        )}
      </aside>
      {showMetadata && <MetadataPanel onClose={() => setShowMetadata(false)} />}
    </>
  );
}
