'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  Target, 
  BarChart3,
  Settings,
  Zap,
  Moon,
  Sun,
  Monitor
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from './theme-provider'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Posts', href: '/posts', icon: FileText },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Strategy', href: '/strategy', icon: Target },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const cycleTheme = () => {
    const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system']
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor

  return (
    <div className="flex h-screen w-64 flex-col glass border-r border-[rgb(var(--border))]">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-[rgb(var(--border))]">
        <div className="flex h-9 w-9 items-center justify-center rounded-[--radius-lg] bg-[rgb(var(--accent))]">
          <Zap className="h-5 w-5 text-[rgb(var(--accent-fg))]" />
        </div>
        <div>
          <span className="text-lg font-bold">Nex</span>
          <span className="text-xs text-[rgb(var(--muted-fg))] block">Command Center</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-[--radius-lg] px-3 py-2.5 text-sm font-medium',
                'transition-colors duration-[--duration-fast]',
                isActive
                  ? 'bg-[rgb(var(--accent))] text-[rgb(var(--accent-fg))]'
                  : 'text-[rgb(var(--muted-fg))] hover:bg-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-[rgb(var(--border))] p-4 space-y-4">
        {/* Theme Toggle */}
        <button
          onClick={cycleTheme}
          className={cn(
            'flex items-center gap-3 w-full rounded-[--radius-lg] px-3 py-2',
            'text-sm text-[rgb(var(--muted-fg))]',
            'hover:bg-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]',
            'transition-colors duration-[--duration-fast]'
          )}
        >
          <ThemeIcon className="h-5 w-5" />
          <span className="capitalize">{theme} Mode</span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 px-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[rgb(var(--accent))] to-orange-500" />
          <div>
            <p className="text-sm font-medium">Nex</p>
            <p className="text-xs text-[rgb(var(--muted-fg))]">AI Co-founder</p>
          </div>
        </div>
      </div>
    </div>
  )
}
