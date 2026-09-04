import { Poll, PollCategory, PollOption } from '../models/poll.model';

export interface PollRow {
  id: string;
  category: PollCategory;
  title: string;
  question: string;
  description: string | null;
  deadline: string | null;
  created_at: string;
}

export interface PollOptionRow {
  id: string;
  poll_id: string;
  text: string;
}

export interface VoteRow {
  option_id: string;
}

/**
 * Builds vote totals indexed by option identifier.
 *
 * @param votes Persisted vote rows.
 * @returns Vote totals keyed by option identifier.
 */
export function buildVoteCounts(votes: VoteRow[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const vote of votes) {
    counts.set(vote.option_id, (counts.get(vote.option_id) ?? 0) + 1);
  }
  return counts;
}

/**
 * Maps one database poll row to the application model.
 *
 * @param row Persisted poll row.
 * @param options Options that belong to the poll.
 * @param voteCounts Vote totals keyed by option identifier.
 * @returns Application poll model.
 */
export function mapPollRow(
  row: PollRow,
  options: PollOptionRow[],
  voteCounts: Map<string, number>,
): Poll {
  return {
    ...mapPollFields(row),
    options: mapPollOptions(row.id, options, voteCounts),
  };
}

/**
 * Maps persisted scalar poll fields to the application model.
 * @param row Persisted poll row.
 * @returns Poll model fields excluding options.
 */
function mapPollFields(row: PollRow): Omit<Poll, 'options'> {
  return {
    id: row.id,
    category: row.category,
    title: row.title,
    question: row.question,
    description: row.description,
    deadline: row.deadline ? new Date(row.deadline) : null,
    createdAt: new Date(row.created_at),
  };
}

/**
 * Maps all persisted poll rows to application models.
 *
 * @param polls Persisted poll rows.
 * @param options Persisted option rows.
 * @param votes Persisted vote rows.
 * @returns Fully mapped polls including vote totals.
 */
export function mapPollRows(polls: PollRow[], options: PollOptionRow[], votes: VoteRow[]): Poll[] {
  const voteCounts = buildVoteCounts(votes);
  return polls.map((poll) => mapPollRow(poll, options, voteCounts));
}

/**
 * Maps the options that belong to one poll.
 *
 * @param pollId Poll identifier.
 * @param options Persisted option rows.
 * @param voteCounts Vote totals keyed by option identifier.
 * @returns Application option models for the requested poll.
 */
function mapPollOptions(
  pollId: string,
  options: PollOptionRow[],
  voteCounts: Map<string, number>,
): PollOption[] {
  return options
    .filter((option) => option.poll_id === pollId)
    .map((option) => mapPollOption(option, voteCounts));
}

/**
 * Maps one persisted option row to the application model.
 *
 * @param option Persisted option row.
 * @param voteCounts Vote totals keyed by option identifier.
 * @returns Application option model.
 */
function mapPollOption(option: PollOptionRow, voteCounts: Map<string, number>): PollOption {
  return {
    id: option.id,
    text: option.text,
    votes: voteCounts.get(option.id) ?? 0,
  };
}
