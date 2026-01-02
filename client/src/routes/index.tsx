import { Button } from '@mantine/core'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="mx-auto mt-12 w-fit space-y-4">
      <h1 className="text-2xl font-bold uppercase text-center">Выберите ИП</h1>
      <div className="flex items-center gap-5">
        <Link to="/xansha">
          <Button variant="outline" size="lg">
            ИП "XANSHA"
          </Button>
        </Link>
        <Link to="/nomaddocs">
          <Button variant="outline" size="lg">
            ИП "NOMADDOCS"
          </Button>
        </Link>
      </div>
    </div>
  )
}
