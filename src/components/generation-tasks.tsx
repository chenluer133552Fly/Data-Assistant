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
      className="tasks-panel"
      aria-label="Generation tasks"
      aria-live="polite"
    >
      <div className="tasks-header">
        <h2>TASKS</h2>
        <div>
          <Button
            type="text"
            size="small"
            aria-label={collapsed ? "Expand tasks" : "Collapse tasks"}
            onClick={() => setCollapsedRun(collapsed ? null : task.run)}
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
            status={task.error ? "error" : generating ? "process" : "finish"}
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
          <div className={`tasks-status ${task.error ? "has-error" : ""}`}>
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
