/**
 * Filters polls by category while supporting the unfiltered All state.
 *
 * @param polls Polls to filter.
 * @param category Selected category filter.
 * @returns Polls matching the selected category.
 */
export function filterPollsByCategory(polls, category) {
    if (category === 'All') {
        return polls;
    }
    return polls.filter((poll) => poll.category === category);
}
/**
 * Sorts polls by deadline, placing polls without deadlines last.
 *
 * @param polls Polls to sort.
 * @returns New array ordered by earliest deadline first.
 */
export function sortPollsByDeadline(polls) {
    return [...polls].sort(comparePollDeadlines);
}
/**
 * Filters active polls to those ending within the configured time window.
 *
 * @param polls Active polls to inspect.
 * @param now Current timestamp in milliseconds.
 * @param windowMs Ending-soon window in milliseconds.
 * @returns Polls whose deadline falls inside the time window.
 */
export function filterEndingSoonPolls(polls, now, windowMs) {
    const limit = now + windowMs;
    return polls.filter((poll) => isDeadlineWithinWindow(poll, now, limit));
}
/**
 * Compares two polls according to the deadline sorting rules.
 * @param a First survey.
 * @param b Second survey.
 * @returns Sort comparison value.
 */
function comparePollDeadlines(a, b) {
    if (a.deadline === null && b.deadline === null) {
        return b.createdAt.getTime() - a.createdAt.getTime();
    }
    if (a.deadline === null) {
        return 1;
    }
    if (b.deadline === null) {
        return -1;
    }
    return a.deadline.getTime() - b.deadline.getTime();
}
/**
 * Checks whether a poll deadline is inside the supplied time range.
 * @param poll Survey to inspect.
 * @param now Exclusive lower timestamp boundary.
 * @param limit Inclusive upper timestamp boundary.
 * @returns Whether the deadline is within the range.
 */
function isDeadlineWithinWindow(poll, now, limit) {
    const deadline = poll.deadline?.getTime();
    return deadline !== undefined && deadline > now && deadline <= limit;
}
