import { useState } from "react";
import { Button, Select, Skeleton } from "antd";
import {
    DownOutlined,
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
        <div className="engine-selected flex gap-[10px] items-start min-w-0 text-[12px] font-normal text-[#A7F3D0]">
            <span className="shrink-0 py-[3px]">Selected:</span>
            <div className="selection-summary flex gap-[6px] flex-wrap min-w-0 [&_>_span]:flex [&_>_span]:items-center [&_>_span]:gap-[4px] [&_>_span]:bg-[#084F40] [&_>_span]:text-[#A7F3D0] [&_>_span]:p-[2px_8px] [&_>_span]:rounded-[4px] [&_>_span]:border [&_>_span]:border-[#0D6452] [&_>_span]:[overflow-wrap:anywhere] [&_>_span]:flex-wrap">
                <span>
                    <span className="text-[rgba(110,231,183,0.70)]">
                        Signal
                    </span>{" "}
                    {selection.signalIds.length} selected
                </span>
                {selection.stages.length > 0 && (
                    <span>CLCM Stage: {selection.stages.join(", ")}</span>
                )}
                {selection.channels.length > 0 && (
                    <span>Channels: {selection.channels.join(", ")}</span>
                )}
            </div>
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
                specified
                title="Leads Ideation"
                description="Add the supplied campaign ideas and review them alongside your existing campaigns."
            />
            <section
                className={`engine-panel flex flex-col items-start self-stretch bg-[#036652] [border:1px_solid_#094C3D] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] text-[#e1efea] rounded-[12px] p-[20px] [&_.collapse-button]:bg-[#075a49] [&_.collapse-button]:text-[#a9d0c1] [&_.collapse-button]:text-[11px] [&_.collapse-button]:px-[11px] [&_.collapse-button:hover]:bg-[#074b3d]! [&_.collapse-button:hover]:text-white! [&_.generate-button]:bg-[var(--rose)] [&_.generate-button]:border-[var(--rose)] [&_.generate-button]:text-white [&_.generate-button]:font-semibold [&_.generate-button]:px-[18px] [&_.generate-button:hover]:bg-[#c71043]! [&_.generate-button:hover]:text-white! [&_.generate-button:hover]:border-[#c71043]! [&_.generate-button:disabled]:bg-[#ffffff0e] [&_.generate-button:disabled]:border-[#ffffff16] [&_.generate-button:disabled]:text-[#91ac9f] [&.collapsed_.engine-selected]:flex-1 [&.collapsed_.engine-header]:flex-wrap [&.collapsed_.engine-header]:gap-[10px] [&.collapsed_.generate-button]:text-[11px] [&.collapsed_.generate-button]:px-[12px] mobile:[&.collapsed_.engine-header-actions]:w-full mobile:[&.collapsed_.engine-selected]:basis-full ${collapsed ? "collapsed" : ""}`}
                aria-label="AI Ideation Engine"
            >
                <div
                    className={`engine-header flex w-full items-end gap-[16px] mobile:flex-wrap ${collapsed ? "" : "pb-[12px] border-b border-white/20"}`}
                >
                    <div className="engine-copy flex-1 min-w-0">
                        <h2 className="flex items-center gap-[6px] text-white text-[18px] font-normal tracking-[-0.45px]">
                            <span
                                className="engine-spark text-[#fc7798] text-[25px] leading-none"
                                aria-hidden="true"
                            >
                                ✧
                            </span>{" "}
                            AI Ideation Engine
                        </h2>
                        {!collapsed && (
                            <p className="engine-description text-[12px] font-normal text-[rgba(209,250,229,0.80)] leading-[1.7] mt-[5px]">
                                Generate 10 Campaign Ideas aligned to selected
                                product focus, market signals, customer
                                lifecycle stage, and delivery channels. Ideas
                                are retained for 14 days from the date of
                                generation.
                            </p>
                        )}
                    </div>
                    {collapsed && summary}
                    <div className="engine-header-actions flex shrink-0 gap-[12px] items-center ml-auto">
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
                        <div className="engine-fields flex w-full items-end gap-[20px] mt-[16px] tablet:flex-wrap tablet:gap-[15px]">
                            <div className="engine-field flex flex-col gap-[7px] w-[250px] max-w-[35%] [&_label]:text-[rgba(167,243,208,0.90)] [&_label]:text-[12px] [&_label]:font-normal [&_.ant-select]:w-full [&_.ant-select]:bg-[#075443] [&_.ant-select]:border-transparent [&_.ant-select]:text-[#d6e9e2] [&_.ant-select_.ant-select-content]:text-[#d6e9e2] [&_.ant-select-placeholder]:text-[#94baaa] [&_.ant-select-suffix]:text-[#94baaa] [&_.ant-select-clear]:text-[#94baaa] [&_.constraint-trigger]:flex [&_.constraint-trigger]:items-center [&_.constraint-trigger]:justify-between [&_.constraint-trigger]:w-full [&_.constraint-trigger]:bg-[#075443] [&_.constraint-trigger]:border-transparent [&_.constraint-trigger]:text-[#d6e9e2] [&_.constraint-trigger]:text-left [&_.constraint-trigger:not(:disabled):hover]:bg-[#075443] [&_.constraint-trigger:not(:disabled):hover]:border-[#94baaa] [&_.constraint-trigger:not(:disabled):hover]:text-[#d6e9e2] [&_.constraint-trigger:disabled]:bg-[#075443] [&_.constraint-trigger:disabled]:border-transparent [&_.constraint-trigger:disabled]:text-[#94baaa] tablet:max-w-none tablet:w-[calc(50%_-_8px)] mobile:w-full">
                                <label htmlFor="focus-product">
                                    Focus Product
                                </label>
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
                            <div className="engine-field flex flex-col gap-[7px] w-[250px] max-w-[35%] [&_label]:text-[rgba(167,243,208,0.90)] [&_label]:text-[12px] [&_label]:font-normal [&_.ant-select]:w-full [&_.ant-select]:bg-[#075443] [&_.ant-select]:border-transparent [&_.ant-select]:text-[#d6e9e2] [&_.ant-select_.ant-select-content]:text-[#d6e9e2] [&_.ant-select-placeholder]:text-[#94baaa] [&_.ant-select-suffix]:text-[#94baaa] [&_.ant-select-clear]:text-[#94baaa] [&_.constraint-trigger]:flex [&_.constraint-trigger]:items-center [&_.constraint-trigger]:justify-between [&_.constraint-trigger]:w-full [&_.constraint-trigger]:bg-[#075443] [&_.constraint-trigger]:border-transparent [&_.constraint-trigger]:text-[#d6e9e2] [&_.constraint-trigger]:text-left [&_.constraint-trigger:not(:disabled):hover]:bg-[#075443] [&_.constraint-trigger:not(:disabled):hover]:border-[#94baaa] [&_.constraint-trigger:not(:disabled):hover]:text-[#d6e9e2] [&_.constraint-trigger:disabled]:bg-[#075443] [&_.constraint-trigger:disabled]:border-transparent [&_.constraint-trigger:disabled]:text-[#94baaa] tablet:max-w-none tablet:w-[calc(50%_-_8px)] mobile:w-full">
                                <label htmlFor="constraints">Constraints</label>
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
                                </Button>
                            </div>
                            <div className="engine-generate ml-auto tablet:w-full tablet:text-right">
                                {generateButton}
                            </div>
                        </div>
                        {selection && (
                            <div className="mt-[12px] w-full">{summary}</div>
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
                    className="generation-placeholder [&.generation-placeholder]:p-[20px] [&.generation-placeholder]:mb-[14px] [&.generation-placeholder]:border-[#b9dbcb] surface bg-white [border:1px_solid_var(--border)] shadow-[0_1px_3px_#223b3510] rounded-[9px]"
                    aria-label="Generating new ideas"
                >
                    <span className="generating-label block text-[12px] text-[#408271] mb-[14px]">
                        <ThunderboltOutlined /> Generating your next campaign
                        ideas
                    </span>
                    <Skeleton active paragraph={{ rows: 2 }} />
                </div>
            )}
            <div className="idea-list flex flex-col gap-[12px]">
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
                                onDetails={(item) =>
                                    void navigate(`/leads/${item.id}`)
                                }
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
