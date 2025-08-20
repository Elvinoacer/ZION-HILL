"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { format as formatDate } from "date-fns";
import { BaptismStatus } from "@/lib/types";
import { useBaptismCandidateStore } from "@/store/baptismCandidateStore";

const BaptismCandidatesList: React.FC = () => {
  const {
    candidates = [],
    isLoading,
    error,
    fetchCandidates,
    updateCandidate,
  } = useBaptismCandidateStore();

  const exportButtonRef = useRef<HTMLButtonElement | null>(null);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCandidates, setFilteredCandidates] = useState(candidates);

  // Module refs for preloaded libs
  const xlsxRef = useRef<any>(null);
  const jspdfRef = useRef<any>(null);
  const autotableRef = useRef<any>(null);
  const docxRef = useRef<any>(null);

  /** Optimistic filtering */
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCandidates(candidates);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredCandidates(
        candidates.filter((c) => c.name?.toLowerCase().includes(term))
      );
    }
  }, [searchTerm, candidates]);

  /** Background fetch for latest data (debounced) */
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchCandidates(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [fetchCandidates, searchTerm]);

  // Preload heavy libs
  useEffect(() => {
    (async () => {
      try {
        xlsxRef.current = await import("xlsx");
      } catch (e) {
        console.warn("Could not preload xlsx:", e);
      }
      try {
        const jspdfModule = await import("jspdf");
        jspdfRef.current =
          jspdfModule.jsPDF ?? jspdfModule.default ?? jspdfModule;
      } catch (e) {
        console.warn("Could not preload jspdf:", e);
      }
      try {
        const at = await import("jspdf-autotable");
        autotableRef.current = at.default ?? at;
      } catch (e) {
        console.warn("Could not preload jspdf-autotable:", e);
      }
      try {
        docxRef.current = await import("docx");
      } catch (e) {
        console.warn("Could not preload docx:", e);
      }
    })();
  }, []);

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleStatusChange = (id: string, status: BaptismStatus) =>
    updateCandidate(id, { baptismApplicationStatus: status });

  const handleClassCompletionChange = (id: string, completed: boolean) =>
    updateCandidate(id, { baptismClassCompleted: completed });

  const handleDateChange = (id: string, date: string) =>
    updateCandidate(id, { baptismDate: date ? new Date(date) : null });

  const handleExport = useCallback(
    async (format: "xlsx" | "csv" | "html" | "pdf" | "docx") => {
      if (!candidates || candidates.length === 0) {
        alert("No data to export.");
        return;
      }

      const plainData = candidates.map((c) => ({
        Name: c.name ?? "",
        Status: c.baptismApplicationStatus ?? "",
        "Class Completed": c.baptismClassCompleted ? "Yes" : "No",
        "Baptism Date": c.baptismDate
          ? formatDate(new Date(c.baptismDate), "MMM dd, yyyy")
          : "Not set",
      }));

      const fileName = `baptism-candidates-${new Date()
        .toISOString()
        .slice(0, 10)}`;

      try {
        if (["xlsx", "csv", "html"].includes(format)) {
          const XLSX = xlsxRef.current ?? (await import("xlsx"));
          const ws = XLSX.utils.json_to_sheet(plainData);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Baptism Candidates");

          if (format === "xlsx") {
            XLSX.writeFile(wb, `${fileName}.xlsx`);
          } else if (format === "csv") {
            const csv = XLSX.utils.sheet_to_csv(ws);
            downloadBlob(
              new Blob([csv], { type: "text/csv;charset=utf-8;" }),
              `${fileName}.csv`
            );
          } else {
            const html = XLSX.utils.sheet_to_html(ws);
            downloadBlob(
              new Blob([html], { type: "text/html" }),
              `${fileName}.html`
            );
          }
          return;
        }

        if (format === "pdf") {
          const jsPDFClass = jspdfRef.current ?? (await import("jspdf")).jsPDF;
          const autoTable =
            autotableRef.current ?? (await import("jspdf-autotable")).default;
          const doc = new jsPDFClass({ unit: "pt", format: "a4" });
          if (typeof autoTable === "function") {
            autoTable(doc, {
              head: [["Name", "Status", "Class Completed", "Baptism Date"]],
              body: plainData.map((r) => Object.values(r)),
              styles: { fontSize: 10 },
            });
          }
          doc.save(`${fileName}.pdf`);
          return;
        }

        if (format === "docx") {
          const docx = docxRef.current ?? (await import("docx"));
          const {
            Document,
            Packer,
            Paragraph,
            Table,
            TableRow,
            TableCell,
            WidthType,
            TextRun,
          } = docx;

          const headerRow = new TableRow({
            children: Object.keys(plainData[0]).map(
              (k) =>
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: k, bold: true })],
                    }),
                  ],
                })
            ),
          });

          const bodyRows = plainData.map(
            (r) =>
              new TableRow({
                children: Object.values(r).map(
                  (val) =>
                    new TableCell({ children: [new Paragraph(String(val))] })
                ),
              })
          );

          const table = new Table({
            rows: [headerRow, ...bodyRows],
            width: { size: 100, type: WidthType.PERCENTAGE },
          });

          const doc = new Document({
            sections: [
              {
                children: [
                  new Paragraph({
                    text: "Baptism Candidates",
                    heading: docx.HeadingLevel?.HEADING_1 ?? undefined,
                  }),
                  table,
                ],
              },
            ],
          });

          const blob = await Packer.toBlob(doc);
          downloadBlob(blob, `${fileName}.docx`);
        }
      } catch (err) {
        console.error("Export failed:", err);
        alert(`Export failed: ${(err as Error).message || err}`);
      }
    },
    [candidates]
  );

  if (error)
    return (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-sm mb-6">
        <p className="font-semibold">Error loading candidates</p>
        <p className="text-sm">{String(error)}</p>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Baptism Candidates
            </h1>
            <p className="text-gray-500 mt-1">
              Manage all baptism applications
            </p>
          </div>
          <div className="flex space-x-3 relative">
            <input
              type="text"
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <div className="relative">
              <button
                ref={exportButtonRef}
                className="px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                onClick={() => setShowExportDropdown((s) => !s)}
              >
                Export
              </button>
              {showExportDropdown && (
                <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-md border z-50">
                  {["xlsx", "csv", "html", "pdf", "docx"].map((fmt) => (
                    <button
                      key={fmt}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                      onClick={() => {
                        setShowExportDropdown(false);
                        handleExport(fmt as any);
                      }}
                    >
                      {fmt.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">
                  Candidate
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">
                  Class Completed
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">
                  Baptism Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(searchTerm ? filteredCandidates : candidates).map(
                (candidate) => (
                  <tr key={candidate.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {candidate.name?.charAt(0)?.toUpperCase() ?? "?"}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium">
                          {candidate.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {candidate.id?.slice(0, 8)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={candidate.baptismApplicationStatus ?? ""}
                        onChange={(e) =>
                          handleStatusChange(
                            candidate.id,
                            e.target.value as BaptismStatus
                          )
                        }
                        className="block w-full rounded-lg border-gray-200 shadow-sm text-sm py-1.5 px-3"
                      >
                        {Object.values(BaptismStatus).map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={candidate.baptismClassCompleted || false}
                          onChange={(e) =>
                            handleClassCompletionChange(
                              candidate.id,
                              e.target.checked
                            )
                          }
                          className="h-4 w-4 text-blue-600 rounded border-gray-300"
                        />
                        <span className="ml-2 text-sm">
                          {candidate.baptismClassCompleted
                            ? "Completed"
                            : "Pending"}
                        </span>
                      </label>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="date"
                        value={
                          candidate.baptismDate
                            ? formatDate(
                                new Date(candidate.baptismDate),
                                "yyyy-MM-dd"
                              )
                            : ""
                        }
                        onChange={(e) =>
                          handleDateChange(candidate.id, e.target.value)
                        }
                        className="block w-full rounded-lg border-gray-200 shadow-sm text-sm py-1.5 px-3"
                      />
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3.5 border-t border-gray-200 bg-gray-50 flex justify-between">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium">
              {(searchTerm ? filteredCandidates : candidates).length}
            </span>{" "}
            candidates
          </p>
          <div className="text-xs text-gray-400">
            Last updated: {formatDate(new Date(), "MMM dd, yyyy h:mm a")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaptismCandidatesList;
