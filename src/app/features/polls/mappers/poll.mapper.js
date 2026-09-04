/**
 * Builds vote totals indexed by option identifier.
 *
 * @param votes Persisted vote rows.
 * @returns Vote totals keyed by option identifier.
 */
export function buildVoteCounts(votes) {
    const counts = new Map();
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
export function mapPollRow(row, options, voteCounts) {
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
function mapPollFields(row) {
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
export function mapPollRows(polls, options, votes) {
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
function mapPollOptions(pollId, options, voteCounts) {
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
function mapPollOption(option, voteCounts) {
    return {
        id: option.id,
        text: option.text,
        votes: voteCounts.get(option.id) ?? 0,
    };
}
