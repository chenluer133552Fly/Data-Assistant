import { useEffect, useMemo, useRef, useState } from "react";
import { Download, Maximize2, Minimize2, Pencil, X } from "lucide-react";
import embed, { type Result, type VisualizationSpec } from "vega-embed";
import type { ChartDefinition, ChartMark } from "../types/domain";

type ChartPanelProps = {
  charts: ChartDefinition[];
};

const markOptions: Array<{ label: string; value: ChartMark }> = [
  { label: "Bar", value: "bar" },
  { label: "Line", value: "line" },
  { label: "Area", value: "area" },
  { label: "Point", value: "point" },
];

export function ChartPanel({ charts }: ChartPanelProps) {
  const chartGridRef = useRef<HTMLDivElement>(null);
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [layout, setLayout] = useState<"one" | "two">("two");
  const [approach, setApproach] = useState(
    "Compare acquisition, revenue, channel, and balance trends to identify material changes and actionable business opportunities.",
  );

  const downloadAllCharts = () => {
    const chartSvgs = Array.from(
      chartGridRef.current?.querySelectorAll<SVGSVGElement>(".vega-embed svg") ?? [],
    );
    if (!chartSvgs.length) return;

    const columnCount = layout === "two" ? 2 : 1;
    const padding = 24;
    const gap = 24;
    const titleHeight = 30;
    const chartWidth = Math.max(...chartSvgs.map((svg) => svg.viewBox.baseVal.width));
    const chartHeight = Math.max(...chartSvgs.map((svg) => svg.viewBox.baseVal.height));
    const rowCount = Math.ceil(chartSvgs.length / columnCount);
    const outputWidth = padding * 2 + chartWidth * columnCount + gap * (columnCount - 1);
    const outputHeight =
      padding * 2 + (chartHeight + titleHeight) * rowCount + gap * (rowCount - 1);
    const namespace = "http://www.w3.org/2000/svg";
    const output = document.createElementNS(namespace, "svg");
    output.setAttribute("xmlns", namespace);
    output.setAttribute("viewBox", `0 0 ${outputWidth} ${outputHeight}`);
    output.setAttribute("width", String(outputWidth));
    output.setAttribute("height", String(outputHeight));

    const background = document.createElementNS(namespace, "rect");
    background.setAttribute("width", "100%");
    background.setAttribute("height", "100%");
    background.setAttribute("fill", "white");
    output.appendChild(background);

    chartSvgs.forEach((svg, index) => {
      const column = index % columnCount;
      const row = Math.floor(index / columnCount);
      const x = padding + column * (chartWidth + gap);
      const y = padding + row * (chartHeight + titleHeight + gap);
      const title = document.createElementNS(namespace, "text");
      title.setAttribute("x", String(x));
      title.setAttribute("y", String(y + 16));
      title.setAttribute("fill", "#515C6B");
      title.setAttribute("font-family", "Inter, Arial, sans-serif");
      title.setAttribute("font-size", "12");
      title.setAttribute("font-weight", "600");
      title.textContent = charts[index]?.title.toUpperCase() ?? `CHART ${index + 1}`;
      output.appendChild(title);

      const clone = svg.cloneNode(true) as SVGSVGElement;
      clone.setAttribute("x", String(x));
      clone.setAttribute("y", String(y + titleHeight));
      clone.setAttribute("width", String(chartWidth));
      clone.setAttribute("height", String(chartHeight));
      output.appendChild(clone);
    });

    const blob = new Blob([new XMLSerializer().serializeToString(output)], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "chart-dashboard.svg";
    link.href = url;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  return (
    <>
      {expanded ? (
        <button
          aria-label="Close chart panel fullscreen"
          className="fixed inset-0 z-40 cursor-default bg-black/40"
          onClick={() => setExpanded(false)}
          type="button"
        />
      ) : null}
      <section
        className={`assistant-card px-5 py-5 ${
          expanded ? "fixed inset-6 z-50 overflow-y-auto bg-white" : ""
        }`}
      >
        <div className="border-b border-[#E8EDF2] pb-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#586471]">
              Chart
            </h2>
            <div className="relative flex shrink-0 gap-1.5">
              <ToolButton
                active={editing}
                label="Edit chart panel"
                onClick={() => setEditing((value) => !value)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </ToolButton>
              <ToolButton label="Download all charts" onClick={downloadAllCharts}>
                <Download className="h-3.5 w-3.5" />
              </ToolButton>
              <ToolButton
                label={
                  expanded ? "Exit chart panel fullscreen" : "View chart panel fullscreen"
                }
                onClick={() => setExpanded((value) => !value)}
              >
                {expanded ? (
                  <Minimize2 className="h-3.5 w-3.5" />
                ) : (
                  <Maximize2 className="h-3.5 w-3.5" />
                )}
              </ToolButton>

              {editing ? (
                <div className="absolute right-0 top-10 z-20 w-72 border border-[#DCE4ED] bg-white p-4 shadow-[0_14px_34px_rgba(48,62,84,0.16)] [border-radius:8px]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#4D5969]">
                      Edit chart panel
                    </span>
                    <button
                      aria-label="Close chart panel editor"
                      className="text-[#8491A2] hover:text-[#27313F]"
                      onClick={() => setEditing(false)}
                      type="button"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <label
                    className="mt-4 block text-[11px] font-medium text-[#718097]"
                    htmlFor="chart-panel-layout"
                  >
                    Layout
                  </label>
                  <select
                    className="mt-1 h-9 w-full border border-[#DCE4ED] bg-[#F8FAFC] px-3 text-xs text-[#3E4856] [border-radius:6px]"
                    id="chart-panel-layout"
                    onChange={(event) => setLayout(event.target.value as "one" | "two")}
                    value={layout}
                  >
                    <option value="two">Two columns</option>
                    <option value="one">One column</option>
                  </select>
                  <label
                    className="mt-3 block text-[11px] font-medium text-[#718097]"
                    htmlFor="chart-panel-approach"
                  >
                    Analytical approach
                  </label>
                  <textarea
                    className="mt-1 min-h-24 w-full resize-y border border-[#DCE4ED] bg-[#F8FAFC] px-3 py-2 text-xs leading-5 text-[#3E4856] [border-radius:6px]"
                    id="chart-panel-approach"
                    onChange={(event) => setApproach(event.target.value)}
                    value={approach}
                  />
                </div>
              ) : null}
            </div>
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.08em] text-[#8A96A6]">
            Specified analytical approach
          </p>
          <p className="mt-2 text-sm leading-6 text-[#3E4856]">{approach}</p>
        </div>

        <div
          className={`mt-4 grid gap-4 ${layout === "two" ? "md:grid-cols-2" : "grid-cols-1"}`}
          ref={chartGridRef}
        >
          {charts.map((chart) => (
            <ChartCard
              chart={chart}
              key={chart.id}
              panelExpanded={expanded}
              panelLayout={layout}
            />
          ))}
        </div>
      </section>
    </>
  );
}

function ChartCard({
  chart,
  panelExpanded,
  panelLayout,
}: {
  chart: ChartDefinition;
  panelExpanded: boolean;
  panelLayout: "one" | "two";
}) {
  const chartRootRef = useRef<HTMLDivElement>(null);
  const renderResultRef = useRef<Result | null>(null);
  const [mark, setMark] = useState<ChartMark>(chart.mark);
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const spec = useMemo<VisualizationSpec>(() => {
    const hasSeries = chart.values.some((item) => item.series);
    const colorEncoding = hasSeries
      ? {
          field: "series",
          type: "nominal" as const,
          legend: { orient: "top" as const, title: null },
          scale: { range: ["#8FB8F5", "#E7A6B8", "#7FC9B8"] },
        }
      : { value: mark === "area" ? "#A9A7F5" : "#AFCBF8" };

    return {
      $schema: "https://vega.github.io/schema/vega-lite/v6.json",
      width: "container",
      height: expanded ? 420 : panelExpanded ? 260 : panelLayout === "one" ? 220 : 180,
      autosize: { type: "fit", contains: "padding", resize: true },
      data: { values: chart.values },
      mark:
        mark === "bar"
          ? { type: "bar", cornerRadiusEnd: 2, opacity: 0.9 }
          : mark === "line"
            ? { type: "line", point: true, strokeWidth: 2.2 }
            : mark === "area"
              ? { type: "area", line: true, opacity: 0.34 }
              : { type: "point", filled: true, size: 90 },
      encoding: {
        x: {
          field: "category",
          type: "ordinal",
          axis: { labelAngle: 0, title: null, labelColor: "#697789" },
        },
        y: {
          field: "value",
          type: "quantitative",
          axis: { title: chart.yTitle, titleColor: "#7B8797", labelColor: "#697789" },
          scale: { zero: true },
        },
        color: colorEncoding,
        ...(hasSeries && mark === "bar"
          ? { xOffset: { field: "series", type: "nominal" as const } }
          : {}),
        tooltip: [
          { field: "category", type: "ordinal", title: "Period" },
          ...(hasSeries
            ? [{ field: "series", type: "nominal" as const, title: "Series" }]
            : []),
          { field: "value", type: "quantitative", title: chart.yTitle },
        ],
      },
      config: {
        background: "transparent",
        view: { stroke: null },
        axis: { domainColor: "#DDE4EC", gridColor: "#E9EEF4", tickColor: "#DDE4EC" },
        font: "Inter, ui-sans-serif, system-ui, sans-serif",
      },
    } as VisualizationSpec;
  }, [chart, expanded, mark, panelExpanded, panelLayout]);

  useEffect(() => {
    if (!chartRootRef.current) return;

    let disposed = false;
    embed(chartRootRef.current, spec, {
      actions: false,
      renderer: "svg",
      tooltip: true,
    }).then((result) => {
      if (disposed) {
        result.finalize();
        return;
      }
      renderResultRef.current = result;
    });

    return () => {
      disposed = true;
      renderResultRef.current?.finalize();
      renderResultRef.current = null;
    };
  }, [spec]);

  const downloadChart = async () => {
    const url = await renderResultRef.current?.view.toImageURL("png", 2);
    if (!url) return;

    const link = document.createElement("a");
    link.download = `${chart.id}.png`;
    link.href = url;
    link.click();
  };

  return (
    <>
      {expanded ? (
        <button
          aria-label="Close chart fullscreen"
          className="fixed inset-0 z-40 cursor-default bg-black/40"
          onClick={() => setExpanded(false)}
          type="button"
        />
      ) : null}
      <article
        className={`border border-[#E5EAF0] bg-[#FBFCFE] p-3 [border-radius:8px] ${
          expanded ? "fixed inset-6 z-50 flex flex-col bg-white p-5" : "relative"
        }`}
      >
        <div className="flex min-h-9 items-start justify-between gap-3">
          <h3 className="min-w-0 truncate pt-1 text-xs font-semibold uppercase text-[#515C6B]">
            {chart.title}
          </h3>
          <div className="relative flex shrink-0 gap-1">
            <ToolButton
              active={editing}
              label="Edit chart"
              onClick={() => setEditing((value) => !value)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </ToolButton>
            <ToolButton label="Download chart" onClick={downloadChart}>
              <Download className="h-3.5 w-3.5" />
            </ToolButton>
            <ToolButton
              label={expanded ? "Exit fullscreen" : "View chart fullscreen"}
              onClick={() => setExpanded((value) => !value)}
            >
              {expanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </ToolButton>

            {editing ? (
              <div className="absolute right-0 top-9 z-10 w-48 border border-[#DCE4ED] bg-white p-3 shadow-[0_14px_34px_rgba(48,62,84,0.16)] [border-radius:8px]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#4D5969]">Chart type</span>
                  <button
                    aria-label="Close chart editor"
                    className="text-[#8491A2] hover:text-[#27313F]"
                    onClick={() => setEditing(false)}
                    type="button"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <select
                  aria-label={`Chart type for ${chart.title}`}
                  className="mt-3 h-9 w-full border border-[#DCE4ED] bg-[#F8FAFC] px-3 text-xs text-[#3E4856] [border-radius:6px]"
                  onChange={(event) => setMark(event.target.value as ChartMark)}
                  value={mark}
                >
                  {markOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
          </div>
        </div>

        <div
          className={
            expanded
              ? "min-h-0 w-full flex-1"
              : panelExpanded
                ? "h-[270px] w-full"
                : panelLayout === "one"
                  ? "h-[230px] w-full"
                  : "h-[190px] w-full"
          }
          ref={chartRootRef}
        />
        <p className="mt-2 border border-[#E8EDF2] bg-white px-3 py-2 text-[11px] leading-5 text-[#66758A] [border-radius:6px]">
          {chart.description}
        </p>
      </article>
    </>
  );
}

function ToolButton({
  active,
  children,
  label,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      className={`inline-flex h-8 w-8 items-center justify-center border transition [border-radius:6px] ${
        active
          ? "border-[#9CC7E8] bg-[#EEF8FF] text-[#1B84B7]"
          : "border-[#DCE4ED] bg-white text-[#65758A] hover:border-[#9CC7E8] hover:text-[#1B84B7]"
      }`}
      onClick={onClick}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}
