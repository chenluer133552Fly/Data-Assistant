import { useState } from 'react';
import { useChatStore } from '../../stores/chatStore';
import './FeedbackDialog.css';

const FEEDBACK_TAGS = [
  'Irrelevant answer',
  'Incorrect data',
  'Incomplete information',
  'Incomprehensible',
];

export default function FeedbackDialog() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [detail, setDetail] = useState('');
  const setShowFeedback = useChatStore((s) => s.setShowFeedback);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    setShowFeedback(false);
  };

  return (
    <div className="feedback-overlay" onClick={() => setShowFeedback(false)}>
      <div className="feedback" onClick={(e) => e.stopPropagation()}>
        <div className="feedback__header">
          <h3 className="feedback__title">Feedback</h3>
          <button className="feedback__close" onClick={() => setShowFeedback(false)}>✕</button>
        </div>
        <p className="feedback__question">What's wrong with this answer?</p>
        <div className="feedback__tags">
          {FEEDBACK_TAGS.map((tag) => (
            <button
              key={tag}
              className={`feedback__tag ${selectedTags.includes(tag) ? 'feedback__tag--active' : ''}`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
        <textarea
          className="feedback__textarea"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder="You can tell us the specific reasons so we can improve."
          rows={4}
        />
        <div className="feedback__footer">
          <button className="feedback__submit" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
}
