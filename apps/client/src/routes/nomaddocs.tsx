import { createFileRoute } from '@tanstack/react-router'
import DocumentForm from '@/components/document-form/document-form'
import Header from '@/components/header/header'

export const Route = createFileRoute('/nomaddocs')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Header />
      <DocumentForm type="NOMADDOCS" />
    </>
  )
}
