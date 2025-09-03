export function splitNames(raw: string): string[] {
  return (raw ?? '')
    .split(/,|\band\b/gi)
    .map((s) => s.trim())
    .filter(Boolean)
}
