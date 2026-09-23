/**
 * Parses a duration string like "15m", "7d", "3600" (seconds) into seconds.
 * Supported suffixes: s (seconds), m (minutes), h (hours), d (days), w (weeks).
 */
export function parseExpiryToSeconds(value: string): number {
  const match = /^(\d+)(s|m|h|d|w)?$/.exec(value.trim());
  if (!match) return 900; // fallback: 15 minutes
  const amount = parseInt(match[1], 10);
  const unit = match[2] || 's';
  const multipliers: Record<string, number> = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
    w: 604800,
  };
  return amount * multipliers[unit];
}
