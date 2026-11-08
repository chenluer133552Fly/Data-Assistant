import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRightOutlined,
    BulbOutlined,
    CheckSquareOutlined,
    ClockCircleOutlined,
    RadarChartOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import { Empty } from "antd";
import { CURRENT_USER } from "../../common/mock-data";
import { mockApi } from "../../common/services/mock-api";
import type { DashboardData } from "../../common/types";
import { formatActivityTime } from "../../common/validation";
import { ListState, PageHeading } from "../../components/ui";
import "./style.css";

export default function DashboardPage() {
    const [data, setData] = useState<DashboardData>();
    const [error, setError] = useState("");
    const [request, setRequest] = useState(0);
    useEffect(() => {
        let active = true;
        void mockApi
            .dashboard()
            .then((value) => {
                if (active) setData(value);
            })
            .catch((cause: unknown) => {
                if (active)
                    setError(
                        cause instanceof Error
                            ? cause.message
                            : "Unable to load dashboard.",
                    );
            });
        return () => {
            active = false;
        };
    }, [request]);
    if (!data || error)
        return (
            <ListState
                loading={!error}
                error={error}
                retry={() => {
                    setError("");
                    setRequest((value) => value + 1);
                }}
            />
        );
    const metrics = [
        {
            label: "Customer Signals",
            value: data.counts.customer,
            icon: <TeamOutlined />,
            to: "/intelligence?tab=customer",
            color: "#7185f6",
        },
        {
            label: "CIO Insights",
            value: data.counts.cio,
            icon: <RadarChartOutlined />,
            to: "/intelligence?tab=cio",
            color: "#b56ee8",
        },
        {
            label: "Campaign Ideas",
            value: data.counts.ideas,
            icon: <BulbOutlined />,
            to: "/leads",
            color: "#e1a54b",
        },
        {
            label: "Validated",
            value: data.counts.validated,
            icon: <CheckSquareOutlined />,
            to: "/validation",
            color: "#65a594",
        },
    ];
    return (
        <div className="dashboard-page">
            <PageHeading
                title="Market Intelligence Command Center"
                description="Real-time banking customer signals, CIO insights, and AI-driven campaign ideation — from insight to distribution."
            />
            <div className="dashboard-metrics">
                {metrics.map((metric) => (
                    <Link
                        key={metric.label}
                        to={metric.to}
                        className="dashboard-metric"
                        style={
                            {
                                "--metric-color": metric.color,
                            } as React.CSSProperties
                        }
                    >
                        <span className="dashboard-metric-icon">
                            {metric.icon}
                        </span>
                        <div>
                            <strong>{metric.value}</strong>
                            <span>{metric.label}</span>
                        </div>
                        <ArrowRightOutlined className="metric-arrow" />
                    </Link>
                ))}
            </div>
            {CURRENT_USER.canValidate && (
                <section className="dashboard-panel dashboard-tasks">
                    <header>
                        <h2>
                            Validation Tasks <span>({data.tasks.length})</span>
                            <small>Ideas that require your review</small>
                        </h2>
                        <Link to="/validation">
                            Validation <ArrowRightOutlined />
                        </Link>
                    </header>
                    {data.tasks.length ? (
                        data.tasks.map((idea) => (
                            <Link
                                className="dashboard-entry task-entry"
                                key={idea.id}
                                to={`/validation/${idea.id}`}
                            >
                                <div className="dashboard-entry-title">
                                    <span className="validation-status">
                                        Draft
                                    </span>
                                    <h3>{idea.title}</h3>
                                    <span className="task-validate">
                                        Validate now <ArrowRightOutlined />
                                    </span>
                                </div>
                                <p>{idea.description}</p>
                                <time>
                                    <ClockCircleOutlined />{" "}
                                    {formatActivityTime(idea.createdAt)}
                                </time>
                            </Link>
                        ))
                    ) : (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="No ideas awaiting validation"
                        />
                    )}
                </section>
            )}
            <div className="dashboard-columns">
                <section className="dashboard-panel">
                    <header>
                        <h2>Recent Ideations</h2>
                        <Link to="/community">
                            View All <ArrowRightOutlined />
                        </Link>
                    </header>
                    {data.recent.length ? (
                        data.recent.map((idea) => (
                            <Link
                                className="dashboard-entry"
                                key={idea.id}
                                to={`/community/${idea.id}`}
                            >
                                <h3>{idea.title}</h3>
                                <p>{idea.description}</p>
                                <time>
                                    <ClockCircleOutlined />{" "}
                                    {formatActivityTime(idea.createdAt)}
                                </time>
                            </Link>
                        ))
                    ) : (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="No public ideas yet"
                        />
                    )}
                </section>
                <section className="dashboard-panel">
                    <header>
                        <h2>Signals</h2>
                        <Link to="/community">
                            View All <ArrowRightOutlined />
                        </Link>
                    </header>
                    {data.signals.map((signal) => (
                        <article className="dashboard-entry" key={signal.id}>
                            <h3>{signal.title}</h3>
                            <p>{signal.description}</p>
                            <time>
                                <ClockCircleOutlined />{" "}
                                {formatActivityTime(signal.createdAt)}
                            </time>
                        </article>
                    ))}
                </section>
            </div>
        </div>
    );
}
