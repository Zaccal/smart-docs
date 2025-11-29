import z from 'zod/v4'
import {
  addressSchema,
  bankNameSchema,
  bikSchema,
  binSchema,
  citySchema,
  clientIdDateFromSchema,
  clientIdNumberSchema,
  clientIdTypeSchema,
  documentDateSchema,
  enumerationSchema,
  fullnameClientSchema,
  iikSchema,
  iinSchema,
  organizationSchema,
  totalAmountSchema,
} from './validators/fields'

export const documentFormSchema = z.object({
  enumeration: enumerationSchema,
  fullnameClient: fullnameClientSchema,
  organization: organizationSchema,
  clientIdNumber: clientIdNumberSchema,
  clientIdDateFrom: clientIdDateFromSchema,
  clientIdType: clientIdTypeSchema,
  totalAmount: totalAmountSchema,
  documentDate: documentDateSchema,
  bin: binSchema,
  iin: iinSchema,
  address: addressSchema,
  city: citySchema,
  iik: iikSchema,
  bik: bikSchema,
  bank: bankNameSchema,
})

export type DocumentFormSchema = z.infer<typeof documentFormSchema>
