import { Collapse, Input, Progress } from "antd";
import { FileTextOutlined, FlagOutlined } from "@ant-design/icons";
import { allSignals } from "../../common/mock-data";
import type { Idea } from "../../common/types";
import { validationSections } from "../../common/validation";
import { scoreBreakdown } from "../../common/detail-content";
import { IdeaBadges } from "../../components/ui";

// Validation owns its presentation; its source drawer always receives an immutable snapshot.
export function ValidationContent({
    idea,
    content,
    editing = false,
    onChange,
}: {
    idea: Idea;
    content?: Record<string, string>;
    editing?: boolean;
    onChange?: (title: string, text: string) => void;
}) {
    const selected = allSignals.filter((signal) =>
        idea.selection.signalIds.includes(signal.id),
    );
    return (
        <div className="validation-columns">
            <article className="validation-body">
                {validationSections(idea)
                    .slice(0, -2)
                    .map((section) => (
                        <section
                            className="validation-section"
                            key={section.title}
                        >
                            <h2>
                                <FileTextOutlined /> {section.title}
                                {editing && !section.editable && (
                                    <span className="readonly-label">
                                        Read only
                                    </span>
                                )}
                            </h2>
                            {editing && section.editable ? (
                                <Input.TextArea
                                    aria-label={section.title}
                                    autoSize={{ minRows: 3 }}
                                    value={
                                        content?.[section.title] ?? section.text
                                    }
                                    onChange={(event) =>
                                        onChange?.(
                                            section.title,
                                            event.target.value,
                                        )
                                    }
                                />
                            ) : (
                                <p>
                                    {content?.[section.title] ?? section.text}
                                </p>
                            )}
                        </section>
                    ))}
                <section className="validation-section">
                    <h2>
                        <FlagOutlined /> Priority Rationale
                    </h2>
                    <IdeaBadges idea={idea} />
                    <div className="validation-breakdown">
                        {scoreBreakdown(idea.score).map((metric) => (
                            <div key={metric.label}>
                                <div>
                                    <span>{metric.label}</span>
                                    <span>
                                        {metric.score} / {metric.max}
                                    </span>
                                </div>
                                <Progress
                                    percent={(metric.score / metric.max) * 100}
                                    showInfo={false}
                                    size="small"
                                    strokeColor="#00a47c"
                                />
                            </div>
                        ))}
                    </div>
                    <p>
                        Strong strategic fit and customer relevance. Validate
                        customer readiness and execution assumptions before
                        launch.
                    </p>
                </section>
                {validationSections(idea)
                    .slice(-2)
                    .map((section) => (
                        <section
                            className="validation-section"
                            key={section.title}
                        >
                            <h2>
                                <FlagOutlined /> {section.title}
                                {editing && (
                                    <span className="readonly-label">
                                        Read only
                                    </span>
                                )}
                            </h2>
                            <p>{content?.[section.title] ?? section.text}</p>
                        </section>
                    ))}
            </article>
            <aside className="validation-sidebar">
                <Collapse
                    ghost
                    defaultActiveKey={["product", "signals"]}
                    items={[
                        {
                            key: "product",
                            label: "Focus Product",
                            children: <p>{idea.product}</p>,
                        },
                        {
                            key: "signals",
                            label: "Selected Signals",
                            children: (
                                <div className="validation-source-signals">
                                    {selected.map((signal) => (
                                        <div key={signal.id}>
                                            <span>{signal.category}</span>
                                            <h3>{signal.title}</h3>
                                            <p>{signal.description}</p>
                                            <ul>
                                                <li>{signal.publisher}</li>
                                                <li>{signal.product}</li>
                                                <li>{signal.segment}</li>
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            ),
                        },
                        {
                            key: "stages",
                            label: "Preferred CLCM Stage",
                            children: (
                                <p>
                                    {idea.selection.stages.join(", ") ||
                                        "No preference"}
                                </p>
                            ),
                        },
                        {
                            key: "channels",
                            label: "Preferred Channels",
                            children: (
                                <p>
                                    {idea.selection.channels.join(", ") ||
                                        "No preference"}
                                </p>
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
    );
}
