// Centralized animation / timing constants to keep UI latency low and consistent.
// Adjust these to globally tweak game feel & performance without hunting scattered numbers.

// Duration of a piece jump animation (seconds) – shorter feels more responsive especially on Android.
export const PIECE_JUMP_DURATION_S = 0.7; // previously 1.0s
export const PIECE_JUMP_DURATION_MS = PIECE_JUMP_DURATION_S * 1000;

// Extra think time for bot after its move animation completes (ms). Keep small so Android isn't sluggish.
export const BOT_THINK_TIME_MS = 250; // previously effectively 2000ms total wait

// Delay after player's simple move before switching to bot (ms) if no jump animation pending.
export const PLAYER_TURN_SWITCH_BASE_DELAY_MS = 80; // near-immediate, small buffer for state flush

// Slack added when waiting for animation completion (ms) to ensure last frame rendered.
export const ANIMATION_SLACK_MS = 40;
