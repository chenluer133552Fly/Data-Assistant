import { useState } from 'react';
import { useAppStore } from '../../stores/appStore';
import { useChatStore } from '../../stores/chatStore';
import { mockTemplates } from '../../services/mockData';
import ChatInput from '../../components/ChatInput';
import QuickQuestionCard, { AddTemplateCard } from '../../components/QuickQuestionCard';
import type { QuickTemplate } from '../../types/template';
import './WelcomePage.css';

const CARDS_PER_PAGE = 5;

export default function WelcomePage() {
  const user = useAppStore((s) => s.user);
  const submitQuery = useChatStore((s) => s.submitQuery);
  const [groupIndex, setGroupIndex] = useState(0);

  const start = groupIndex * CARDS_PER_PAGE;
  const visibleTemplates = mockTemplates.slice(start, start + CARDS_PER_PAGE);

  const handleNextGroup = () => {
    const nextStart = (groupIndex + 1) * CARDS_PER_PAGE;
    setGroupIndex(nextStart >= mockTemplates.length ? 0 : groupIndex + 1);
  };

  const handleCardClick = (template: QuickTemplate) => {
    submitQuery(template.description);
  };

  return (
    <div className="welcome">
      <div className="welcome__hero">
        <h1 className="welcome__greeting">Hi, {user.name}</h1>
        <p className="welcome__subtitle">Welcome to Data Assistant</p>
      </div>

      <div className="welcome__input-area">
        <ChatInput />
      </div>

      <div className="welcome__templates">
        <div className="welcome__templates-header">
          <span className="welcome__templates-title">Quick Question</span>
          <button className="welcome__next-group" onClick={handleNextGroup}>
            ↻ Next Group
          </button>
        </div>
        <div className="welcome__grid">
          {visibleTemplates.map((t) => (
            <QuickQuestionCard key={t.id} template={t} onClick={handleCardClick} />
          ))}
          <AddTemplateCard />
        </div>
      </div>
    </div>
  );
}
