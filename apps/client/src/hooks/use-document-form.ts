import type { DocumentFormSchema } from '@/schemes/document-form.schema'
import type { Organization } from '@/types/types'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { zod4Resolver } from 'mantine-form-zod-resolver'
import { documentFormSchema } from '@/schemes/document-form.schema'
import { DocumentServiceInstance } from '@/services/document.service'

export function useDocumentForm(type: Organization) {
  const form = useForm<DocumentFormSchema>({
    validate: zod4Resolver(documentFormSchema),
    initialValues: {
      cellsLine: [],
      index: '050010',
      address: 'Улица Гапеева 15/1',
      bank: 'АО БанкЦентрКредит',
      bik: 'KSKSVUSF',
      bin: '000000000000',
      city: 'Караганда',
      clientIdDateFrom: '08.01.2023',
      clientIdNumber: '000000000000',
      clientIdType: 'МВД РК',
      documentDate: ['01.01.2023', '01.02.2023'],
      enumeration: '0001',
      fullnameClient: 'Иванов И.И',
      iik: 'KZ000000000000000000',
      iin: '000000000000',
      organization: 'ООО "Компания"',
      costPerDay: '12000',
    },
  })

  async function handleSubmit(values: DocumentFormSchema) {
    const data = documentFormSchema.parse(values)

    if (type === 'NOMADDOCS') {
      await DocumentServiceInstance.processDocuments(data, 'NOMADDOCS', {
        onSuccess: () => {
          notifications.show({
            message: 'Документы обработаны успешно',
            color: 'green',
          })
        },
      })
    }
    else {
      await DocumentServiceInstance.processDocuments(data, 'XANSHA', {
        onSuccess: () => {
          notifications.show({
            message: 'Документы обработаны успешно',
            color: 'green',
          })
        },
      })
    }
  }

  return { form, handleSubmit }
}
