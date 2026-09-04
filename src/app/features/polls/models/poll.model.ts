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
  description: string | null;
  deadline: Date | null;
  questions: PollQuestion[];
  createdAt: Date;
}

export interface PollQuestion {
  id: string;
  text: string;
  position: number;
  allowMultiple: boolean;
  options: PollOption[];
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface CreatePollInput {
  category: PollCategory;
  title: string;
  description: string | null;
  deadline: Date | null;
  questions: CreatePollQuestionInput[];
}

export interface CreatePollQuestionInput {
  question: string;
  allowMultiple: boolean;
  options: string[];
}
