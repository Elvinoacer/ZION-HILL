export interface Giving {
  id: string;
  name: string;
  description: string | null;
  goalAmount: number | null;
  startDate: Date | null;
  endDate: Date | null;
}