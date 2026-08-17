const SENSITIVE = /password|hash|pepper|token|cookie|authorization|schema.?name|full.?name|email/i;

export function redact(value: unknown, seen: WeakSet<object> = new WeakSet()): unknown {
  if (Array.isArray(value)) return value.map(item => redact(item, seen));
  if (value && typeof value === 'object') {
    if (seen.has(value)) return '[CIRCULAR]';
    seen.add(value);
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, SENSITIVE.test(key) ? '[REDACTED]' : redact(item, seen)]));
  }
  return value;
}
