'use client'

import { useState } from 'react'
import { Eye, Heart } from 'lucide-react'
import { PostModal, PostData } from './post-modal'

// ─── Icons ───────────────────────────────────────────

const XIcon = ({ className = "w-3 h-3" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const LinkedInIcon = ({ className = "w-3 h-3" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const SubstackIcon = ({ className = "w-3 h-3" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
  </svg>
)

// ─── Design system colors (shared with global palette) ───

const PLATFORMS: Record<string, { icon: typeof XIcon; color: string }> = {
  x:        { icon: XIcon,        color: 'text-zinc-400' },
  linkedin: { icon: LinkedInIcon, color: 'text-[#0A66C2]' },
  substack: { icon: SubstackIcon, color: 'text-[#FF6719]' },
}

function PlatformIcon({ platform, className = "w-3 h-3" }: { platform: string; className?: string }) {
  const cfg = PLATFORMS[platform]
  if (!cfg) return null
  const Icon = cfg.icon
  return <Icon className={`${className} ${cfg.color}`} />
}

// Status colors — aligned with global design system
// green-400 = success/published, amber-400 = warning/pending, zinc = neutral/draft
function sc(status: string) {
  if (status === 'posted') return {
    border: 'border-green-500/30',
    dot: 'bg-green-400',
    text: 'text-green-400',
    bg: 'bg-green-500/10',
  }
  if (status === 'scheduled') return {
    border: 'border-amber-400/30',
    dot: 'bg-amber-400',
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
  }
  return {
    border: 'border-[rgb(var(--glass-border))] border-dashed',
    dot: 'bg-zinc-500',
    text: 'text-zinc-400',
    bg: 'glass-inset',
  }
}

// ─── Shared types ────────────────────────────────────

export interface CalendarPost {
  id: string
  platform: string
  status: 'posted' | 'scheduled' | 'draft'
  text: string
  time: string
  impressions?: number
  likes?: number
  retweets?: number
  repliesCount?: number
  engagementRate?: number
  bookmarks?: number
  feedback?: string | null
  feedbackNote?: string | null
  externalUrl?: string
}

function toModalPost(post: CalendarPost): PostData {
  return {
    ...post,
    externalUrl: post.externalUrl || (post.platform === 'x' && post.status === 'posted'
      ? `https://x.com/sentigen_ai/status/${post.id}` : undefined),
  }
}

// ─── Wheel isolation for columns ─────────────────────

function handleColumnWheel(e: React.WheelEvent<HTMLDivElement>) {
  const el = e.currentTarget
  const { scrollTop, scrollHeight, clientHeight } = el
  const atTop = scrollTop <= 0 && e.deltaY < 0
  const atBottom = scrollTop + clientHeight >= scrollHeight - 1 && e.deltaY > 0
  if (!atTop && !atBottom) e.stopPropagation()
}

// ─── Month View ──────────────────────────────────────

export function MonthViewClient({ date, posts, platform }: { date: string; posts: CalendarPost[]; platform: string }) {
  const [selectedPost, setSelectedPost] = useState<CalendarPost | null>(null)
  const d = new Date(date + 'T12:00:00')
  const year = d.getFullYear()
  const month = d.getMonth()
  const startDow = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: (number | null)[] = []
  for (let i = 0; i < startDow; i++) cells.push(null)
  for (let i = 1; i <= daysInMonth; i++) cells.push(i)

  const postsForDay = (day: number | null) => {
    if (!day) return []
    const ds = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return posts.filter(p => p.time?.startsWith(ds))
  }

  return (
    <>
      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 gap-3 mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center text-[10px] text-4 uppercase tracking-wider font-medium py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-3">
        {cells.map((day, i) => {
          const dayPosts = postsForDay(day)
          const isToday = day && new Date().toDateString() === new Date(year, month, day).toDateString()

          return (
            <div
              key={i}
              className={`rounded-xl min-h-[13vh] lg:min-h-[15vh] p-2 ${
                day
                  ? `glass-inset hover:bg-[rgb(var(--glass-inset-hover))] ${isToday ? 'ring-1 ring-blue-500/30' : ''}`
                  : 'opacity-20'
              }`}
            >
              {day && (
                <>
                  <a
                    href={`/calendar?view=day&date=${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}&platform=${platform}`}
                    className={`text-[11px] font-medium block mb-1.5 ${isToday ? 'text-blue-400' : 'text-3'}`}
                  >
                    {day}
                  </a>
                  <div
                    className="space-y-1 overflow-y-auto overscroll-contain scrollbar-hide"
                    style={{ maxHeight: 'calc(15vh - 28px)' }}
                    onWheel={handleColumnWheel}
                  >
                    {dayPosts.map((post, j) => {
                      const s = sc(post.status)
                      return (
                        <button
                          key={j}
                          onClick={() => setSelectedPost(post)}
                          className={`block w-full text-left text-[9px] leading-tight px-1.5 py-1 rounded-lg border ${s.border} ${s.bg}`}
                        >
                          <span className="flex items-center gap-1">
                            <PlatformIcon platform={post.platform} className="w-2 h-2" />
                            <span className="truncate text-2">{post.text}</span>
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>

      {selectedPost && <PostModal post={toModalPost(selectedPost)} onClose={() => setSelectedPost(null)} />}
    </>
  )
}

// ─── Week View ───────────────────────────────────────

export function WeekViewClient({ date, posts, platform }: { date: string; posts: CalendarPost[]; platform: string }) {
  const [selectedPost, setSelectedPost] = useState<CalendarPost | null>(null)
  const d = new Date(date + 'T12:00:00')
  const start = new Date(d)
  start.setDate(d.getDate() - d.getDay())

  const days = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(start)
    day.setDate(start.getDate() + i)
    return day
  })

  const postsForDay = (day: Date) => {
    const ds = fmt(day)
    return posts
      .filter(p => p.time?.startsWith(ds))
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
  }

  return (
    <>
      <div className="grid grid-cols-7 gap-3">
        {days.map((day, i) => {
          const dayPosts = postsForDay(day)
          const isToday = day.toDateString() === new Date().toDateString()

          return (
            <div key={i} className="relative min-h-[60vh]">
              {/* Sticky day header — frosted glass */}
              <div className="sticky top-0 z-10 pb-2">
                <a
                  href={`/calendar?view=day&date=${fmt(day)}&platform=${platform}`}
                  className="text-center py-2 block backdrop-blur-xl bg-[rgb(var(--glass))]/80 rounded-lg"
                >
                  <div className="text-[10px] text-4 uppercase tracking-wider">
                    {day.toLocaleDateString('en', { weekday: 'short' })}
                  </div>
                  <div className={`text-sm font-semibold mt-0.5 ${isToday ? 'text-blue-400' : 'text-1'}`}>
                    {day.getDate()}
                  </div>
                  {dayPosts.length > 0 && (
                    <div className="text-[9px] text-3 mt-0.5">{dayPosts.length} post{dayPosts.length !== 1 ? 's' : ''}</div>
                  )}
                </a>
              </div>

              {/* Posts — isolated scroll per column */}
              <div
                className="space-y-1.5 overflow-y-auto overscroll-contain scrollbar-hide"
                style={{ maxHeight: 'calc(60vh - 70px)' }}
                onWheel={handleColumnWheel}
              >
                {dayPosts.map((post, j) => {
                  const time = new Date(post.time).toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit' })
                  const s = sc(post.status)

                  return (
                    <button
                      key={j}
                      onClick={() => setSelectedPost(post)}
                      className={`block w-full text-left p-2 rounded-lg text-[10px] border ${s.border} ${s.bg}`}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <PlatformIcon platform={post.platform} className="w-2.5 h-2.5" />
                        <span className="text-4 tabular-nums">{time}</span>
                        {post.feedback === 'approved' && <span className="ml-auto text-green-400 text-[8px]">✓</span>}
                        {post.feedback === 'rejected' && <span className="ml-auto text-rose-400 text-[8px]">✗</span>}
                      </div>
                      <p className="text-2 line-clamp-2 leading-relaxed">{post.text}</p>
                      {post.status === 'posted' && ((post.likes ?? 0) > 0 || (post.impressions ?? 0) > 0) && (
                        <div className="flex items-center gap-2 mt-1.5">
                          {(post.impressions ?? 0) > 0 && <span className="text-3 flex items-center gap-0.5"><Eye className="w-2.5 h-2.5" />{post.impressions}</span>}
                          {(post.likes ?? 0) > 0 && <span className="text-rose-400 flex items-center gap-0.5"><Heart className="w-2.5 h-2.5" />{post.likes}</span>}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {selectedPost && <PostModal post={toModalPost(selectedPost)} onClose={() => setSelectedPost(null)} />}
    </>
  )
}

// ─── Day View ────────────────────────────────────────

export function DayViewClient({ date, posts, platform }: { date: string; posts: CalendarPost[]; platform: string }) {
  const [selectedPost, setSelectedPost] = useState<CalendarPost | null>(null)
  const d = new Date(date + 'T12:00:00')
  const ds = fmt(d)
  const dayPosts = posts
    .filter(p => p.time?.startsWith(ds))
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())

  const blocks = [
    { label: 'Morning', range: '6am – 12pm', filter: (h: number) => h >= 6 && h < 12 },
    { label: 'Afternoon', range: '12pm – 6pm', filter: (h: number) => h >= 12 && h < 18 },
    { label: 'Evening', range: '6pm – 12am', filter: (h: number) => h >= 18 && h < 24 },
    { label: 'Night', range: '12am – 6am', filter: (h: number) => h >= 0 && h < 6 },
  ]

  return (
    <>
      <div className="text-sm text-3">{dayPosts.length} posts</div>

      <div className="space-y-6">
        {blocks.map(({ label, range, filter }) => {
          const blockPosts = dayPosts.filter(p => filter(new Date(p.time).getHours()))
          if (blockPosts.length === 0 && dayPosts.length > 0) return null

          return (
            <div key={label}>
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-[13px] font-medium text-2">{label}</h3>
                <span className="text-[10px] text-4">{range}</span>
                <div className="flex-1 h-px bg-[rgb(var(--glass-border))]" />
                {blockPosts.length > 0 && <span className="text-[10px] text-4">{blockPosts.length}</span>}
              </div>

              {blockPosts.length === 0 ? (
                <div className="glass-inset rounded-xl p-4 text-center text-[11px] text-4">No posts</div>
              ) : (
                <div className="space-y-2">
                  {blockPosts.map((post, i) => {
                    const time = new Date(post.time).toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit' })
                    const s = sc(post.status)

                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedPost(post)}
                        className="flex gap-4 w-full text-left glass-inset rounded-xl p-4 hover:bg-[rgb(var(--glass-inset-hover))] group"
                      >
                        <div className="w-14 flex-shrink-0 text-right pt-0.5">
                          <span className="text-[12px] text-3 tabular-nums">{time}</span>
                        </div>
                        <div className="flex flex-col items-center flex-shrink-0 pt-1.5">
                          <div className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <PlatformIcon platform={post.platform} className="w-3.5 h-3.5" />
                            <span className={`text-[10px] font-medium ${s.text}`}>
                              {post.status === 'posted' ? 'Published' : post.status === 'scheduled' ? 'Scheduled' : 'Draft'}
                            </span>
                            {post.feedback === 'approved' && <span className="text-[9px] text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded-full">👍</span>}
                            {post.feedback === 'rejected' && <span className="text-[9px] text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded-full">👎</span>}
                          </div>
                          <p className="text-[13px] text-1 leading-relaxed line-clamp-3">{post.text}</p>
                          {post.status === 'posted' && ((post.impressions ?? 0) > 0 || (post.likes ?? 0) > 0) && (
                            <div className="flex items-center gap-3 mt-2">
                              {(post.impressions ?? 0) > 0 && <span className="text-[10px] text-3 flex items-center gap-1"><Eye className="w-3 h-3" /> {post.impressions!.toLocaleString()}</span>}
                              {(post.likes ?? 0) > 0 && <span className="text-[10px] text-rose-400 flex items-center gap-1"><Heart className="w-3 h-3" /> {post.likes}</span>}
                              {(post.engagementRate ?? 0) > 0 && <span className={`text-[10px] tabular-nums ml-auto ${post.engagementRate! > 1 ? 'text-green-400' : 'text-3'}`}>{post.engagementRate}% ER</span>}
                            </div>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {selectedPost && <PostModal post={toModalPost(selectedPost)} onClose={() => setSelectedPost(null)} />}
    </>
  )
}

// ─── Utilities ───────────────────────────────────────

function fmt(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
