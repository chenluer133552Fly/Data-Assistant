import { useState } from "react";
import { Button, Select, Skeleton } from "antd";
import {
  DownOutlined,
  EditOutlined,
  ThunderboltOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { emptySelection, FOCUS_PRODUCT_OPTIONS } from "../../common/mock-data";
import type { Product, Selection } from "../../common/types";
import { useWorkspace } from "../../common/use-workspace";
import { IdeaFilters } from "../../components/idea-filters";
import { filterIdeas, initialQuery } from "../../common/idea-query";
import {
  IdeaCard,
  ListPagination,
  ListState,
  PageHeading,
} from "../../components/ui";
import { SelectionDrawer } from "../../components/selection-drawer";
import { useIdeaOperations } from "../../components/use-idea-operations";

export default function LeadsPage() {
  const { database, loading, error, reload, generating, generate } =
    useWorkspace();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product>();
  const [selection, setSelection] = useState<Selection | null>(null);
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState(initialQuery);
  const { publish, remove, dialogs } = useIdeaOperations("leads");
  const ideas = filterIdeas(database.leads, query, "leads");
  const total = ideas.length;
  const maxPage = Math.max(1, Math.ceil(total / 10));
  const page = Math.min(query.page, maxPage);
  const count = selection
    ? selection.signalIds.length +
      selection.stages.length +
      selection.channels.length
    : 0;
  function editSelection() {
    if (!product) return;
    setSession((value) => value + 1);
    setOpen(true);
  }
  function changeProduct(value: Product | undefined) {
    setProduct(value);
    setSelection(null);
    setOpen(false);
  }
  const summary = selection && (
    <div className="selection-summary">
      <span>Signal {selection.signalIds.length} selected</span>
      {selection.stages.length > 0 && (
        <span>CLCM Stage: {selection.stages.join(", ")}</span>
      )}
      {selection.channels.length > 0 && (
        <span>Channels: {selection.channels.join(", ")}</span>
      )}
    </div>
  );
  const generateButton = (
    <Button
      className="generate-button"
      icon={<ThunderboltOutlined />}
      disabled={!product || !selection?.signalIds.length || generating}
      loading={generating}
      onClick={() => {
        if (product && selection) {
          setQuery((previous) => ({ ...previous, page: 1 }));
          void generate(product, selection);
        }
      }}
    >
      Generate Ideas
    </Button>
  );
  return (
    <>
      <PageHeading
        title="Leads Ideation"
        description="Add the supplied campaign ideas and review them alongside your existing campaigns."
      />
      <section
        className={`engine-panel ${collapsed ? "collapsed" : ""}`}
        aria-label="AI Ideation Engine"
      >
        <div className="engine-header">
          <h2>
            <span className="engine-spark">✧</span> AI Ideation Engine
          </h2>
          {collapsed && summary}
          <div className="engine-header-actions">
            {collapsed && generateButton}
            <Button
              type="text"
              className="collapse-button"
              icon={collapsed ? <DownOutlined /> : <UpOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? "Expand" : "Collapse"}
            </Button>
          </div>
        </div>
        {!collapsed && (
          <>
            <p className="engine-description">
              Generate 10 Campaign Ideas aligned to selected product focus,
              market signals, customer lifecycle stage, and delivery channels.
              Ideas are retained for 14 days from the date of generation.
            </p>
            <div className="engine-fields">
              <div className="engine-field">
                <label htmlFor="focus-product">Focus Product</label>
                <Select
                  id="focus-product"
                  aria-label="Focus Product"
                  placeholder="Select a product"
                  allowClear
                  value={product}
                  options={FOCUS_PRODUCT_OPTIONS}
                  onChange={changeProduct}
                />
              </div>
              <div className="engine-field">
                <label htmlFor="constraints">
                  Constraints {selection && <small>{count} selected</small>}
                </label>
                <Button
                  id="constraints"
                  className="constraint-trigger"
                  aria-label="Constraints"
                  aria-haspopup="dialog"
                  aria-expanded={open}
                  disabled={!product}
                  onClick={editSelection}
                >
                  <span>
                    {!product
                      ? "Select a product first"
                      : selection
                      ? "Review selected constraints"
                      : "Select constraints"}
                  </span>
                  <EditOutlined />
                </Button>
              </div>
              <div className="engine-generate">{generateButton}</div>
            </div>
            {selection && (
              <div className="engine-selected">
                <span>Selected:</span>
                {summary}
              </div>
            )}
          </>
        )}
      </section>
      <IdeaFilters
        query={query}
        onChange={setQuery}
        ideas={database.leads}
        module="leads"
      />
      {generating && (
        <div
          className="generation-placeholder surface"
          aria-label="Generating new ideas"
        >
          <span className="generating-label">
            <ThunderboltOutlined /> Generating your next campaign ideas
          </span>
          <Skeleton active paragraph={{ rows: 2 }} />
        </div>
      )}
      <div className="idea-list">
        {loading || error || !ideas.length ? (
          <ListState
            loading={loading}
            error={error}
            filtered={database.leads.length > 0}
            retry={() => void reload()}
          />
        ) : (
          ideas
            .slice((page - 1) * 10, page * 10)
            .map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                module="leads"
                onPublish={publish}
                onDelete={remove}
                onDetails={(item) => void navigate(`/leads/${item.id}`)}
              />
            ))
        )}
      </div>
      <ListPagination
        page={page}
        total={total}
        onChange={(page) => setQuery({ ...query, page })}
      />
      {open && (
        <SelectionDrawer
          key={session}
          open={open}
          initial={selection ?? emptySelection()}
          onClose={() => setOpen(false)}
          onComplete={(value) => {
            setSelection(value);
            setOpen(false);
          }}
        />
      )}
      {dialogs}
    </>
  );
}
