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
  Monitor,
  Search,
  Lightbulb,
  MessageCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from './theme-provider'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Strategy', href: '/strategy', icon: Target },
  { name: 'Research', href: '/research', icon: Search },
  { name: 'Ideas', href: '/ideas', icon: Lightbulb },
  { name: 'Posts', href: '/posts', icon: FileText },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Engagement', href: '/engagement', icon: MessageCircle },
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
    <div className="flex h-screen w-72 flex-col glass">
      {/* Logo */}
      <div className="flex h-20 items-center gap-4 px-8">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[rgb(var(--accent))] to-[rgb(var(--accent))]/70 shadow-lg shadow-[rgb(var(--accent))]/20">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <div>
          <span className="text-xl font-semibold tracking-tight">Nex</span>
          <span className="text-xs text-[rgb(var(--fg-muted))] block tracking-wide">Command Center</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium',
                'transition-all duration-200 ease-out',
                isActive
                  ? 'bg-[rgb(var(--surface-raised))] text-[rgb(var(--fg))] shadow-sm'
                  : 'text-[rgb(var(--fg-muted))] hover:bg-[rgb(var(--surface))]/50 hover:text-[rgb(var(--fg))]'
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-colors",
                isActive && "text-[rgb(var(--accent))]"
              )} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-6 space-y-4">
        {/* Theme Toggle */}
        <button
          onClick={cycleTheme}
          className={cn(
            'flex items-center gap-3 w-full rounded-2xl px-4 py-3',
            'text-sm text-[rgb(var(--fg-muted))]',
            'hover:bg-[rgb(var(--surface))]/50 hover:text-[rgb(var(--fg))]',
            'transition-all duration-200 ease-out'
          )}
        >
          <ThemeIcon className="h-5 w-5" />
          <span className="capitalize">{theme}</span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-4 px-4 py-2">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[rgb(var(--accent))] to-blue-600 shadow-lg shadow-[rgb(var(--accent))]/20" />
          <div>
            <p className="text-sm font-medium">Nex</p>
            <p className="text-xs text-[rgb(var(--fg-muted))]">AI Co-founder</p>
          </div>
        </div>
      </div>
    </div>
  )
}
