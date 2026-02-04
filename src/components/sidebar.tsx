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
  Moon,
  Sun,
  Lightbulb,
  MessageSquare,
  Bot,
  Zap,
  Activity,
  DollarSign,
} from 'lucide-react'
import { useTheme } from './theme-provider'

const XIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const nav = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard },
      { name: 'Activity', href: '/activity', icon: Activity },
    ],
  },
  {
    label: 'X / Twitter',
    items: [
      { name: 'Posts', href: '/x', icon: XIcon },
      { name: 'Engagement', href: '/engagement', icon: MessageSquare },
      { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Content',
    items: [
      { name: 'Ideas', href: '/ideas', icon: Lightbulb },
      { name: 'Strategy', href: '/strategy', icon: Target },
      { name: 'Calendar', href: '/calendar', icon: Calendar },
      { name: 'Research', href: '/research', icon: Search },
    ],
  },
  {
    label: 'System',
    items: [
      { name: 'Automation', href: '/automation', icon: Bot },
      { name: 'Costs', href: '/costs', icon: DollarSign },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <aside className="w-52 h-screen flex flex-col py-5 px-3 border-r border-[rgb(var(--glass-border))] overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 mb-6">
        <div className="w-8 h-8 rounded-xl glass-inset flex items-center justify-center">
          <Zap className="w-4 h-4 text-2" />
        </div>
        <div>
          <div className="font-semibold text-sm text-1">Nex</div>
          <div className="text-[10px] text-4 tracking-wide">Control Center</div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 space-y-5">
        {nav.map((group) => (
          <div key={group.label}>
            <div className="px-3 mb-1.5">
              <span className="text-[10px] font-medium text-4 uppercase tracking-wider">
                {group.label}
              </span>
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      group flex items-center gap-3 px-3 py-2 rounded-xl text-[13px]
                      transition-all duration-150
                      ${active
                        ? 'glass-inset text-1'
                        : 'text-3 hover:text-2 hover:bg-[rgb(var(--glass-inset))]'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium">{item.name}</span>
                    {active && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--fg))] ml-auto" />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="space-y-1 pt-4 border-t border-[rgb(var(--glass-border))]">
        <Link
          href="/settings"
          className={`
            flex items-center gap-3 px-3 py-2 rounded-xl text-[13px]
            transition-all duration-150
            ${pathname === '/settings'
              ? 'glass-inset text-1'
              : 'text-3 hover:text-2 hover:bg-[rgb(var(--glass-inset))]'
            }
          `}
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </Link>

        <button
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className="
            w-full flex items-center gap-3 px-3 py-2 rounded-xl
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
