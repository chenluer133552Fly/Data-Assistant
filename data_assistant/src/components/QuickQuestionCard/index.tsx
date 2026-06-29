import type { QuickTemplate } from '../../types/template';
import './QuickQuestionCard.css';

interface Props {
  template: QuickTemplate;
  onClick: (template: QuickTemplate) => void;
}

export default function QuickQuestionCard({ template, onClick }: Props) {
  return (
    <button className="quick-card" onClick={() => onClick(template)}>
      <div className="quick-card__title">{template.title}</div>
      <div className="quick-card__desc">{template.description}</div>
    </button>
  );
}

export function AddTemplateCard() {
  return (
    <button className="quick-card quick-card--add">
      <span className="quick-card__add-icon">⊕</span>
      <span className="quick-card__add-text">Add Templates</span>
    </button>
  );
}
