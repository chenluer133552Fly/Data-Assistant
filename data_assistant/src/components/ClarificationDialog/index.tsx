import { useState } from 'react';
import { useChatStore } from '../../stores/chatStore';
import './ClarificationDialog.css';

export default function ClarificationDialog() {
  const [answer, setAnswer] = useState('');
  const setShowClarification = useChatStore((s) => s.setShowClarification);

  const handleSubmit = () => {
    setShowClarification(false);
  };

  const handleSkip = () => {
    setShowClarification(false);
  };

  return (
    <div className="clarification">
      <div className="clarification__card">
        <span className="clarification__icon">❓</span>
        <h3 className="clarification__title">I need a few clarifications</h3>
        <p className="clarification__text">
          Please provide the specific region or location where you need to collect transaction records.
        </p>
        <textarea
          className="clarification__input"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Please Provide Additional Details."
          rows={3}
        />
        <div className="clarification__actions">
          <button className="clarification__btn clarification__btn--skip" onClick={handleSkip}>
            Skip
          </button>
          <button className="clarification__btn clarification__btn--submit" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
