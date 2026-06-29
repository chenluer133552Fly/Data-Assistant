import { useState } from 'react';
import { mockRecommendedExamples, mockFrequentExamples } from '../../services/mockData';

interface Props {
  onSelect: (example: string) => void;
  onClose: () => void;
}

export default function ExampleSentences({ onSelect }: Props) {
  const [tab, setTab] = useState<'recommended' | 'frequent'>('recommended');
  const examples = tab === 'recommended' ? mockRecommendedExamples : mockFrequentExamples;

  return (
    <div className="example-sentences">
      <div className="example-sentences__header">
        <span className="example-sentences__title">Examples</span>
      </div>
      <div className="example-sentences__tabs">
        <button
          className={`example-sentences__tab ${tab === 'recommended' ? 'example-sentences__tab--active' : ''}`}
          onClick={() => setTab('recommended')}
        >
          <span className="example-sentences__dot">●</span> Recommended
        </button>
        <button
          className={`example-sentences__tab ${tab === 'frequent' ? 'example-sentences__tab--active' : ''}`}
          onClick={() => setTab('frequent')}
        >
          Frequent
        </button>
        <button className="example-sentences__refresh">↻ Refresh</button>
      </div>
      <div className="example-sentences__list">
        {examples.map((ex, i) => (
          <button key={i} className="example-sentences__item" onClick={() => onSelect(ex)}>
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
