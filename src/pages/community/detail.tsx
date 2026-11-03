import { Button, Collapse, Result } from "antd";
import {
  ArrowLeftOutlined,
  FileTextOutlined,
  FlagOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { allSignals } from "../../common/mock-data";
import {
  detailContent,
  kpis,
  personaSections,
  schedule,
  scoreBreakdown,
} from "../../common/detail-content";
import { useWorkspace } from "../../common/use-workspace";
import {
  IdeaActions,
  IdeaBadges,
  ListState,
  SignalCard,
} from "../../components/ui";
import { useIdeaOperations } from "../../components/use-idea-operations";

export default function CommunityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { database, loading, error, reload } = useWorkspace();
  const { copy, remove, dialogs } = useIdeaOperations(
    "community",
    () => void navigate("/community")
  );
  const idea = database.community.find((item) => item.id === id);
  if (loading || error)
    return (
      <ListState loading={loading} error={error} retry={() => void reload()} />
    );
  if (!idea)
    return (
      <Result
        status="404"
        title="Public idea not found"
        subTitle="The publisher may have removed this idea."
        extra={
          <Button onClick={() => void navigate("/community")}>
            Back to Ideation Community
          </Button>
        }
      />
    );
  const selected = allSignals.filter((signal) =>
    idea.selection.signalIds.includes(signal.id)
  );
  return (
    <div className="detail-page community-detail">
      <Button
        type="text"
        className="back-button"
        icon={<ArrowLeftOutlined />}
        onClick={() => void navigate("/community")}
      >
        Back to Ideation Community
      </Button>
      <header className="detail-title surface">
        <div>
          <div className="detail-labels">
            <span>Segment: {idea.segment}</span>
            <span>Product: {idea.product}</span>
            <span>Objective: {idea.objective}</span>
            <span>Created by: {idea.author}</span>
          </div>
          <h1>{idea.title}</h1>
        </div>
        <IdeaActions
          idea={idea}
          module="community"
          onCopy={copy}
          onDelete={remove}
        />
      </header>
      <div className="detail-columns">
        <article className="detail-body surface">
          {detailContent(idea).map((section) => (
            <section className="detail-section" key={section.title}>
              <h2>
                <FileTextOutlined /> {section.title}
              </h2>
              <p>{section.text}</p>
            </section>
          ))}
          <section className="detail-section">
            <h2>
              <FileTextOutlined /> Target Persona
            </h2>
            {personaSections.map(([title, text]) => (
              <div className="persona" key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </section>
          <section className="detail-section">
            <h2>
              <FileTextOutlined /> Recommended Schedule
            </h2>
            <div className="schedule-grid">
              {schedule.map(([label, value]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </section>
          <section className="detail-section">
            <h2>
              <FlagOutlined /> Priority Rationale
            </h2>
            <IdeaBadges idea={idea} />
            <div className="breakdown-grid">
              {scoreBreakdown(idea.score).map((item, index) => (
                <div key={item.label}>
                  <div>
                    <span>{item.label}</span>
                    <b>
                      {item.score}/{item.max}
                    </b>
                  </div>
                  <progress
                    className={`metric metric-${index}`}
                    value={item.score}
                    max={item.max}
                    aria-label={item.label}
                  />
                </div>
              ))}
            </div>
            <p>
              Strong strategic fit and customer relevance. Validate customer
              readiness and execution assumptions before launch.
            </p>
          </section>
          <section className="detail-section">
            <h2>
              <FlagOutlined /> Expected KPIs
            </h2>
            <ul className="kpi-list">
              {kpis.map((kpi) => (
                <li key={kpi}>{kpi}</li>
              ))}
            </ul>
          </section>
          <section className="detail-section">
            <h2>
              <FlagOutlined /> Expected Conversion Estimate
            </h2>
            <span className="conversion-estimate">6.5%</span>
            <p>
              Conversion event is a completed advisory conversation followed by
              a qualified action among eligible reached customers within 21
              days. This is an unvalidated planning estimate, not a forecast or
              guaranteed outcome.
            </p>
          </section>
        </article>
        <aside className="detail-sidebar surface">
          <Collapse
            ghost
            defaultActiveKey={["product", "signals"]}
            items={[
              {
                key: "product",
                label: "Focus Product",
                children: <div className="detail-product">{idea.product}</div>,
              },
              {
                key: "signals",
                label: "Selected Signals",
                children: (
                  <div className="detail-signals">
                    {selected.map((signal) => (
                      <SignalCard key={signal.id} signal={signal} />
                    ))}
                  </div>
                ),
              },
              {
                key: "stages",
                label: "Preferred CLCM Stage",
                children: (
                  <p>{idea.selection.stages.join(", ") || "No preference"}</p>
                ),
              },
              {
                key: "channels",
                label: "Preferred Channels",
                children: (
                  <p>{idea.selection.channels.join(", ") || "No preference"}</p>
                ),
              },
              ...(idea.selection.notes
                ? [
                    {
                      key: "notes",
                      label: "Additional information",
                      children: <p>{idea.selection.notes}</p>,
                    },
                  ]
                : []),
            ]}
          />
        </aside>
      </div>
      {dialogs}
    </div>
  );
}
