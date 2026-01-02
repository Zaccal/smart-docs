/**
 * Общие утилиты для схем:
 * - isDigits: проверяет, что строка состоит только из цифр
 * - toTitleCase: приводит каждое слово к виду "Первое"
 * - parseDateString: безопасно парсит строку в Date или возвращает undefined
 */

export function isDigits(value: string, length?: number) {
  if (typeof value !== 'string')
    return false
  const re = length ? new RegExp(`^\\d{${length}}$`) : /^\d+$/
  return re.test(value)
}

export function toTitleCase(input: string) {
  return input
    .trim()
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}
