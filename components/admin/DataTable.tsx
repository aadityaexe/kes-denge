"use client";

import { useState } from "react";
import { Search, ChevronLeft, ChevronRight, Inbox } from "lucide-react";

export interface Column<T> {
  header: string | React.ReactNode;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchKey?: keyof T;
  filterComponent?: React.ReactNode;
  isLoading?: boolean;
  emptyMessage?: string;
  pageSize?: number;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchPlaceholder = "Search...",
  searchKey,
  filterComponent,
  isLoading = false,
  emptyMessage = "No records found.",
  pageSize = 10,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data based on search
  const filteredData = data.filter((item) => {
    if (!searchQuery) return true;
    if (searchKey) {
      const val = item[searchKey];
      return String(val || "").toLowerCase().includes(searchQuery.toLowerCase());
    }
    // Search across all string values
    return Object.values(item).some((val) =>
      String(val || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-4">
      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface-1 p-3 sm:p-4 rounded-xl border border-[var(--color-border)]">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-4 py-2.5 min-h-[40px] text-xs bg-surface-2 border border-[var(--color-border)] rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-[var(--color-accent)]"
          />
        </div>

        {filterComponent && <div className="flex items-center gap-2 flex-wrap">{filterComponent}</div>}
      </div>

      {/* Table Container */}
      <div className="bg-surface-1 rounded-xl border border-[var(--color-border)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-2 border-b border-[var(--color-border)] text-text-muted uppercase font-mono tracking-wider text-[10px]">
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} className={`px-3.5 sm:px-6 py-3.5 font-semibold ${col.className || ""}`}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 sm:px-6 py-12 text-center text-text-muted">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-[var(--color-accent-dark)] border-r-transparent mb-2" />
                    <p className="text-xs">Loading data...</p>
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 sm:px-6 py-16 text-center text-text-muted">
                    <Inbox size={32} className="mx-auto mb-2 text-text-muted/60" />
                    <p className="font-medium text-sm text-text-primary mb-1">No items found</p>
                    <p className="text-xs text-text-muted">{emptyMessage}</p>
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, rowIdx) => (
                  <tr key={row._id || row.id || rowIdx} className="hover:bg-surface-2/60 transition-colors">
                    {columns.map((col, colIdx) => (
                      <td key={colIdx} className={`px-3.5 sm:px-6 py-3.5 sm:py-4 text-text-secondary ${col.className || ""}`}>
                        {col.cell ? col.cell(row) : col.accessorKey ? String(row[col.accessorKey] ?? "") : ""}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-4 sm:px-6 py-3 border-t border-[var(--color-border)] bg-surface-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-muted">
          <span className="text-center sm:text-left">
            Showing {filteredData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
            {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} entries
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1 || isLoading}
              aria-label="Previous Page"
              className="min-h-[36px] min-w-[36px] p-1.5 flex items-center justify-center rounded border border-[var(--color-border)] bg-surface-1 hover:bg-surface-3 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="font-mono text-[11px] px-2 text-text-primary">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || isLoading}
              aria-label="Next Page"
              className="min-h-[36px] min-w-[36px] p-1.5 flex items-center justify-center rounded border border-[var(--color-border)] bg-surface-1 hover:bg-surface-3 disabled:opacity-40 transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
