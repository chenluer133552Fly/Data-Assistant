import { App, Button, Steps } from "antd";
import { CloseOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useWorkspace } from "../common/use-workspace";

export function GenerationTasks() {
    const { task, generating, closeTask } = useWorkspace();
    const [collapsedRun, setCollapsedRun] = useState<number | null>(null);
    const collapsed = collapsedRun === task.run;
    const { message } = App.useApp();
    useEffect(() => {
        if (task.error) void message.error(task.error);
    }, [task.error, message]);
    if (!task.open) return null;
    const titles = [
        "Understand your requirements",
        "Connect customer and market signals",
        "Develop campaign ideas",
        "Ready for review",
    ];
    return (
        <aside
            className="tasks-panel fixed right-[24px] top-[85px] z-[110] w-[300px] bg-white [border:1px_solid_#e9eded] rounded-[11px] shadow-[0_7px_25px_#0b352322] p-[17px_18px] [&_.ant-steps-item-title]:text-[11px] [&_.ant-steps-item-content]:text-[10px] [&_.ant-steps-item-content]:text-[#929a98] tablet:w-[280px] mobile:right-[12px] mobile:top-[60px] mobile:w-[275px]"
            aria-label="Generation tasks"
            aria-live="polite"
        >
            <div className="tasks-header flex items-center justify-between mb-[10px] [&_h2]:text-[10px] [&_h2]:font-[750] [&_h2]:tracking-[1.5px] [&_.ant-btn]:text-[#929e97]">
                <h2>TASKS</h2>
                <div>
                    <Button
                        type="text"
                        size="small"
                        aria-label={
                            collapsed ? "Expand tasks" : "Collapse tasks"
                        }
                        onClick={() =>
                            setCollapsedRun(collapsed ? null : task.run)
                        }
                        icon={collapsed ? <DownOutlined /> : <UpOutlined />}
                    />
                    {!generating && (
                        <Button
                            type="text"
                            size="small"
                            aria-label="Close tasks"
                            onClick={closeTask}
                            icon={<CloseOutlined />}
                        />
                    )}
                </div>
            </div>
            {!collapsed && (
                <>
                    <Steps
                        orientation="vertical"
                        size="small"
                        current={task.step}
                        status={
                            task.error
                                ? "error"
                                : generating
                                  ? "process"
                                  : "finish"
                        }
                        items={titles.map((title, index) => ({
                            title,
                            content:
                                index === task.step
                                    ? task.error || task.description
                                    : index < task.step
                                      ? "Completed"
                                      : undefined,
                        }))}
                    />
                    <div
                        className={`tasks-status [border-top:1px_solid_#edf1ee] pt-[12px] mt-[9px] text-[11px] text-[#699a84] [&.has-error]:text-[#d14666] ${task.error ? "has-error" : ""}`}
                    >
                        {generating
                            ? "Generating your ideas…"
                            : task.error
                              ? "Generation failed. Use Generate Ideas to retry."
                              : "Your ideas have been added to the list."}
                    </div>
                </>
            )}
        </aside>
    );
}
