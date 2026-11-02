export function isTileSelected(
  configuration: Record<string, string[]>,
  key: string | undefined,
  value: string[] | undefined,
): boolean {
  if (!key || !Array.isArray(value) || value.length === 0) {
    return false
  }

  const current = configuration[key]
  if (!current) {
    return false
  }

  return value.every((item) => current.includes(item))
}
