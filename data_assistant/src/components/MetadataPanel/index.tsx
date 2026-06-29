import { useState } from 'react';
import './MetadataPanel.css';

interface Props {
  onClose: () => void;
}

type Tab = 'metadata' | 'domain' | 'glossary';

const MOCK_METADATA = [
  { term: 'BCBS', description: 'Basel Committee on Banking Supervision' },
  { term: 'BDSIG', description: 'Banking Data & Standard Infrastructure Group' },
  { term: 'BSM', description: 'Branch Service Model' },
  { term: 'DCMM', description: 'Data Centre & Mainframe Management' },
  { term: 'CADP', description: 'CMB Analytics Data Warehouse' },
  { term: 'CASA', description: 'Current Account Savings Account' },
  { term: 'CMS', description: 'Campaign Management System' },
  { term: 'CPMS', description: 'Customer Portfolio Management II' },
  { term: 'ECP', description: 'Entity Channel Preferences' },
];

const MOCK_DOMAIN = [
  'For the digital, e.g. of AIT, with CP Account Holder',
  'Info_Asset_Type_cd, Full_Nm, c.f. part_c.f. Account Holder',
  'c.f.a_Asset_Type_cd, Full_Nm, c.f. part_c.f Account Holder',
  'c.f.a_Asset_Type_cd, Full_Nm, c.f. part_c.f Account Holder',
  'c.f.a_Asset_Type_cd, Full_Nm, c.f. part_c.f Account Holder',
];

const MOCK_GLOSSARY = [
  { term: 'BCBS', description: 'Basel Committee on Banking Supervision' },
  { term: 'BSM', description: 'Branch Service Model' },
  { term: 'B1', description: 'Business Bill' },
  { term: 'DCMM', description: 'DCMM Analytics Data Warehouse' },
  { term: 'CASA', description: 'Current Account Savings Account' },
  { term: 'CEBS', description: 'Customer East European' },
  { term: 'CPMS', description: 'Customer Portfolio Management System' },
  { term: 'GCR', description: 'Delivery Channel Processor' },
];

export default function MetadataPanel({ onClose }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('metadata');

  return (
    <div className="metadata-panel">
      <div className="metadata-panel__header">
        <div className="metadata-panel__tabs">
          <button
            className={`metadata-panel__tab ${activeTab === 'metadata' ? 'metadata-panel__tab--active' : ''}`}
            onClick={() => setActiveTab('metadata')}
          >
            Metadata
          </button>
          <button
            className={`metadata-panel__tab ${activeTab === 'domain' ? 'metadata-panel__tab--active' : ''}`}
            onClick={() => setActiveTab('domain')}
          >
            Domain Knowledge
          </button>
          <button
            className={`metadata-panel__tab ${activeTab === 'glossary' ? 'metadata-panel__tab--active' : ''}`}
            onClick={() => setActiveTab('glossary')}
          >
            Glossary
          </button>
        </div>
        <button className="metadata-panel__close" onClick={onClose}>✕</button>
      </div>

      <div className="metadata-panel__content">
        {activeTab === 'metadata' && (
          <div className="metadata-panel__table-wrap">
            <table className="metadata-panel__table">
              <thead>
                <tr>
                  <th>Term</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_METADATA.map((item, i) => (
                  <tr key={i}>
                    <td>{item.term}</td>
                    <td>{item.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'domain' && (
          <div className="metadata-panel__list">
            <h4 className="metadata-panel__list-title">Account Business Banking</h4>
            <ul>
              {MOCK_DOMAIN.map((item, i) => (
                <li key={i} className="metadata-panel__list-item">• {item}</li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'glossary' && (
          <div className="metadata-panel__table-wrap">
            <table className="metadata-panel__table">
              <thead>
                <tr>
                  <th>Term</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_GLOSSARY.map((item, i) => (
                  <tr key={i}>
                    <td>{item.term}</td>
                    <td>{item.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
