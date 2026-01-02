import type { UseFormReturnType } from '@mantine/form'
import type { DocumentFormSchema } from '@/schemes/document-form.schema'
import { Button, Fieldset, Grid, Group, TextInput } from '@mantine/core'
import { IconPlus, IconTrash } from '@tabler/icons-react'

interface DynamicKeyValueBlockProps {
  form: UseFormReturnType<DocumentFormSchema>
}

function DynamicKeyValueBlock({ form }: DynamicKeyValueBlockProps) {
  return (
    <Fieldset legend="Дополнительная информация счет.фактуры">
      {form.values.cellsLine.map((_, index) => (
        <Grid
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          gutter="sm"
          align="center"
          mt="xs"
        >
          <Grid.Col span={5}>
            <TextInput
              size="lg"
              placeholder="Ключ"
              {...form.getInputProps(`cellsLine.${index}.label`)}
            />
          </Grid.Col>
          <Grid.Col span={5}>
            <TextInput
              size="lg"
              placeholder="Значение"
              {...form.getInputProps(`cellsLine.${index}.value`)}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <Button
              fullWidth
              type="button"
              size="lg"
              color="red"
              onClick={() => form.removeListItem('cellsLine', index)}
            >
              <IconTrash size={24} />
            </Button>
          </Grid.Col>
        </Grid>
      ))}
      <Group mt="md">
        <Button
          leftSection={<IconPlus size={20} />}
          type="button"
          size="lg"
          fullWidth
          variant="outline"
          onClick={() => form.insertListItem('cellsLine', { label: '', value: '' })}
        >
          Добавить строку
        </Button>
      </Group>
    </Fieldset>
  )
}

export default DynamicKeyValueBlock
