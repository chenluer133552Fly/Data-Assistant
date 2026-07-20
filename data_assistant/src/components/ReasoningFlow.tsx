import { useMemo, useState } from "react";
import {
  Background,
  Controls,
  Handle,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { GitBranch, Maximize2, Minimize2, TrendingDown, TrendingUp } from "lucide-react";
import type { ReasoningMetric } from "../types/domain";

type ReasoningFlowProps = {
  metrics: ReasoningMetric[];
};

type ReasoningNode = Node<ReasoningMetric, "reasoning">;

const nodeTypes: NodeTypes = {
  reasoning: ReasoningNodeCard,
};

const toneClasses: Record<ReasoningMetric["tone"], string> = {
  root: "border-[#646B74] bg-[#EFEEEC]",
  saving: "border-[#E7DEDE] bg-[#F0EAEA]",
  usd: "border-[#D7E0E1] bg-[#E8EFF0]",
  detail: "border-[#D8CEE5] bg-[#E9E0F1]",
};

export function ReasoningFlow({ metrics }: ReasoningFlowProps) {
  const [expanded, setExpanded] = useState(false);

  const nodes = useMemo<ReasoningNode[]>(
    () =>
      metrics.map((metric) => ({
        id: metric.id,
        type: "reasoning",
        position: {
          x: 20 + metric.column * 235,
          y: 22 + metric.row * 104,
        },
        data: metric,
        draggable: true,
      })),
    [metrics],
  );

  const edges = useMemo<Edge[]>(
    () => [
      edge("total-nii", "saving-nii-1"),
      edge("total-nii", "saving-nii-2"),
      edge("saving-nii-1", "usd-nii-1"),
      edge("saving-nii-1", "usd-nii-2"),
      edge("saving-nii-2", "usd-nii-3"),
      edge("usd-nii-1", "detail-nii-1"),
      edge("usd-nii-2", "detail-nii-2"),
      edge("usd-nii-2", "detail-nii-3"),
      edge("usd-nii-3", "detail-nii-4"),
    ],
    [],
  );

  return (
    <>
      {expanded ? (
        <button
          aria-label="Close reasoning fullscreen"
          className="fixed inset-0 z-40 cursor-default bg-black/40"
          onClick={() => setExpanded(false)}
          type="button"
        />
      ) : null}
      <section
        className={`assistant-card overflow-hidden ${
          expanded ? "fixed inset-6 z-50 flex flex-col bg-white" : ""
        }`}
      >
        <header className="flex items-center justify-between border-b border-[#E5EAF0] px-5 py-4">
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-[#5B6C82]" />
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#586471]">
              Explain Reasoning
            </h2>
          </div>
          <button
            aria-label={expanded ? "Exit reasoning fullscreen" : "View reasoning fullscreen"}
            className="inline-flex h-8 w-8 items-center justify-center border border-[#DCE4ED] bg-white text-[#65758A] transition hover:border-[#9CC7E8] hover:text-[#1B84B7] [border-radius:6px]"
            onClick={() => setExpanded((value) => !value)}
            title={expanded ? "Exit fullscreen" : "View fullscreen"}
            type="button"
          >
            {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </header>

        <div className="px-5 pt-4 text-xs font-semibold text-[#5A6678]">[ NAME ] Reasoning</div>
        <div className={expanded ? "min-h-0 flex-1" : "h-[470px]"}>
          <ReactFlow
            edges={edges}
            fitView
            fitViewOptions={{ padding: 0.12 }}
            minZoom={0.55}
            nodeTypes={nodeTypes}
            nodes={nodes}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#E7EBF0" gap={28} size={1} />
            <Controls position="bottom-left" showInteractive={false} />
          </ReactFlow>
        </div>
      </section>
    </>
  );
}

function ReasoningNodeCard({ data }: NodeProps<ReasoningNode>) {
  return (
    <div
      className={`w-[190px] border px-3 py-3 shadow-[0_5px_14px_rgba(52,65,82,0.06)] [border-radius:8px] ${toneClasses[data.tone]}`}
    >
      <Handle
        className="!h-2 !w-2 !border-2 !border-white !bg-[#8291A3]"
        isConnectable={false}
        position={Position.Left}
        type="target"
      />
      <p className="truncate text-xs font-semibold text-[#303846]" title={data.title}>
        {data.title}
      </p>
      <p className="mt-1 truncate text-[11px] text-[#66758A]" title={data.value}>
        {data.value}
      </p>
      <div className="mt-1.5 flex items-center gap-2 text-[10px]">
        <span className="inline-flex items-center gap-1 text-[#D94E5A]">
          <TrendingUp className="h-3 w-3" />
          {data.positiveChange}
        </span>
        <span className="inline-flex items-center gap-1 text-[#278D7D]">
          <TrendingDown className="h-3 w-3" />
          {data.negativeChange}
        </span>
      </div>
      <Handle
        className="!h-2 !w-2 !border-2 !border-white !bg-[#8291A3]"
        isConnectable={false}
        position={Position.Right}
        type="source"
      />
    </div>
  );
}

function edge(source: string, target: string): Edge {
  return {
    id: `${source}-${target}`,
    source,
    target,
    type: "smoothstep",
    style: { stroke: "#C7CFD8", strokeWidth: 1.4 },
  };
}
