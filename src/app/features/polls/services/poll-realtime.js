const REALTIME_TABLES = ['polls', 'poll_options', 'votes'];
const REALTIME_CHANNEL_NAME = 'poll-app-live-updates';
/**
 * Subscribes to every database table that contributes to the survey state.
 * @param client Supabase client used to create the channel.
 * @param onChange Callback invoked after a persisted survey-state change.
 * @returns Subscribed realtime channel.
 */
export function subscribeToPollChanges(client, onChange) {
    const channel = client.channel(REALTIME_CHANNEL_NAME);
    for (const table of REALTIME_TABLES) {
        registerTable(channel, table, onChange);
    }
    return channel.subscribe();
}
/**
 * Registers one survey table on a realtime channel.
 * @param channel Realtime channel receiving the registration.
 * @param table Database table to observe.
 * @param onChange Callback invoked after a table change.
 */
function registerTable(channel, table, onChange) {
    channel.on('postgres_changes', { event: '*', schema: 'public', table }, onChange);
}
