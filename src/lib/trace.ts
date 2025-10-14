function hex(n: number) {
  return [...crypto.getRandomValues(new Uint8Array(n))]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/** W3C traceparent: version 00, sampled=01 */
export function createTraceparent(): string {
  const traceId = hex(16) // 16 bytes = 32 hex chars
  const parentId = hex(8) // 8 bytes = 16 hex chars
  const flags = '01'
  return `00-${traceId}-${parentId}-${flags}`
}

/**
 * Extracts trace ID from W3C traceparent header
 * Format: 00-<trace-id>-<parent-id>-<flags>
 */
export function extractTraceId(traceparent: string): string | null {
  const parts = traceparent.split('-')
  return parts.length >= 2 ? parts[1] : null
}
