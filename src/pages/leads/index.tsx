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
        <div className="selection-summary flex gap-[6px] flex-wrap min-w-0 [&_>_span]:bg-[#075844] [&_>_span]:text-[#a7cdbf] [&_>_span]:p-[3px_8px] [&_>_span]:rounded-[3px] [&_>_span]:text-[10px] [&_>_span]:[overflow-wrap:anywhere]">
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
                className={`engine-panel bg-[var(--teal)] text-[#e1efea] rounded-[10px] p-[22px_23px_19px] [&_.collapse-button]:bg-[#075a49] [&_.collapse-button]:text-[#a9d0c1] [&_.collapse-button]:text-[11px] [&_.collapse-button]:px-[11px] [&_.collapse-button:hover]:bg-[#074b3d]! [&_.collapse-button:hover]:text-white! [&_.generate-button]:bg-[var(--rose)] [&_.generate-button]:border-[var(--rose)] [&_.generate-button]:text-white [&_.generate-button]:font-semibold [&_.generate-button]:px-[18px] [&_.generate-button:hover]:bg-[#c71043]! [&_.generate-button:hover]:text-white! [&_.generate-button:hover]:border-[#c71043]! [&_.generate-button:disabled]:bg-[#ffffff0e] [&_.generate-button:disabled]:border-[#ffffff16] [&_.generate-button:disabled]:text-[#91ac9f] [&.collapsed]:p-[13px_19px] [&.collapsed_h2]:text-[14px] [&.collapsed_.selection-summary]:flex-1 [&.collapsed_.engine-header]:flex-wrap [&.collapsed_.engine-header]:gap-[10px] [&.collapsed_.generate-button]:text-[11px] [&.collapsed_.generate-button]:px-[12px] mobile:p-[16px] mobile:[&.collapsed_.engine-header-actions]:w-full mobile:[&.collapsed_.selection-summary]:basis-[100%] ${collapsed ? "collapsed" : ""}`}
                aria-label="AI Ideation Engine"
            >
                <div className="engine-header flex items-center gap-[16px] [&_h2]:font-medium [&_h2]:text-[18px] [&_h2]:whitespace-nowrap mobile:[&_h2]:text-[16px] mobile:gap-[8px]">
                    <h2>
                        <span className="engine-spark text-[#fc7798] text-[25px] [vertical-align:-1px] mr-[4px]">
                            ✧
                        </span>{" "}
                        AI Ideation Engine
                    </h2>
                    {collapsed && summary}
                    <div className="engine-header-actions flex gap-[12px] items-center ml-auto">
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
                        <p className="engine-description text-[11px] text-[#8cbbac] leading-[1.7] mt-[5px] pb-[15px] [border-bottom:1px_solid_#ffffff10]">
                            Generate 10 Campaign Ideas aligned to selected
                            product focus, market signals, customer lifecycle
                            stage, and delivery channels. Ideas are retained for
                            14 days from the date of generation.
                        </p>
                        <div className="engine-fields flex items-end gap-[20px] mt-[19px] tablet:flex-wrap tablet:gap-[15px]">
                            <div className="engine-field flex flex-col gap-[7px] w-[250px] max-w-[35%] [&_label]:text-[#a4c9bb] [&_label]:text-[12px] [&_label_small]:float-right [&_label_small]:text-[10px] [&_label_small]:bg-[#075442] [&_label_small]:rounded-[3px] [&_label_small]:p-[0_5px] [&_.ant-select]:w-full [&_.ant-select]:bg-[#075443] [&_.ant-select]:border-transparent [&_.ant-select]:text-[#d6e9e2] [&_.ant-select_.ant-select-content]:text-[#d6e9e2] [&_.ant-select-placeholder]:text-[#94baaa] [&_.ant-select-suffix]:text-[#94baaa] [&_.ant-select-clear]:text-[#94baaa] [&_.constraint-trigger]:flex [&_.constraint-trigger]:items-center [&_.constraint-trigger]:justify-between [&_.constraint-trigger]:w-full [&_.constraint-trigger]:bg-[#075443] [&_.constraint-trigger]:border-transparent [&_.constraint-trigger]:text-[#d6e9e2] [&_.constraint-trigger]:text-left [&_.constraint-trigger:not(:disabled):hover]:bg-[#075443] [&_.constraint-trigger:not(:disabled):hover]:border-[#94baaa] [&_.constraint-trigger:not(:disabled):hover]:text-[#d6e9e2] [&_.constraint-trigger:disabled]:bg-[#075443] [&_.constraint-trigger:disabled]:border-transparent [&_.constraint-trigger:disabled]:text-[#94baaa] tablet:max-w-none tablet:w-[calc(50%_-_8px)] mobile:w-full">
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
                            <div className="engine-field flex flex-col gap-[7px] w-[250px] max-w-[35%] [&_label]:text-[#a4c9bb] [&_label]:text-[12px] [&_label_small]:float-right [&_label_small]:text-[10px] [&_label_small]:bg-[#075442] [&_label_small]:rounded-[3px] [&_label_small]:p-[0_5px] [&_.ant-select]:w-full [&_.ant-select]:bg-[#075443] [&_.ant-select]:border-transparent [&_.ant-select]:text-[#d6e9e2] [&_.ant-select_.ant-select-content]:text-[#d6e9e2] [&_.ant-select-placeholder]:text-[#94baaa] [&_.ant-select-suffix]:text-[#94baaa] [&_.ant-select-clear]:text-[#94baaa] [&_.constraint-trigger]:flex [&_.constraint-trigger]:items-center [&_.constraint-trigger]:justify-between [&_.constraint-trigger]:w-full [&_.constraint-trigger]:bg-[#075443] [&_.constraint-trigger]:border-transparent [&_.constraint-trigger]:text-[#d6e9e2] [&_.constraint-trigger]:text-left [&_.constraint-trigger:not(:disabled):hover]:bg-[#075443] [&_.constraint-trigger:not(:disabled):hover]:border-[#94baaa] [&_.constraint-trigger:not(:disabled):hover]:text-[#d6e9e2] [&_.constraint-trigger:disabled]:bg-[#075443] [&_.constraint-trigger:disabled]:border-transparent [&_.constraint-trigger:disabled]:text-[#94baaa] tablet:max-w-none tablet:w-[calc(50%_-_8px)] mobile:w-full">
                                <label htmlFor="constraints">
                                    Constraints{" "}
                                    {selection && (
                                        <small>{count} selected</small>
                                    )}
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
                            <div className="engine-generate ml-auto tablet:w-full tablet:text-right">
                                {generateButton}
                            </div>
                        </div>
                        {selection && (
                            <div className="engine-selected flex gap-[10px] items-start mt-[15px] text-[11px] text-[#98c2b3]">
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
