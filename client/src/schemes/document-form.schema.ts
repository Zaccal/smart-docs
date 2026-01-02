import z from 'zod/v4'
import { dynamicKeyValueSchema } from './dynamic-key-value.schema'
import {
  addressSchema,
  bankNameSchema,
  bikSchema,
  binSchema,
  citySchema,
  clientIdDateFromSchema,
  clientIdNumberSchema,
  clientIdTypeSchema,
  costPerDaySchema,
  documentDateSchema,
  enumerationSchema,
  fullnameClientSchema,
  iikSchema,
  iinSchema,
  organizationSchema,
} from './validators/fields'

export const documentFormSchema = z.object({
  enumeration: enumerationSchema,
  fullnameClient: fullnameClientSchema,
  organization: organizationSchema,
  clientIdNumber: clientIdNumberSchema,
  clientIdDateFrom: clientIdDateFromSchema,
  clientIdType: clientIdTypeSchema,
  costPerDay: costPerDaySchema,
  documentDate: documentDateSchema,
  bin: binSchema,
  iin: iinSchema,
  address: addressSchema,
  city: citySchema,
  iik: iikSchema,
  bik: bikSchema,
  bank: bankNameSchema,
  cellsLine: dynamicKeyValueSchema,
})

export type DocumentFormSchema = z.infer<typeof documentFormSchema>
