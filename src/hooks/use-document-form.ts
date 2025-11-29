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
  })

  function handleSubmit(values: DocumentFormSchema) {
    notifications.show({
      title: 'Форма успешно отправлена',
      message: 'Ваш документ в процессе обработки',
      color: 'green',
    })

    const data = documentFormSchema.parse(values)

    if (type === 'NOMADDOCS')
      DocumentServiceInstance.processDocuments(data, 'NOMADDOCS')
    else
      DocumentServiceInstance.processDocuments(data, 'XANSHA')
  }

  return { form, handleSubmit }
}
