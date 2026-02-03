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
  Sparkles,
  Moon,
  Sun,
  Search
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from './theme-provider'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Strategy', href: '/strategy', icon: Target },
  { name: 'Research', href: '/research', icon: Search },
  { name: 'Posts', href: '/posts', icon: FileText },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="flex h-screen w-56 flex-col glass">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgb(var(--fg))]/10">
          <Sparkles className="h-4 w-4 text-[rgb(var(--fg))]" />
        </div>
        <div>
          <span className="text-base font-semibold">Nex</span>
          <span className="text-[10px] text-[rgb(var(--fg-muted))] block">Command Center</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-3 py-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium',
                'transition-all duration-150',
                isActive
                  ? 'glass-inset text-[rgb(var(--fg))]'
                  : 'text-[rgb(var(--fg-muted))] hover:text-[rgb(var(--fg))] hover:bg-[rgb(var(--surface-inset))]'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
              {isActive && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-[rgb(var(--fg))]" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 space-y-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={cn(
            'flex items-center gap-3 w-full rounded-xl px-3 py-2.5',
            'text-[13px] text-[rgb(var(--fg-muted))]',
            'hover:bg-[rgb(var(--surface-inset))] hover:text-[rgb(var(--fg))]',
            'transition-all duration-150'
          )}
        >
          {resolvedTheme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          <span>{resolvedTheme === 'dark' ? 'Dark' : 'Light'} Mode</span>
        </button>

        {/* Status */}
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[rgb(var(--fg))]/5 text-[rgb(var(--fg-muted))] text-xs font-bold">
            N
          </div>
          <div>
            <p className="text-[12px] font-medium text-[rgb(var(--fg))]">Active</p>
            <p className="text-[10px] text-[rgb(var(--fg-subtle))]">Always-on intelligence</p>
          </div>
        </div>
      </div>
    </div>
  )
}
