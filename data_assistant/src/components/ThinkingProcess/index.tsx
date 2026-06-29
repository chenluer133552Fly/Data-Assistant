import { useState } from 'react';
import type { PipelineStep } from '../../types/query';
import './ThinkingProcess.css';

interface Props {
  steps: PipelineStep[];
  elapsed: number;
}

export default function ThinkingProcess({ steps, elapsed }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="thinking">
      <div className="thinking__header" onClick={() => setCollapsed(!collapsed)}>
        <span className="thinking__icon">🧠</span>
        <span className="thinking__title">THINKING PROCESS...</span>
        <span className="thinking__time">{elapsed}s</span>
        <span className={`thinking__chevron ${collapsed ? 'thinking__chevron--collapsed' : ''}`}>
          ∨
        </span>
      </div>

      {!collapsed && (
        <div className="thinking__steps">
          {steps.map((step) => (
            <div key={step.stepNumber} className={`thinking__step thinking__step--${step.status}`}>
              <div className="thinking__step-badge">
                {step.status === 'completed' ? (
                  <span className="thinking__check">✓</span>
                ) : step.status === 'running' ? (
                  <span className="thinking__spinner" />
                ) : (
                  <span className="thinking__dot-pending" />
                )}
                STEP {String(step.stepNumber).padStart(2, '0')}
              </div>
              <div className="thinking__step-content">
                <div className="thinking__step-name">{step.name}</div>
                {step.status !== 'pending' && (
                  <div className="thinking__step-detail">{step.detail}</div>
                )}
                {step.data && (
                  <div className="thinking__sql">
                    <div className="thinking__sql-header">
                      <span>SQL</span>
                      <button className="thinking__sql-download" aria-label="Download SQL">⬇</button>
                    </div>
                    <pre className="thinking__sql-code">{step.data}</pre>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
