export const POLL_CATEGORIES = [
  'Technology',
  'Education',
  'Lifestyle',
  'Entertainment',
  'Other',
] as const;

export type PollCategory = (typeof POLL_CATEGORIES)[number];

export interface Poll {
  id: string;
  category: PollCategory;
  title: string;
  question: string;
  description: string | null;
  deadline: Date | null;
  options: PollOption[];
  createdAt: Date;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface CreatePollInput {
  category: PollCategory;
  title: string;
  question: string;
  description: string | null;
  deadline: Date | null;
  options: string[];
}
