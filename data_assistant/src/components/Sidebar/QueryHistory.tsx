import { useState } from 'react';
import { mockPinnedQueries, mockQueryHistory } from '../../services/mockData';

function SectionHeader({
  label,
  collapsed,
  onToggle,
}: {
  label: string;
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`sidebar__section-header ${collapsed ? 'sidebar__section-header--collapsed' : ''}`}
      onClick={onToggle}
    >
      <span>{label}</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  );
}

export default function QueryHistory() {
  const [sections, setSections] = useState({
    pinned: false,
    today: false,
    yesterday: false,
    prev7: false,
  });

  const toggle = (key: keyof typeof sections) =>
    setSections((s) => ({ ...s, [key]: !s[key] }));

  const todayItems = mockQueryHistory.filter((h) => h.date === 'today');
  const yesterdayItems = mockQueryHistory.filter((h) => h.date === 'yesterday');
  const prev7Items = mockQueryHistory.filter((h) => h.date === 'prev7');

  return (
    <div className="sidebar__history-list">
      <SectionHeader label="Pinned for 60 days" collapsed={sections.pinned} onToggle={() => toggle('pinned')} />
      {!sections.pinned &&
        mockPinnedQueries.map((q, i) => (
          <button key={i} className="sidebar__history-item">{q}</button>
        ))}

      <SectionHeader label="Today" collapsed={sections.today} onToggle={() => toggle('today')} />
      {!sections.today &&
        todayItems.map((h) => (
          <button key={h.id} className="sidebar__history-item">{h.text}</button>
        ))}

      <SectionHeader label="Yesterday" collapsed={sections.yesterday} onToggle={() => toggle('yesterday')} />
      {!sections.yesterday &&
        yesterdayItems.map((h) => (
          <button key={h.id} className="sidebar__history-item">{h.text}</button>
        ))}

      <SectionHeader label="Previous 7 days" collapsed={sections.prev7} onToggle={() => toggle('prev7')} />
      {!sections.prev7 &&
        prev7Items.map((h) => (
          <button key={h.id} className="sidebar__history-item">{h.text}</button>
        ))}
    </div>
  );
}
