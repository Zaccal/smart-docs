import type { DynamicKeyValueSchema } from '@/schemes/dynamic-key-value.schema'

const Routes = {
  SetOptionsInvoice: '/invoice/set-options-invoice',
} as const

export const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api`

export async function PostSetAdditionalOptionsInvoice(file: File, options: DynamicKeyValueSchema) {
  const formData = new FormData()
  formData.append('file', file)

  formData.append('options', JSON.stringify(options))

  return fetch(`${API_URL}${Routes.SetOptionsInvoice}`, {
    method: 'POST',
    body: formData,
  })
}
