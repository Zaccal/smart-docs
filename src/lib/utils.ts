import type { CellRichTextValue, CellValue } from 'exceljs'
import type { DocumentType } from '@/types/types'
import { HUNDREDS, ONES, ONES_FEMALE, TEENS, TENS } from './constants'

export function countPerAmount(amount: number, dateRange: string[]): number {
  const startDate = new Date(dateRange[0])
  const endDate = new Date(dateRange[1])

  const timeDiff = endDate.getTime() - startDate.getTime()
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
  return Math.floor(amount / daysDiff)
}

export function formatWithSpacesNumber(amount: number | string): string {
  const str = amount.toString().replace(/\s+/g, '')
  return str.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

function convertBelow1000(num: number, female: boolean = false): string {
  const words: string[] = []

  const h = Math.floor(num / 100)
  const t = Math.floor((num % 100) / 10)
  const o = num % 10

  if (h > 0)
    words.push(HUNDREDS[h])

  if (t === 1) {
    words.push(TEENS[o])
  }
  else {
    if (t > 1)
      words.push(TENS[t])
    if (o > 0)
      words.push(female ? ONES_FEMALE[o] : ONES[o])
  }

  return words.join(' ').trim()
}

export function formatNumberToRussian(n: number): string {
  if (n === 0)
    return 'ноль'

  const thousands = Math.floor(n / 1000)
  const rest = n % 1000

  const result: string[] = []

  if (thousands > 0) {
    result.push(convertBelow1000(thousands, true))

    const last = thousands % 10
    const lastTwo = thousands % 100

    if (lastTwo >= 11 && lastTwo <= 19) {
      result.push('тысяч')
    }
    else if (last === 1) {
      result.push('тысяча')
    }
    else if (last >= 2 && last <= 4) {
      result.push('тысячи')
    }
    else {
      result.push('тысяч')
    }
  }

  if (rest > 0) {
    result.push(convertBelow1000(rest))
  }

  return capitalizeFirst(result.join(' ').trim())
}

export function capitalizeFirst(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function documentNaming(documentType: DocumentType | 'ALL', fullnameClient: string) {
  switch (documentType) {
    case 'CONTRACT':
      return `Договор_${fullnameClient.replaceAll(' ', '_')}.docx`
    case 'INVOICE':
      return `Счет_${fullnameClient.replaceAll(' ', '_')}.xlsx`
    case 'ACT':
      return `АКТы_выполненых_работ_${fullnameClient.replaceAll(' ', '_')}.xlsx`
    case 'CASH_RECEIPT':
      return `Приходный_кассовый_ордер_${fullnameClient.replaceAll(' ', '_')}.xlsx`
    default:
      return `Документы_${fullnameClient.replaceAll(' ', '_')}.zip`
  }
}

export function isRichTextValue(value: CellValue): value is CellRichTextValue {
  return typeof value === 'object' && value !== null && 'richText' in value
}
