import {
  Background,
  Controls,
  Handle,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './ExplainReasoning.css';

type ReasoningNodeData = {
  title: string;
  detail: string;
  tag?: string;
  tone?: 'neutral' | 'blue' | 'green' | 'purple';
};

const nodeTypes = {
  reasoningCard: ReasoningCardNode,
};

const reasoningNodes: Node<ReasoningNodeData>[] = [
  {
    id: 'query',
    type: 'reasoningCard',
    position: { x: 20, y: 170 },
    data: {
      title: 'User Question',
      detail: 'Show the new mainland customer on 2026-01-01.',
      tag: 'INPUT',
      tone: 'neutral',
    },
  },
  {
    id: 'intent',
    type: 'reasoningCard',
    position: { x: 330, y: 60 },
    data: {
      title: 'Intent Recognition',
      detail: 'Detected a data retrieval request with a clear reporting date.',
      tag: 'STEP 01',
      tone: 'blue',
    },
  },
  {
    id: 'scope',
    type: 'reasoningCard',
    position: { x: 330, y: 280 },
    data: {
      title: 'Scope Validation',
      detail: 'Limit records to customers marked as mainland customers.',
      tag: 'STEP 02',
      tone: 'green',
    },
  },
  {
    id: 'table',
    type: 'reasoningCard',
    position: { x: 650, y: 120 },
    data: {
      title: 'Table Selection',
      detail: 'Use customer attribute final table for onboarding and region fields.',
      tag: 'STEP 03',
      tone: 'purple',
    },
  },
  {
    id: 'sql',
    type: 'reasoningCard',
    position: { x: 650, y: 340 },
    data: {
      title: 'SQL Generation',
      detail: 'Apply date and MainLander filters, preserve branch and channel columns.',
      tag: 'STEP 04',
      tone: 'blue',
    },
  },
  {
    id: 'answer',
    type: 'reasoningCard',
    position: { x: 970, y: 220 },
    data: {
      title: 'Answer Summary',
      detail: 'Summarize 127 new customers, regional concentration, and digital channel skew.',
      tag: 'OUTPUT',
      tone: 'green',
    },
  },
];

const reasoningEdges: Edge[] = [
  { id: 'query-intent', source: 'query', target: 'intent', animated: true },
  { id: 'query-scope', source: 'query', target: 'scope', animated: true },
  { id: 'intent-table', source: 'intent', target: 'table', animated: true },
  { id: 'scope-table', source: 'scope', target: 'table' },
  { id: 'table-sql', source: 'table', target: 'sql', animated: true },
  { id: 'sql-answer', source: 'sql', target: 'answer', animated: true },
];

function ReasoningCardNode({ data }: NodeProps<Node<ReasoningNodeData>>) {
  return (
    <div className={`reasoning-flow-card reasoning-flow-card--${data.tone ?? 'neutral'}`}>
      <Handle type="target" position={Position.Left} />
      {data.tag && <div className="reasoning-flow-card__tag">{data.tag}</div>}
      <div className="reasoning-flow-card__title">{data.title}</div>
      <div className="reasoning-flow-card__detail">{data.detail}</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export default function ExplainReasoning() {
  return (
    <section className="explain-reasoning">
      <div className="explain-reasoning__header">
        <span className="explain-reasoning__marker" />
        <div>
          <h3 className="explain-reasoning__title">EXPLAIN REASONING</h3>
          <p className="explain-reasoning__subtitle">Reasoning path from user question to final answer.</p>
        </div>
      </div>

      <div className="explain-reasoning__flow">
        <ReactFlow
          nodes={reasoningNodes}
          edges={reasoningEdges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.16 }}
          minZoom={0.35}
          maxZoom={1.25}
        >
          <Background color="#e2e6ec" gap={18} />
          <Controls />
        </ReactFlow>
      </div>
    </section>
  );
}
