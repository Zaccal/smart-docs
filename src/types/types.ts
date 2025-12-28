import type { DynamicKeyValueSchema } from '@/schemes/dynamic-key-value.schema'

export type Organization = 'NOMADDOCS' | 'XANSHA'
export type DocumentType = 'CONTRACT' | 'INVOICE' | 'ACT' | 'CASH_RECEIPT'

export interface FillDynamicRowsOptions {
  templateRow: number
  insertFromRow: number
  textColumn?: number
  items: DynamicKeyValueSchema
}
