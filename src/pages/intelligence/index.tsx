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
                title="Intelligence Radar"
                description="Customer signals, CIO insights from the Chief Investment Office, omni-channel behaviors."
                extra={
                    <span className="sync-label text-[#91979c] text-[11px] whitespace-nowrap [&_b]:text-[#649485] [&_b]:font-medium [&_.anticon]:mr-[3px] compact:whitespace-normal compact:max-w-[150px] compact:text-right mobile:max-w-none mobile:text-[10px]">
                        <ClockCircleOutlined /> Last synced:{" "}
                        <b>Oct 30, 2026 · 08:17 HKT</b>
                    </span>
                }
            />
            <Tabs
                activeKey={tab}
                className="radar-tabs [&_.ant-tabs-nav]:mb-[0] [&_.ant-tabs-nav::before]:[border:0] [&_.ant-tabs-tab]:pt-[0] [&_.ant-tabs-tab]:text-[12px]"
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
                                <span className="tab-count text-[10px] text-[#899e97] ml-[7px] bg-[#eff4f1] rounded-[3px] p-[0_4px]">
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
                                <span className="tab-count text-[10px] text-[#899e97] ml-[7px] bg-[#eff4f1] rounded-[3px] p-[0_4px]">
                                    {cioSignals.length}
                                </span>
                            </>
                        ),
                    },
                ]}
            />
            <div className="filter-bar flex items-center justify-between gap-[12px] m-[19px_0_16px] [&_.ant-select]:text-[11px] [&_.ant-select]:h-[31px] [&_.ant-input-affix-wrapper]:text-[11px] [&_.ant-input-affix-wrapper]:min-h-[31px] [&_.idea-search]:w-[280px] [&_.idea-search]:flex-[0_1_280px] [&_.idea-search]:bg-transparent compact:flex-wrap compact:[&_.idea-search]:ml-auto compact:[&_.idea-search]:basis-[310px] mobile:[&_.idea-search]:w-full mobile:[&_.idea-search]:basis-[100%] radar-filters [&.radar-filters]:justify-start [&.radar-filters]:m-[12px_0_20px] [&.radar-filters]:gap-[12px] [&_.ant-select]:min-w-[170px] mobile:[&.radar-filters]:flex-wrap mobile:[&.radar-filters]:gap-[7px] mobile:[&_.ant-select]:min-w-[140px] mobile:[&_.ant-select]:flex-1">
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
            <div className="signal-list flex flex-col gap-[12px]">
                {list.length ? (
                    list
                        .slice((page - 1) * 10, page * 10)
                        .map((signal) => (
                            <SignalCard key={signal.id} signal={signal} />
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
