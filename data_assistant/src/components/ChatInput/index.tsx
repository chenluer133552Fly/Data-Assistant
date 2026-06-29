import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../../stores/chatStore';
import ExampleSentences from './ExampleSentences';
import './ChatInput.css';

interface Props {
  onNewChat?: () => void;
}

export default function ChatInput({ onNewChat }: Props) {
  const [text, setText] = useState('');
  const [showExamples, setShowExamples] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { submitQuery, isProcessing } = useChatStore();

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed || isProcessing) return;
    submitQuery(trimmed);
    setText('');
    setShowExamples(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setText(val);
    if (val === '/') {
      setShowExamples(true);
    } else if (!val.startsWith('/')) {
      setShowExamples(false);
    }
  };

  const handleSelectExample = (example: string) => {
    setText(example);
    setShowExamples(false);
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.chat-input') && !target.closest('.example-sentences')) {
        setShowExamples(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="chat-input-wrapper">
      {showExamples && (
        <ExampleSentences onSelect={handleSelectExample} onClose={() => setShowExamples(false)} />
      )}
      <div className="chat-input">
        <div className="chat-input__row">
          <span className="chat-input__sparkle">✨</span>
          <input
            ref={inputRef}
            className="chat-input__field"
            type="text"
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask me a question，Enter [ / ] view example sentences"
            disabled={isProcessing}
          />
          <button
            className="chat-input__send"
            onClick={handleSubmit}
            disabled={!text.trim() || isProcessing}
            aria-label="Send"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="chat-input__chips">
          {onNewChat && (
            <button className="chat-input__chip chat-input__chip--new" onClick={onNewChat}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New Conversation
            </button>
          )}
          <button className="chat-input__chip">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
            </svg>
            Upload File
          </button>
          <button className="chat-input__chip">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
            </svg>
            Networking
          </button>
        </div>
      </div>
    </div>
  );
}
