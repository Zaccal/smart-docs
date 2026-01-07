import type { MantineColorsTuple } from '@mantine/core'
import { createTheme } from '@mantine/core'

const mainColors: MantineColorsTuple = [
  '#ffeaec',
  '#fcd4d7',
  '#f4a7ac',
  '#ec777e',
  '#e64f57',
  '#e3353f',
  '#e22732',
  '#c91a25',
  '#b41220',
  '#9e0419',
]

export const theme = createTheme({
  colors: {
    mainColors,
  },
  primaryColor: 'mainColors',
})
