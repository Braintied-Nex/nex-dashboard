'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Target, 
  Search,
  FileText, 
  Calendar, 
  BarChart3,
  Settings,
  Sparkles,
  Moon,
  Sun
} from 'lucide-react'
import { useTheme } from './theme-provider'

const nav = [
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

  return (
    <aside className="w-52 h-screen flex flex-col glass border-r-0 rounded-none rounded-r-3xl">
      {/* Logo */}
      <div className="px-5 py-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl glass-inset flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-secondary" />
        </div>
        <div>
          <div className="font-semibold text-sm text-primary">Nex</div>
          <div className="text-[10px] text-tertiary">Command Center</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {nav.map(item => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium
                transition-all duration-150
                ${active 
                  ? 'glass-inset text-primary' 
                  : 'text-secondary hover:text-primary hover:bg-[rgb(var(--inset-bg))]'
                }
              `}
            >
              <item.icon className="w-4 h-4" />
              <span className="flex-1">{item.name}</span>
              {active && <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--fg))]" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-5 space-y-2">
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className="
            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
            text-[13px] text-secondary hover:text-primary
            hover:bg-[rgb(var(--inset-bg))] transition-all duration-150
          "
        >
          {resolvedTheme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          <span>{resolvedTheme === 'dark' ? 'Dark' : 'Light'} Mode</span>
        </button>

        {/* Status */}
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-7 h-7 rounded-lg glass-inset flex items-center justify-center text-[11px] font-bold text-secondary">
            N
          </div>
          <div>
            <div className="text-[12px] font-medium text-primary">Active</div>
            <div className="text-[10px] text-tertiary">Always-on intelligence</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
