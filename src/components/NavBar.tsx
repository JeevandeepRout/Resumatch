import Link from 'next/link'
import { Button } from './ui/button'

export function NavBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-bold flex items-center space-x-2">
          <span className="font-bold text-xl tracking-tight">ResumeAI</span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/dashboard" className="text-sm font-medium hover:underline underline-offset-4">
            Dashboard
          </Link>
          <Link href="/login">
            <Button variant="ghost" size="sm">Log in</Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Sign up</Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
