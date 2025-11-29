import type { Organization } from '@/types/types'
import {
  Box,
  Button,
  Fieldset,
  Grid,
  Stack,
  Textarea,
  TextInput,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { IconNumber } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { useDocumentForm } from '@/hooks/use-document-form'
import { THREE_COL, TWO_COL } from '@/lib/constants'
import { countPerAmount } from '@/lib/utils'
import 'dayjs/locale/ru'

dayjs.locale('ru')

interface DocumentFormProps {
  type: Organization
}

export default function DocumentForm({ type }: DocumentFormProps) {
  const { form, handleSubmit } = useDocumentForm(type)
  const isCountble = form.values.totalAmount && form.values.documentDate

  return (
    <Box component="div" mx="auto" className="mt-10 max-w-4xl md:px-0 px-2  pb-12">
      <h1 className="mb-4 text-xl font-black text-center">
        {type === 'XANSHA' ? 'ИП "XANSHA"' : 'ИП "NOMADDOCS"'}
      </h1>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        {/* просто вертикальный стек секций */}
        <Stack gap="lg">
          {/* DOCUMENT INFO */}
          <Fieldset legend="Информация о документе">
            <Grid gutter="md">
              <Grid.Col {...TWO_COL}>
                <TextInput
                  leftSection={<IconNumber />}
                  variant="filled"
                  size="lg"
                  {...form.getInputProps('enumeration')}
                  key={form.key('enumeration')}
                  label="Номер документа"
                  placeholder="0001"
                  required
                />
              </Grid.Col>

              <Grid.Col {...TWO_COL}>
                <DatePickerInput
                  size="lg"
                  type="range"
                  variant="filled"
                  key={form.key('documentDate')}
                  {...form.getInputProps('documentDate')}
                  placeholder="Введите дату"
                  valueFormat="«DD» MMMM YYYYг"
                  locale="ru"
                  label="Дата проживания"
                  required
                />
              </Grid.Col>
            </Grid>
          </Fieldset>

          {/* CLIENT INFO */}
          <Fieldset legend="Информация о организации и клиенте">
            <Grid gutter="md" mb="md">
              <Grid.Col {...TWO_COL}>
                <TextInput
                  variant="filled"
                  size="lg"
                  {...form.getInputProps('fullnameClient')}
                  key={form.key('fullnameClient')}
                  label="ФИО Клиента"
                  placeholder="Киренбаев.А.Б"
                  required
                />
              </Grid.Col>

              <Grid.Col {...TWO_COL}>
                <TextInput
                  variant="filled"
                  size="lg"
                  {...form.getInputProps('address')}
                  key={form.key('address')}
                  label="Адрес организации"
                  placeholder="пр. Туран 55"
                  required
                />
              </Grid.Col>
            </Grid>
            <Grid>
              <Grid.Col {...TWO_COL}>
                <TextInput
                  variant="filled"
                  size="lg"
                  {...form.getInputProps('city')}
                  key={form.key('city')}
                  label="Город"
                  placeholder="Нур-Султан"
                  required
                />
              </Grid.Col>
              <Grid.Col {...TWO_COL}>
                <TextInput
                  variant="filled"
                  size="lg"
                  {...form.getInputProps('bin')}
                  key={form.key('bin')}
                  label="БИН организации"
                  className="mb-4"
                  placeholder="000340001234"
                  required
                />
              </Grid.Col>
            </Grid>
            <Grid>
              <Grid.Col {...THREE_COL}>
                <TextInput
                  variant="filled"
                  size="lg"
                  {...form.getInputProps('iik')}
                  key={form.key('iik')}
                  label="ИИК организации"
                  className="mb-4"
                  placeholder="KZ338562203117660575"
                  required
                />
              </Grid.Col>
              <Grid.Col {...THREE_COL}>
                <TextInput
                  variant="filled"
                  size="lg"
                  {...form.getInputProps('bank')}
                  key={form.key('bank')}
                  label="Банк организации"
                  className="mb-4"
                  placeholder='АО "БанкЦентрКредит"'
                  required
                />
              </Grid.Col>
              <Grid.Col {...THREE_COL}>
                <TextInput
                  variant="filled"
                  size="lg"
                  {...form.getInputProps('bik')}
                  key={form.key('bik')}
                  label="БИК организации"
                  className="mb-4"
                  placeholder="KCJBKZKX"
                  required
                />
              </Grid.Col>
            </Grid>

            <Textarea
              variant="filled"
              size="lg"
              {...form.getInputProps('organization')}
              key={form.key('organization')}
              label="Организация"
              placeholder="Министерство цифрового развития РК"
              required
            />
          </Fieldset>

          {/* ID INFO */}
          <Fieldset legend="Удостоверение личности">
            <Grid gutter="md" mb="md">
              <Grid.Col {...TWO_COL}>
                <TextInput
                  variant="filled"
                  leftSection={<IconNumber />}
                  size="lg"
                  {...form.getInputProps('clientIdNumber')}
                  key={form.key('clientIdNumber')}
                  label="Номер УД"
                  placeholder="000111000111"
                  required
                />
              </Grid.Col>

              <Grid.Col {...TWO_COL}>
                <TextInput
                  variant="filled"
                  size="lg"
                  {...form.getInputProps('clientIdType')}
                  key={form.key('clientIdType')}
                  label="Тип УД"
                  placeholder="МВД РК"
                  required
                />
              </Grid.Col>
            </Grid>

            <Grid gutter="md">
              <Grid.Col {...TWO_COL}>
                <DatePickerInput
                  size="lg"
                  variant="filled"
                  key={form.key('clientIdDateFrom')}
                  {...form.getInputProps('clientIdDateFrom')}
                  placeholder="Введите дату"
                  locale="ru"
                  valueFormat="DD.MM.YYYY"
                  label="Дата выдачи"
                  required
                />
              </Grid.Col>

              <Grid.Col {...TWO_COL}>
                <TextInput
                  variant="filled"
                  size="lg"
                  {...form.getInputProps('iin')}
                  key={form.key('iin')}
                  label="ИИН"
                  placeholder="000340001234"
                  required
                />
              </Grid.Col>
            </Grid>
          </Fieldset>

          {/* ADDITIONAL INFO */}
          <Fieldset legend="Дополнительно">
            <Grid gutter="md">
              <Grid.Col {...TWO_COL}>
                <TextInput
                  variant="filled"
                  size="lg"
                  {...form.getInputProps('totalAmount')}
                  key={form.key('totalAmount')}
                  label="Общая сумма"
                  placeholder="31 000"
                  required
                />
              </Grid.Col>
              <Grid.Col {...TWO_COL}>
                <p className="text-lg -mt-1">За день проживания</p>
                <div className="border mt-1 border-gray-200 px-4 py-2.5 rounded-md">
                  <span className="text-lg text-gray-500">
                    {isCountble ? countPerAmount(Number(form.values.totalAmount), form.values.documentDate) : '0'}
                    {' '}
                    тенге
                  </span>
                </div>
              </Grid.Col>
            </Grid>
          </Fieldset>

          <Button fullWidth size="lg" type="submit">
            Сделать документы
          </Button>
        </Stack>
      </form>
    </Box>
  )
}
