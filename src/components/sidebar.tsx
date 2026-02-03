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
    <aside className="w-48 h-screen flex flex-col py-6 px-4">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 mb-8">
        <div className="w-7 h-7 rounded-lg glass-inset flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-2" />
        </div>
        <div>
          <div className="font-semibold text-sm text-1">Nex</div>
          <div className="text-[9px] text-3 tracking-wide">Command Center</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5">
        {nav.map(item => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px]
                transition-all duration-150
                ${active 
                  ? 'glass-inset text-1 font-medium' 
                  : 'text-3 hover:text-2 hover:bg-[rgb(var(--glass-inset))]'
                }
              `}
            >
              <item.icon className="w-4 h-4" />
              <span className="flex-1">{item.name}</span>
              {active && <span className="w-1 h-1 rounded-full bg-[rgb(var(--fg))]" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="space-y-1">
        <button
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className="
            w-full flex items-center gap-2.5 px-3 py-2 rounded-xl
            text-[13px] text-3 hover:text-2
            hover:bg-[rgb(var(--glass-inset))] transition-all duration-150
          "
        >
          {resolvedTheme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          <span>Dark Mode</span>
        </button>

        <div className="flex items-center gap-2.5 px-3 py-2">
          <div className="w-6 h-6 rounded-md glass-inset flex items-center justify-center text-[10px] font-bold text-3">
            N
          </div>
          <div>
            <div className="text-[11px] font-medium text-1">Active</div>
            <div className="text-[9px] text-4">Always-on intelligence</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
