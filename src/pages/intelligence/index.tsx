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
                (!category || signal.category === category),
        )
        .sort((a, b) =>
            sort === "score"
                ? b.score - a.score
                : sort === "oldest"
                  ? a.createdAt.localeCompare(b.createdAt)
                  : b.createdAt.localeCompare(a.createdAt),
        );
    return (
        <>
            <PageHeading
                specified
                title="Intelligence Rader"
                description="Customer signals, CIO insights from the Chief Investment Office, omni-channel behaviors."
                extra={
                    <span className="sync-label text-[#5C706B] text-[14px] font-normal leading-normal whitespace-nowrap [&_b]:text-[#036652] [&_b]:font-normal [&_.anticon]:mr-[3px] compact:whitespace-normal compact:max-w-[180px] compact:text-right mobile:max-w-none mobile:text-left">
                        <ClockCircleOutlined /> Last synced:{" "}
                        <b>Oct 30, 2026 · 08:17 HKT</b>
                    </span>
                }
            />
            <Tabs
                activeKey={tab}
                className="radar-tabs [&_.ant-tabs-nav]:mb-0 [&_.ant-tabs-nav::before]:border-0 [&_.ant-tabs-tab]:pt-0 [&_.ant-tabs-tab]:text-[14px] [&_.ant-tabs-tab]:font-normal [&_.ant-tabs-tab-btn]:text-[#5C706B] [&_.ant-tabs-tab-btn]:flex [&_.ant-tabs-tab-btn]:items-center [&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:text-[#036652] [&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:[text-shadow:none] [&_.ant-tabs-tab-active_.tab-count]:text-[#036652]"
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
                                <span className="tab-count flex items-center justify-center px-[8px] ml-[7px] text-[12px] text-[#5C706B] bg-[#F1F5F9] rounded-full font-normal [font-variant-numeric:lining-nums_tabular-nums]">
                                    {customerSignals.length}
                                </span>
                            </>
                        ),
                    },
                    {
                        key: "cio",
                        label: (
                            <>
                                CIO Insights{" "}
                                <span className="tab-count flex items-center justify-center px-[8px] ml-[7px] text-[12px] text-[#5C706B] bg-[#F1F5F9] rounded-full font-normal [font-variant-numeric:lining-nums_tabular-nums]">
                                    {cioSignals.length}
                                </span>
                            </>
                        ),
                    },
                ]}
            />
            <div className="filter-bar radar-filters flex items-center flex-wrap gap-[12px] mt-[16px] mb-[24px] [&_.ant-select]:text-[11px] [&_.ant-select]:h-[31px] [&_.ant-select]:min-w-[170px] mobile:[&_.ant-select]:min-w-[140px] mobile:[&_.ant-select]:flex-1">
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
                    options={[
                        ...new Set(source.map((signal) => signal.category)),
                    ].map((value) => ({ value, label: value }))}
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
            <div className="signal-list flex flex-col gap-[16px]">
                {list.length ? (
                    list
                        .slice((page - 1) * 10, page * 10)
                        .map((signal) => (
                            <SignalCard
                                key={signal.id}
                                signal={signal}
                                appearance="radar"
                            />
                        ))
                ) : (
                    <div className="empty-state p-[55px_20px] bg-white [border:1px_solid_var(--border)] rounded-[9px]">
                        <Empty description="No matching signals. Try changing your filters." />
                    </div>
                )}
            </div>
            <ListPagination
                page={page}
                total={list.length}
                onChange={setPage}
            />
        </>
    );
}
