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

export default function LeadsDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { database, loading, error, reload } = useWorkspace();
    const { publish, remove, dialogs } = useIdeaOperations(
        "leads",
        () => void navigate("/leads"),
    );
    const idea = database.leads.find((item) => item.id === id);
    if (loading || error)
        return (
            <ListState
                loading={loading}
                error={error}
                retry={() => void reload()}
            />
        );
    if (!idea)
        return (
            <Result
                status="404"
                title="Idea not found"
                subTitle="This idea may have been removed."
                extra={
                    <Button onClick={() => void navigate("/leads")}>
                        Back to Leads Ideation
                    </Button>
                }
            />
        );
    const selected = allSignals.filter((signal) =>
        idea.selection.signalIds.includes(signal.id),
    );
    return (
        <div className="detail-page leads-detail">
            <Button
                type="text"
                className="back-button [&.ant-btn]:m-[-12px_0_14px_-11px] [&.ant-btn]:text-[#75837c] [&.ant-btn]:text-[11px]"
                icon={<ArrowLeftOutlined />}
                onClick={() => void navigate("/leads")}
            >
                Back to Leads Ideation
            </Button>
            <header className="detail-title flex items-start justify-between p-[21px_23px] gap-[24px] mb-[18px] [&_h1]:text-[21px] [&_h1]:text-[#273e35] [&_h1]:font-[650] [&_h1]:leading-[1.45] [&_h1]:mt-[9px] mobile:p-[16px] mobile:flex-col mobile:gap-[10px] mobile:[&_h1]:text-[19px] surface bg-white [border:1px_solid_var(--border)] shadow-[0_1px_3px_#223b3510] rounded-[9px]">
                <div>
                    <div className="detail-labels flex flex-wrap gap-[6px] [&_span]:text-[#85968d] [&_span]:text-[10px] [&_span]:bg-[#f5f7f6] [&_span]:p-[2px_6px] [&_span]:rounded-[3px]">
                        <span>Segment: {idea.segment}</span>
                        <span>Product: {idea.product}</span>
                        <span>Objective: {idea.objective}</span>
                    </div>
                    <h1>{idea.title}</h1>
                </div>
                <IdeaActions
                    idea={idea}
                    module="leads"
                    onPublish={publish}
                    onDelete={remove}
                />
            </header>
            <div className="detail-columns grid grid-cols-[minmax(0,_1fr)_260px] [align-items:start] gap-[18px] tablet:grid-cols-[minmax(0,_1fr)]">
                <article className="detail-body p-[15px] mobile:p-[8px] surface bg-white [border:1px_solid_var(--border)] shadow-[0_1px_3px_#223b3510] rounded-[9px]">
                    {detailContent(idea).map((section) => (
                        <section
                            className="detail-section bg-[#fafbfc] p-[15px_16px] mb-[10px] rounded-[3px] [&:last-child]:mb-[0] [&_h2]:text-[12px] [&_h2]:font-[650] [&_h2]:text-[#4a5a52] [&_h2]:mb-[12px] [&_h2_.anticon]:text-[#7a8d82] [&_h2_.anticon]:mr-[4px] [&_p]:bg-white [&_p]:text-[#7b817f] [&_p]:p-[9px] [&_p]:text-[12px] [&_p]:leading-[1.8] mobile:p-[12px]"
                            key={section.title}
                        >
                            <h2>
                                <FileTextOutlined /> {section.title}
                            </h2>
                            <p>{section.text}</p>
                        </section>
                    ))}
                    <section className="detail-section bg-[#fafbfc] p-[15px_16px] mb-[10px] rounded-[3px] [&:last-child]:mb-[0] [&_h2]:text-[12px] [&_h2]:font-[650] [&_h2]:text-[#4a5a52] [&_h2]:mb-[12px] [&_h2_.anticon]:text-[#7a8d82] [&_h2_.anticon]:mr-[4px] [&_p]:bg-white [&_p]:text-[#7b817f] [&_p]:p-[9px] [&_p]:text-[12px] [&_p]:leading-[1.8] mobile:p-[12px]">
                        <h2>
                            <FileTextOutlined /> Target Persona
                        </h2>
                        {personaSections.map(([title, text]) => (
                            <div
                                className="persona mt-[14px] [&_h3]:text-[11px] [&_h3]:text-[#647e71] [&_h3]:mb-[3px]"
                                key={title}
                            >
                                <h3>{title}</h3>
                                <p>{text}</p>
                            </div>
                        ))}
                    </section>
                    <section className="detail-section bg-[#fafbfc] p-[15px_16px] mb-[10px] rounded-[3px] [&:last-child]:mb-[0] [&_h2]:text-[12px] [&_h2]:font-[650] [&_h2]:text-[#4a5a52] [&_h2]:mb-[12px] [&_h2_.anticon]:text-[#7a8d82] [&_h2_.anticon]:mr-[4px] [&_p]:bg-white [&_p]:text-[#7b817f] [&_p]:p-[9px] [&_p]:text-[12px] [&_p]:leading-[1.8] mobile:p-[12px]">
                        <h2>
                            <FileTextOutlined /> Recommended Schedule
                        </h2>
                        <div className="schedule-grid grid grid-cols-[repeat(3,_1fr)] gap-[12px] [&_>_div]:text-center [&_>_div]:p-[12px_6px] [&_>_div]:bg-white [&_span]:block [&_span]:text-[10px] [&_span]:text-[#919b95] [&_span]:mb-[5px] [&_strong]:text-[11px] [&_strong]:font-medium [&_strong]:text-[#5e7166] mobile:grid-cols-[1fr_1fr]">
                            {schedule.map(([label, value]) => (
                                <div key={label}>
                                    <span>{label}</span>
                                    <strong>{value}</strong>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section className="detail-section bg-[#fafbfc] p-[15px_16px] mb-[10px] rounded-[3px] [&:last-child]:mb-[0] [&_h2]:text-[12px] [&_h2]:font-[650] [&_h2]:text-[#4a5a52] [&_h2]:mb-[12px] [&_h2_.anticon]:text-[#7a8d82] [&_h2_.anticon]:mr-[4px] [&_p]:bg-white [&_p]:text-[#7b817f] [&_p]:p-[9px] [&_p]:text-[12px] [&_p]:leading-[1.8] mobile:p-[12px]">
                        <h2>
                            <FlagOutlined /> Priority Rationale
                        </h2>
                        <IdeaBadges idea={idea} />
                        <div className="breakdown-grid grid grid-cols-[1fr_1fr] gap-[17px] m-[18px_0] [&_>_div:last-child]:col-[1_/_-1] [&_>_div_>_div]:flex [&_>_div_>_div]:justify-between [&_>_div_>_div]:gap-[12px] [&_>_div_>_div]:text-[10px] [&_>_div_>_div]:text-[#6d7b73] [&_>_div_>_div]:mb-[5px] [&_b]:font-medium [&_b]:whitespace-nowrap mobile:grid-cols-[1fr]">
                            {scoreBreakdown(idea.score).map((item, index) => (
                                <div key={item.label}>
                                    <div>
                                        <span>{item.label}</span>
                                        <b>
                                            {item.score}/{item.max}
                                        </b>
                                    </div>
                                    <progress
                                        className={`metric w-full h-[4px] block [border:0] rounded-[4px] overflow-hidden bg-[#eef1f4] [&::-webkit-progress-bar]:bg-[#eef1f4] [&::-webkit-progress-value]:bg-[#00a77e] [&::-moz-progress-bar]:bg-[#00a77e] [&.metric-0::-webkit-progress-value]:bg-[#e3154d] [&.metric-3::-webkit-progress-value]:bg-[#edbd4d] metric-${index}`}
                                        value={item.score}
                                        max={item.max}
                                        aria-label={item.label}
                                    />
                                </div>
                            ))}
                        </div>
                        <p>
                            Strong strategic fit and customer relevance.
                            Validate customer readiness and execution
                            assumptions before launch.
                        </p>
                    </section>
                    <section className="detail-section bg-[#fafbfc] p-[15px_16px] mb-[10px] rounded-[3px] [&:last-child]:mb-[0] [&_h2]:text-[12px] [&_h2]:font-[650] [&_h2]:text-[#4a5a52] [&_h2]:mb-[12px] [&_h2_.anticon]:text-[#7a8d82] [&_h2_.anticon]:mr-[4px] [&_p]:bg-white [&_p]:text-[#7b817f] [&_p]:p-[9px] [&_p]:text-[12px] [&_p]:leading-[1.8] mobile:p-[12px]">
                        <h2>
                            <FlagOutlined /> Expected KPIs
                        </h2>
                        <ul className="kpi-list p-[0_0_0_18px] m-[0] text-[#7b8580] text-[12px] [&_li]:p-[8px_4px] [&_li]:[border-bottom:1px_solid_white]">
                            {kpis.map((kpi) => (
                                <li key={kpi}>{kpi}</li>
                            ))}
                        </ul>
                    </section>
                    <section className="detail-section bg-[#fafbfc] p-[15px_16px] mb-[10px] rounded-[3px] [&:last-child]:mb-[0] [&_h2]:text-[12px] [&_h2]:font-[650] [&_h2]:text-[#4a5a52] [&_h2]:mb-[12px] [&_h2_.anticon]:text-[#7a8d82] [&_h2_.anticon]:mr-[4px] [&_p]:bg-white [&_p]:text-[#7b817f] [&_p]:p-[9px] [&_p]:text-[12px] [&_p]:leading-[1.8] mobile:p-[12px]">
                        <h2>
                            <FlagOutlined /> Expected Conversion Estimate
                        </h2>
                        <span className="conversion-estimate inline-block mb-[11px] bg-[#eff9f4] [border:1px_solid_#cbe7d9] text-[#4b9875] p-[2px_7px] text-[12px] rounded-[3px]">
                            6.5%
                        </span>
                        <p>
                            Conversion event is a completed advisory
                            conversation followed by a qualified action among
                            eligible reached customers within 21 days. This is
                            an unvalidated planning estimate, not a forecast or
                            guaranteed outcome.
                        </p>
                    </section>
                </article>
                <aside className="detail-sidebar p-[6px] [&_.ant-collapse-header]:text-[11px] [&_.ant-collapse-header]:font-semibold [&_.ant-collapse-content-box]:p-[0_10px_12px]! [&_.ant-collapse-content_p]:text-[#7d8982] [&_.ant-collapse-content_p]:text-[11px] [&_.ant-collapse-content_p]:leading-[1.7] tablet:order-[-1] surface bg-white [border:1px_solid_var(--border)] shadow-[0_1px_3px_#223b3510] rounded-[9px]">
                    <Collapse
                        ghost
                        defaultActiveKey={["product", "signals"]}
                        items={[
                            {
                                key: "product",
                                label: "Focus Product",
                                children: (
                                    <div className="detail-product bg-[#f7f8fa] p-[9px] text-[11px]">
                                        {idea.product}
                                    </div>
                                ),
                            },
                            {
                                key: "signals",
                                label: "Selected Signals",
                                children: (
                                    <div className="detail-signals flex flex-col gap-[9px] [&_.signal-card]:p-[10px] [&_.signal-card]:bg-[#f7f8fb] [&_.signal-card]:shadow-none [&_.signal-card]:[border:0] [&_.signal-card]:rounded-[4px] [&_.signal-top]:mb-[6px] [&_.signal-score]:hidden [&_.impact]:hidden [&_h3]:hidden [&_.signal-card_p]:text-[10px] [&_.signal-category]:text-[8px] [&_.signal-meta]:text-[9px] [&_.signal-meta]:grid [&_.signal-meta]:gap-[6px] [&_.signal-meta_time]:whitespace-normal [&_.signal-meta_time]:m-[0] tablet:grid tablet:grid-cols-[1fr_1fr] mobile:grid-cols-[1fr]">
                                        {selected.map((signal) => (
                                            <SignalCard
                                                key={signal.id}
                                                signal={signal}
                                            />
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
                                          children: (
                                              <p>{idea.selection.notes}</p>
                                          ),
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
