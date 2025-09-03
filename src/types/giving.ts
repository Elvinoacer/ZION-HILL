import { Transaction } from "@/generated/prisma";

export interface Giving {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  goalAmount: number | null;
  startDate: Date | null;
  endDate: Date | null;
  transactions: Transaction[];
}
