export const POLL_CATEGORIES = [
  'Other',
  'Health & Wellness',
  'Entertainment',
  'Education',
  'Lifestyle',
  'Technology',
] as const;

export type PollCategory = (typeof POLL_CATEGORIES)[number];

export const POLL_CATEGORY_LABELS: Record<PollCategory, string> = {
  Technology: 'Technology & Innovation',
  Education: 'Education & Learning',
  Lifestyle: 'Lifestyle & Preferences',
  Entertainment: 'Gaming & Entertainment',
  Other: 'Team Activities',
  'Health & Wellness': 'Health & Wellness',
};
export type PollStatus = 'active' | 'completed';
export type PollCompletionReason = 'manual' | 'deadline' | null;

export interface Poll {
  id: string;
  category: PollCategory;
  title: string;
  description: string | null;
  deadline: Date | null;
  status: PollStatus;
  completionReason: PollCompletionReason;
  completedAt: Date | null;
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


export interface VoteSelection {
  questionId: string;
  optionId: string;
  allowMultiple: boolean;
}
