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
  Sun,
  Lightbulb,
  MessageSquare
} from 'lucide-react'
import { useTheme } from './theme-provider'

const nav = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: LayoutDashboard,
    description: 'Overview'
  },
  { 
    name: 'Strategy', 
    href: '/strategy', 
    icon: Target,
    description: 'Goals & Planning'
  },
  { 
    name: 'Research', 
    href: '/research', 
    icon: Search,
    description: 'Insights'
  },
  { 
    name: 'Ideas', 
    href: '/ideas', 
    icon: Lightbulb,
    description: 'Content Pipeline'
  },
  { 
    name: 'Posts', 
    href: '/posts', 
    icon: FileText,
    description: 'Timeline'
  },
  { 
    name: 'Calendar', 
    href: '/calendar', 
    icon: Calendar,
    description: 'Schedule'
  },
  { 
    name: 'Engagement', 
    href: '/engagement', 
    icon: MessageSquare,
    description: 'Replies & DMs'
  },
  { 
    name: 'Analytics', 
    href: '/analytics', 
    icon: BarChart3,
    description: 'Performance'
  },
]

const bottomNav = [
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <aside className="w-52 h-screen flex flex-col py-6 px-3 border-r border-[rgb(var(--glass-border))]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 mb-8">
        <div className="w-8 h-8 rounded-xl glass-inset flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-2" />
        </div>
        <div>
          <div className="font-semibold text-sm text-1">Nex</div>
          <div className="text-[10px] text-4 tracking-wide">Command Center</div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 space-y-1">
        {nav.map(item => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px]
                transition-all duration-150
                ${active 
                  ? 'glass-inset text-1' 
                  : 'text-3 hover:text-2 hover:bg-[rgb(var(--glass-inset))]'
                }
              `}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="font-medium">{item.name}</span>
              </div>
              {active && (
                <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--fg))]" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="space-y-1 pt-4 border-t border-[rgb(var(--glass-border))]">
        {bottomNav.map(item => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px]
                transition-all duration-150
                ${active 
                  ? 'glass-inset text-1' 
                  : 'text-3 hover:text-2 hover:bg-[rgb(var(--glass-inset))]'
                }
              `}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
            </Link>
          )
        })}
        
        <button
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className="
            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
            text-[13px] text-3 hover:text-2
            hover:bg-[rgb(var(--glass-inset))] transition-all duration-150
          "
        >
          {resolvedTheme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          <span>{resolvedTheme === 'dark' ? 'Dark' : 'Light'} Mode</span>
        </button>

        {/* Status indicator */}
        <div className="flex items-center gap-3 px-3 py-3 mt-2">
          <div className="relative">
            <div className="w-7 h-7 rounded-lg glass-inset flex items-center justify-center text-[11px] font-bold text-2">
              N
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[rgb(var(--bg))]" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-1">Online</div>
            <div className="text-[10px] text-4">Always-on</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
