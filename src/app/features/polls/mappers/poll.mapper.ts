import {
  Poll,
  PollCategory,
  PollCompletionReason,
  PollOption,
  PollQuestion,
  PollStatus,
} from '../models/poll.model';

export interface PollRow {
  id: string;
  category: PollCategory;
  title: string;
  question: string;
  description: string | null;
  deadline: string | null;
  status: PollStatus;
  completion_reason: PollCompletionReason;
  completed_at: string | null;
  created_at: string;
}

export interface PollQuestionRow {
  id: string;
  poll_id: string;
  text: string;
  position: number;
  allow_multiple: boolean;
}

export interface PollOptionRow {
  id: string;
  poll_id: string;
  question_id: string;
  text: string;
}

export interface VoteRow {
  option_id: string;
}

/** Builds vote totals indexed by option identifier. @param votes Persisted vote rows. @returns Vote totals keyed by option identifier. */
export function buildVoteCounts(votes: VoteRow[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const vote of votes) counts.set(vote.option_id, (counts.get(vote.option_id) ?? 0) + 1);
  return counts;
}

/** Maps one persisted survey row. @param row Poll row. @param questions Question rows. @param options Option rows. @param voteCounts Vote totals. @returns Poll model. */
export function mapPollRow(
  row: PollRow,
  questions: PollQuestionRow[],
  options: PollOptionRow[],
  voteCounts: Map<string, number>,
): Poll {
  return {
    ...mapPollFields(row),
    questions: mapPollQuestions(row.id, questions, options, voteCounts),
  };
}

/** Maps persisted scalar poll fields. @param row Persisted poll row. @returns Poll fields excluding questions. */
function mapPollFields(row: PollRow): Omit<Poll, 'questions'> {
  return {
    id: row.id,
    category: row.category,
    title: row.title,
    description: row.description,
    deadline: row.deadline ? new Date(row.deadline) : null,
    status: row.status,
    completionReason: row.completion_reason,
    completedAt: row.completed_at ? new Date(row.completed_at) : null,
    createdAt: new Date(row.created_at),
  };
}

/** Maps complete persisted rows. @param polls Poll rows. @param questions Question rows. @param options Option rows. @param votes Vote rows. @returns Fully mapped polls. */
export function mapPollRows(
  polls: PollRow[],
  questions: PollQuestionRow[],
  options: PollOptionRow[],
  votes: VoteRow[],
): Poll[] {
  const voteCounts = buildVoteCounts(votes);
  return polls.map((poll) => mapPollRow(poll, questions, options, voteCounts));
}

/** Maps questions for one survey. @param pollId Survey id. @param questions Question rows. @param options Option rows. @param voteCounts Vote totals. @returns Question models. */
function mapPollQuestions(
  pollId: string,
  questions: PollQuestionRow[],
  options: PollOptionRow[],
  voteCounts: Map<string, number>,
): PollQuestion[] {
  return questions
    .filter((question) => question.poll_id === pollId)
    .sort((left, right) => left.position - right.position)
    .map((question) => mapPollQuestion(question, options, voteCounts));
}

/** Maps one question row. @param question Question row. @param options Option rows. @param voteCounts Vote totals. @returns Question model. */
function mapPollQuestion(
  question: PollQuestionRow,
  options: PollOptionRow[],
  voteCounts: Map<string, number>,
): PollQuestion {
  return {
    id: question.id,
    text: question.text,
    position: question.position,
    allowMultiple: question.allow_multiple,
    options: mapPollOptions(question.id, options, voteCounts),
  };
}

/** Maps options for one question. @param questionId Question id. @param options Option rows. @param voteCounts Vote totals. @returns Option models. */
function mapPollOptions(
  questionId: string,
  options: PollOptionRow[],
  voteCounts: Map<string, number>,
): PollOption[] {
  return options
    .filter((option) => option.question_id === questionId)
    .map((option) => ({ id: option.id, text: option.text, votes: voteCounts.get(option.id) ?? 0 }));
}
