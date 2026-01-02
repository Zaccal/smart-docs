import { ThemeIcon } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header className="border-b py-4 border-b-gray-200">
      <div className="container">
        <Link to="/" className="flex items-center gap-2">
          <ThemeIcon size="lg" variant="outline">
            <IconArrowLeft />
          </ThemeIcon>
          <span>Назад</span>
        </Link>
      </div>
    </header>
  )
}
