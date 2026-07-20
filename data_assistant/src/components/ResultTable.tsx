import { Info } from "lucide-react";
import type { QueryResult } from "../types/domain";

type ResultTableProps = {
  result: QueryResult;
  selectedRows: string[];
  onToggleRow: (rowId: string) => void;
};

export function ResultTable({
  result,
  selectedRows,
  onToggleRow,
}: ResultTableProps) {
  const allSelected = result.rows.every((row) => selectedRows.includes(row.id));

  const toggleAll = () => {
    if (allSelected) {
      result.rows.forEach((row) => {
        if (selectedRows.includes(row.id)) onToggleRow(row.id);
      });
      return;
    }

    result.rows.forEach((row) => {
      if (!selectedRows.includes(row.id)) onToggleRow(row.id);
    });
  };

  return (
    <section className="assistant-card overflow-hidden">
      <div className="border-b border-[#E2E8EF] px-5 py-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.10em] text-[#586471]">
          {result.title}
        </h2>
        <div className="mt-3 inline-flex items-center gap-2 border border-[#E2E8EF] bg-[#FBFCFD] px-3 py-2 text-sm text-[#6E7781] [border-radius:8px]">
          <Info className="h-4 w-4 text-[#23838B]" />
          Selected Data: {selectedRows.length} rows
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] border-collapse text-sm">
          <thead className="bg-[#F2F5F8] text-left text-xs uppercase tracking-[0.12em] text-[#586471]">
            <tr>
              <th className="w-12 border-b border-[#E2E8EF] px-4 py-3">
                <input
                  aria-label="Select all rows"
                  checked={allSelected}
                  className="h-4 w-4 accent-[#23838B]"
                  onChange={toggleAll}
                  type="checkbox"
                />
              </th>
              {result.columns.map((column) => (
                <th className="border-b border-[#E2E8EF] px-4 py-3" key={column.key}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8EDF2] bg-white">
            {result.rows.map((row) => {
              const checked = selectedRows.includes(row.id);

              return (
                <tr className={checked ? "bg-[#F1FAFB]" : "bg-white"} key={row.id}>
                  <td className="px-4 py-3">
                    <input
                      aria-label={`Select ${row.customer_id}`}
                      checked={checked}
                      className="h-4 w-4 accent-[#23838B]"
                      onChange={() => onToggleRow(row.id)}
                      type="checkbox"
                    />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[#222934]">
                    {row.customer_id}
                  </td>
                  <td className="px-4 py-3 text-[#586471]">{row.event_time}</td>
                  <td className="px-4 py-3 text-[#222934]">{row.client_name}</td>
                  <td className="px-4 py-3 text-[#586471]">{row.asset_symbol}</td>
                  <td className="px-4 py-3 text-[#586471]">{row.region}</td>
                  <td className="px-4 py-3 font-medium text-[#222934]">
                    {row.trade_amount}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
