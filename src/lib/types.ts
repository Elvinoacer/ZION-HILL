export interface Ministry {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  tasks: string[];
}

export interface MinistryActivity {
  id: number;
  type: "event" | "meeting" | "outreach";
  title: string;
  date: string;
  participants: number;
  ministry: string;
}

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  dueDate?: string;
  ministry: string;
}

export interface Ministry {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  leader?: string;
  members?: number;
  volunteers?: number;
  budget?: BudgetItem[];
  events?: CalendarEvent[];
  tasks: string[];
}

export interface BudgetItem {
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  ministry: string;
  conflict?: boolean;
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  ministry: string[];
  training: TrainingItem[];
  status: "active" | "inactive" | "pending";
}

export interface TrainingItem {
  name: string;
  completed: boolean;
  expiryDate?: string;
  required: boolean;
}

export interface Alert {
  id: string;
  type: "participation" | "budget" | "volunteer";
  ministry: string;
  severity: "low" | "medium" | "high";
  message: string;
  date: string;
  resolved: boolean;
}

export interface OutreachProgram {
  id: string;
  name: string;
  type: "evangelism" | "social-justice" | "disaster-relief";
  location: {
    address: string;
    coordinates: [number, number];
  };
  volunteers: number;
  frequency: string;
  nextEvent: string;
  contact: string;
}

export interface Volunteer {
  id: string;
  name: string;
  skills: string[];
  availability: string[];
  certifications: string[];
  signedWaivers: boolean;
}

export interface MissionTrip {
  id: string;
  destination: string;
  dates: string;
  team: string[];
  fundraising: {
    goal: number;
    raised: number;
    donors: number;
  };
  checklist: {
    item: string;
    completed: boolean;
    required: boolean;
  }[];
  updates: TripUpdate[];
  impact: {
    salvations: number;
    baptisms: number;
    stories: string[];
  };
}

export interface TripUpdate {
  date: string;
  message: string;
  author: string;
}

export interface CommunityPartner {
  id: string;
  name: string;
  type: "shelter" | "school" | "ngo";
  contact: string;
  mou: {
    exists: boolean;
    expiration: string;
  };
  donations: {
    type: string;
    quantity: number;
    date: string;
  }[];
}

export enum BaptismStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  SCHEDULED = "SCHEDULED",
  COMPLETED = "COMPLETED",
}

export interface BaptismCandidate {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  baptismApplicationStatus: BaptismStatus | null;
  baptismClassCompleted: boolean | null;
  baptismDate: Date | null;
}