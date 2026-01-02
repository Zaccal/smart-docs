import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import * as React from 'react'
import { theme } from '../lib/theme'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/notifications/styles.css'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <MantineProvider theme={theme}>
      <React.Fragment>
        <Outlet />
        <TanStackRouterDevtools />
        <Notifications color="red" />
      </React.Fragment>
    </MantineProvider>
  )
}
