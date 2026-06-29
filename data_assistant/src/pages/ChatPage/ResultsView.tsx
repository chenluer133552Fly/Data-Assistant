import { useChatStore } from '../../stores/chatStore';
import ThinkingProcess from '../../components/ThinkingProcess';
import DataTable from '../../components/DataTable';
import ClarificationDialog from '../../components/ClarificationDialog';
import FeedbackDialog from '../../components/FeedbackDialog';
import ResultChart from '../../components/ResultChart';
import ExplainReasoning from '../../components/ExplainReasoning';
import './ResultsView.css';

export default function ResultsView() {
  const {
    conversations,
    activeConversationId,
    elapsedTime,
    showClarification,
    showFeedback,
    setShowFeedback,
  } = useChatStore();

  const conversation = conversations.find((c) => c.id === activeConversationId);
  if (!conversation) return null;

  const { query, steps, status, result } = conversation;
  return (
    <div className="results">
        <div className="results__inquiry-block">
          <div className="results__inquiry">
            <span className="results__inquiry-icon">Q</span>
            <span className="results__inquiry-label">INQUIRY</span>
          </div>
          <h2 className="results__query">{query}</h2>
        </div>

        <div className="results__disclaimer">
          <span className="results__disclaimer-icon">!</span>
          AI Output May Not Always Be Accurate. Please Review It Before Using.
        </div>

        {steps.length > 0 && (
          <ThinkingProcess steps={steps} elapsed={elapsedTime} />
        )}

        {showClarification && <ClarificationDialog />}

        {status === 'completed' && result && (
          <>
            <section className="results__summary">
              <div className="results__summary-header">
                <span>SUMMARIZE DATA</span>
              </div>
              <article className="results__markdown">
                <p className="results__markdown-question">{result.summary.text}</p>
                <h3>Executive Summary</h3>
                <p>
                  Based on the generated dataset, mainland China new customer acquisition on
                  <strong> 2026-01-01 </strong>
                  shows a concentrated regional pattern and a strong digital-channel skew.
                </p>
                <h3>Analysis Insights</h3>
                <ol>
                  {result.summary.keyFindings.map((finding, i) => (
                    <li key={i} dangerouslySetInnerHTML={{ __html: finding }} />
                  ))}
                </ol>
                <h3>Recommended Follow-up</h3>
                <p>
                  Review channel-level conversion metrics for Shanghai, Beijing, and Guangdong, then compare branch
                  acquisition cost against online acquisition cost.
                </p>
              </article>
            </section>

            <DataTable
              title={result.table.title}
              columns={result.table.columns}
              rows={result.table.rows}
              totalRows={result.table.totalRows}
              pageSize={result.table.pageSize}
            />

            <ResultChart />

            <ExplainReasoning />

            <div className="results__feedback-row">
              <button className="results__thumbs" onClick={() => setShowFeedback(true)} aria-label="Dislike">
                -
              </button>
              <button className="results__thumbs" aria-label="Like">+</button>
            </div>
          </>
        )}

        {showFeedback && <FeedbackDialog />}
    </div>
  );
}
