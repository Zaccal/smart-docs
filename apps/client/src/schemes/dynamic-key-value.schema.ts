import z from 'zod/v4'

export const dynamicKeyValueSchema
  = z.array(z.object({
    label: z.string().nonempty('Label can not be empty'),
    value: z.string().nonempty('Value can not be empty'),
  }))

export type DynamicKeyValueSchema = z.infer<typeof dynamicKeyValueSchema>
