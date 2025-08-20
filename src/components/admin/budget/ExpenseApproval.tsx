"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReconciliationStatus } from "@/generated/prisma";
import { useBudgetStore } from "@/store/budgetStore";
import { format } from "date-fns";
import { useEffect, useState } from "react";

export function ExpenseApproval() {
  const { expenses, loading, error, fetchExpenses, updateExpenseStatus } =
    useBudgetStore();
  const [filterStatus, setFilterStatus] = useState<
    ReconciliationStatus | "all"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleStatusChange = (id: string, status: ReconciliationStatus) => {
    updateExpenseStatus(id, status);
  };

  const filteredExpenses = expenses.filter((expense) => {
    const matchesStatus =
      filterStatus === "all" || expense.reconciliationStatus === filterStatus;
    const matchesSearch =
      expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.fund?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.amount.toString().includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  if (loading)
    return <div className="text-center py-4">Loading expenses...</div>;
  if (error)
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Input
          placeholder="Search expenses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select
          value={filterStatus}
          onValueChange={(value: ReconciliationStatus | "all") =>
            setFilterStatus(value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.values(ReconciliationStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No expenses found.</div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Fund</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{format(new Date(expense.date), "PPP")}</TableCell>
                  <TableCell>{expense.description || "N/A"}</TableCell>
                  <TableCell>${expense.amount.toFixed(2)}</TableCell>
                  <TableCell>{expense.user?.name || "N/A"}</TableCell>
                  <TableCell>{expense.fund?.name || "General"}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium
                        ${
                          expense.reconciliationStatus ===
                          ReconciliationStatus.PENDING
                            ? "bg-yellow-100 text-yellow-800"
                            : expense.reconciliationStatus ===
                              ReconciliationStatus.APPROVED
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                    >
                      {expense.reconciliationStatus}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Select
                      value={expense.reconciliationStatus}
                      onValueChange={(value: ReconciliationStatus) =>
                        handleStatusChange(expense.id, value)
                      }
                    >
                      <SelectTrigger className="w-[120px] h-8">
                        <SelectValue placeholder="Update Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ReconciliationStatus).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.charAt(0).toUpperCase() +
                              status.slice(1).toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
