import { useState } from 'react';
import type { ColumnDef } from '../../types/query';
import './DataTable.css';

interface Props {
    title?: string;
    columns: ColumnDef[];
    rows: Record<string, unknown>[];
    totalRows: number;
    pageSize?: number;
}

type SortDir = 'asc' | 'desc' | null;

export default function DataTable({ title, columns, rows, totalRows, pageSize = 15 }: Props) {
    const [page, setPage] = useState(1);
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<SortDir>(null);
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

    const totalPages = Math.ceil(totalRows / pageSize);
    const startRow = (page - 1) * pageSize;

    const sortedRows = [...rows];
    if (sortKey && sortDir) {
        sortedRows.sort((a, b) => {
            const va = String(a[sortKey] ?? '');
            const vb = String(b[sortKey] ?? '');
            return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
        });
    }

    const pageRows = sortedRows.slice(startRow, startRow + pageSize);
    const allPageSelected = pageRows.length > 0 && pageRows.every((_, i) => selectedRows.has(startRow + i));

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortDir(sortDir === 'asc' ? 'desc' : sortDir === 'desc' ? null : 'asc');
            if (sortDir === 'desc') setSortKey(null);
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
    };

    const toggleRow = (index: number) => {
        setSelectedRows((prev) => {
            const next = new Set(prev);
            if (next.has(index)) next.delete(index);
            else next.add(index);
            return next;
        });
    };

    const toggleAllPage = () => {
        setSelectedRows((prev) => {
            const next = new Set(prev);
            if (allPageSelected) {
                pageRows.forEach((_, i) => next.delete(startRow + i));
            } else {
                pageRows.forEach((_, i) => next.add(startRow + i));
            }
            return next;
        });
    };

    const renderCell = (value: unknown) => {
        const str = String(value ?? '');
        const statusMap: Record<string, string> = {
            PENDING: 'status--pending',
            FLAGGED: 'status--flagged',
            SETTLED: 'status--settled',
        };

        if (statusMap[str]) {
            return <span className={`data-table__status ${statusMap[str]}`}>{str}</span>;
        }

        return str;
    };

    return (
        <section className="data-table">
            <div className="data-table__toolbar">
                {title && <div className="data-table__title">{title}</div>}
                <button className="data-table__action-btn" aria-label="Download table">DL</button>
                <button className="data-table__action-btn" aria-label="Expand table">[]</button>
            </div>

            <div className="data-table__scroll">
                <table className="data-table__table">
                    <thead>
                        <tr>
                            <th className="data-table__th data-table__th--checkbox">
                                <input
                                    type="checkbox"
                                    className="data-table__checkbox"
                                    checked={allPageSelected}
                                    onChange={toggleAllPage}
                                />
                            </th>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className="data-table__th"
                                    style={col.width ? { width: col.width } : undefined}
                                    onClick={() => col.sortable !== false && handleSort(col.key)}
                                >
                                    {col.title}
                                    {col.sortable !== false && (
                                        <span className="data-table__sort-icon">
                                            {sortKey === col.key ? (sortDir === 'asc' ? 'ASC' : 'DESC') : '-'}
                                        </span>
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {pageRows.map((row, i) => {
                            const globalIndex = startRow + i;
                            const isSelected = selectedRows.has(globalIndex);
                            return (
                                <tr key={i} className={`data-table__tr ${isSelected ? 'data-table__tr--selected' : ''}`}>
                                    <td className="data-table__td data-table__td--checkbox">
                                        <input
                                            type="checkbox"
                                            className="data-table__checkbox"
                                            checked={isSelected}
                                            onChange={() => toggleRow(globalIndex)}
                                        />
                                    </td>
                                    {columns.map((col) => (
                                        <td key={col.key} className="data-table__td">
                                            {renderCell(row[col.key])}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="data-table__footer">
                <div className="data-table__page-size">Rows per page: {pageSize}</div>
                <div className="data-table__page-info">
                    Showing {startRow + 1}-{Math.min(startRow + pageSize, totalRows)} of {totalRows.toLocaleString()} entries
                </div>
                <div className="data-table__pagination">
                    <button onClick={() => setPage(1)} disabled={page <= 1}>|&lt;</button>
                    <button onClick={() => setPage(page - 1)} disabled={page <= 1}>&lt;</button>
                    <span className="data-table__page-num">Page {page} of {totalPages}</span>
                    <button onClick={() => setPage(page + 1)} disabled={page >= totalPages}>&gt;</button>
                    <button onClick={() => setPage(totalPages)} disabled={page >= totalPages}>&gt;|</button>
                </div>
            </div>
        </section>
    );
}
