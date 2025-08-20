import React from "react";
import { formatCurrency } from "./page"; // Assuming formatCurrency is exported from page.tsx

interface MinistryBudgetRowProps {
  ministry: {
    id: string;
    name: string;
    allocatedBudget: number;
    spent: number;
  };
  editingInputValues: Record<string, string>;
  handleAllocatedChange: (ministryId: string, value: string) => void;
  handleAllocatedBlur: (ministryId: string) => void;
}

const MinistryBudgetRow: React.FC<MinistryBudgetRowProps> = React.memo(
  ({
    ministry,
    editingInputValues,
    handleAllocatedChange,
    handleAllocatedBlur,
  }) => {
    return (
      <tr key={ministry.id} className="hover:bg-gray-50">
        <td className="py-4 px-4 border-b text-lg text-gray-900">
          {ministry.name}
        </td>
        <td className="py-4 px-4 border-b">
          <input
            type="number"
            value={
              editingInputValues[ministry.id] !== undefined
                ? editingInputValues[ministry.id]
                : typeof ministry.allocatedBudget === "number"
                ? ministry.allocatedBudget
                : ""
            }
            onChange={(e) =>
              handleAllocatedChange(ministry.id, e.target.value)
            }
            onBlur={() => handleAllocatedBlur(ministry.id)}
            className="border border-gray-300 rounded-md p-2 text-lg w-32"
          />
        </td>
        <td className="py-4 px-4 border-b text-lg text-gray-700">
          {formatCurrency(ministry.spent || 0)}
        </td>
        <td className="py-4 px-4 border-b text-lg text-gray-700">
          {formatCurrency(
            (ministry.allocatedBudget || 0) - (ministry.spent || 0)
          )}
        </td>
      </tr>
    );
  }
);

MinistryBudgetRow.displayName = "MinistryBudgetRow";

export default MinistryBudgetRow;
