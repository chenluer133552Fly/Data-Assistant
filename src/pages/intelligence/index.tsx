import { useState } from "react";
import { Empty, Select, Tabs } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { cioSignals, customerSignals, PRODUCTS } from "../../common/mock-data";
import { ListPagination, PageHeading, SignalCard } from "../../components/ui";

export default function IntelligencePage() {
  const [tab, setTab] = useState("customer");
  const [product, setProduct] = useState<string>();
  const [category, setCategory] = useState<string>();
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const source = tab === "customer" ? customerSignals : cioSignals;
  const list = source
    .filter(
      (signal) =>
        (!product || signal.product === product) &&
        (!category || signal.category === category)
    )
    .sort((a, b) =>
      sort === "score"
        ? b.score - a.score
        : sort === "oldest"
        ? a.createdAt.localeCompare(b.createdAt)
        : b.createdAt.localeCompare(a.createdAt)
    );
  return (
    <>
      <PageHeading
        title="Intelligence Radar"
        description="Customer signals, CIO insights from the Chief Investment Office, omni-channel behaviors."
        extra={
          <span className="sync-label">
            <ClockCircleOutlined /> Last synced: <b>Oct 30, 2026 · 08:17 HKT</b>
          </span>
        }
      />
      <Tabs
        activeKey={tab}
        className="radar-tabs"
        onChange={(key) => {
          setTab(key);
          setCategory(undefined);
          setPage(1);
        }}
        items={[
          {
            key: "customer",
            label: (
              <>
                Customer Signals{" "}
                <span className="tab-count">{customerSignals.length}</span>
              </>
            ),
          },
          {
            key: "cio",
            label: (
              <>
                CIO Insights{" "}
                <span className="tab-count">{cioSignals.length}</span>
              </>
            ),
          },
        ]}
      />
      <div className="filter-bar radar-filters">
        <Select
          aria-label="Filter signals by product"
          allowClear
          placeholder="All Product"
          value={product}
          options={PRODUCTS.map((value) => ({ value, label: value }))}
          onChange={(value) => {
            setProduct(value);
            setPage(1);
          }}
        />
        <Select
          aria-label="Filter signals by category"
          allowClear
          placeholder="All Categories"
          value={category}
          options={[...new Set(source.map((signal) => signal.category))].map(
            (value) => ({ value, label: value })
          )}
          onChange={(value) => {
            setCategory(value);
            setPage(1);
          }}
        />
        <Select
          aria-label="Sort signals"
          value={sort}
          options={[
            { value: "newest", label: "Added: Newest First" },
            { value: "oldest", label: "Added: Oldest First" },
            { value: "score", label: "Score: Highest First" },
          ]}
          onChange={(value) => {
            setSort(value);
            setPage(1);
          }}
        />
      </div>
      <div className="signal-list">
        {list.length ? (
          list
            .slice((page - 1) * 10, page * 10)
            .map((signal) => <SignalCard key={signal.id} signal={signal} />)
        ) : (
          <div className="empty-state">
            <Empty description="No matching signals. Try changing your filters." />
          </div>
        )}
      </div>
      <ListPagination page={page} total={list.length} onChange={setPage} />
    </>
  );
}
