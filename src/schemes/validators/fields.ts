import z from 'zod/v4'
import { isDigits, toTitleCase } from './common'

export const enumerationSchema = z
  .string()
  .trim()
  .refine(val => isDigits(val) && val.length === 4, { message: 'Номер должен состоять ровно из 4 цифр, например 0486' })
  .transform(val => `№${val}`)

export const fullnameClientSchema = z
  .string()
  .trim()
  .regex(/^\p{L}+\s+\p{L}\.?\p{L}\.?(?:\s+\p{L}+\s+\p{L}\.?\p{L}\.?)*$/u, {
    message: 'Ожидается один или несколько записей в формате "Имя И.И", например: "Иван И.И" или "Иван И.И Алексей В.А"',
  })
  .transform((value) => {
    const isDotEnd = value.endsWith('.')
    if (isDotEnd)
      return value
    return `${value}.`
  })

export const organizationSchema = z
  .string()
  .trim()
  .min(2, { message: 'Введите корректное название организации' })

export const clientIdNumberSchema = z
  .string()
  .trim()
  .refine(val => isDigits(val) && val.length >= 6 && val.length <= 12, {
    message: 'Номер должен содержать только цифры (6–12 символов)',
  })

export const clientIdDateFromSchema = z.string()

export const clientIdTypeSchema = z.string().default('МВД РК')

export const totalAmountSchema = z.string()

export const documentDateSchema = z.array(z.string()).length(2, { message: 'Выберите период документа' })

export const binSchema = z.string().trim().refine(val => isDigits(val) && (val.length === 12 || val.length === 0), {
  message: 'БИН должен состоять из 12 цифр',
})

export const iinSchema = z.string().trim().refine(val => isDigits(val) && val.length === 12, { message: 'ИИН должен состоять из 12 цифр' })

export const addressSchema = z.string().trim().min(5, { message: 'Введите корректный адрес' })

export const citySchema = z.string()
  .trim()
  .min(2, { message: 'Введите название города' })
  .regex(/^[\p{L}\d\-\s.]+$/u, { message: 'Название города содержит недопустимые символы' })
  .transform((val) => {
    const cleaned = val.replace(/^г\.?\s*/i, '').trim()
    const normalized = toTitleCase(cleaned)
    return `г.${normalized}`
  })

export const iikSchema = z.string().trim().refine(val => isDigits(val) && val.length === 20, { message: 'ИИК должен состоять из 20 цифр' })

export const bikSchema = z.string().trim().refine(val => isDigits(val) && val.length === 8, { message: 'БИК должен состоять из 8 цифр' })

export const bankNameSchema = z.string().trim().min(5, { message: 'Введите корректное название банка' })
