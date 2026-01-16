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
      address: '',
      bank: '',
      bik: '',
      bin: '',
      city: '',
      clientIdDateFrom: '',
      clientIdNumber: '',
      clientIdType: '',
      documentDate: [],
      enumeration: '',
      fullnameClient: '',
      iik: '',
      iin: '',
      organization: '',
      costPerDay: '',
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
