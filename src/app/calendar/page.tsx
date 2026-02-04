import { createAdminClient } from '@/lib/supabase/admin'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MonthViewClient, WeekViewClient, DayViewClient, CalendarPost } from './calendar-client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type ViewMode = 'day' | 'week' | 'month'
type Platform = 'all' | 'x' | 'linkedin' | 'substack'

interface Props {
  searchParams: Promise<{ view?: string; date?: string; platform?: string }>
}

// ─── Icons (for pills) ──────────────────────────────

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

const PLATFORM_PILLS = {
  x:        { icon: XIcon,        color: 'text-zinc-400',   label: 'X' },
  linkedin: { icon: LinkedInIcon, color: 'text-[#0A66C2]',  label: 'LinkedIn' },
  substack: { icon: SubstackIcon, color: 'text-[#FF6719]',  label: 'Substack' },
}

const PLATFORM_IDS: Record<string, 'x' | 'linkedin' | 'substack'> = {
  '9d0d9c90-b053-4746-a783-96b0fcc4edac': 'x',
  '7da01258-53d2-4ebb-8ca3-01cfeef987be': 'linkedin',
  '93f6be38-683d-4fef-81bd-9fba6de08edf': 'substack',
}

function resolveStatus(status: string): 'posted' | 'scheduled' | 'draft' {
  if (status === 'published') return 'posted'
  if (status === 'scheduled') return 'scheduled'
  return 'draft'
}

// ─── Page ────────────────────────────────────────────

export default async function CalendarPage({ searchParams }: Props) {
  const params = await searchParams
  const view = (params.view || 'week') as ViewMode
  const platform = (params.platform || 'all') as Platform
  const dateParam = params.date || new Date().toISOString().split('T')[0]
  const currentDate = new Date(dateParam + 'T12:00:00')

  const sb = createAdminClient()

  const [{ data: contentPosts }, { data: actualPosts }] = await Promise.all([
    sb.from('nex_posts')
      .select('*')
      .in('status', ['scheduled', 'draft', 'published'])
      .order('scheduled_for', { ascending: true }),
    sb.from('nex_x_post_metrics')
      .select('*')
      .neq('tweet_type', 'reply')
      .order('created_at', { ascending: false })
      .limit(500),
  ])

  // Normalize
  const allPosts: CalendarPost[] = [
    ...(actualPosts || []).map((p: any) => ({
      id: p.tweet_id,
      platform: 'x' as const,
      status: 'posted' as const,
      text: p.tweet_text || '',
      time: p.created_at,
      impressions: p.impressions,
      likes: p.likes,
      retweets: p.retweets,
      repliesCount: p.replies,
      engagementRate: p.engagement_rate,
      bookmarks: p.bookmarks,
      feedback: p.feedback,
      feedbackNote: p.feedback_note,
      externalUrl: `https://x.com/sentigen_ai/status/${p.tweet_id}`,
    })),
    ...(contentPosts || []).map((p: any) => ({
      id: p.id,
      platform: PLATFORM_IDS[p.platform_id] || 'x',
      status: resolveStatus(p.status),
      text: p.content || p.title || '',
      time: p.scheduled_for || p.created_at,
      feedback: p.feedback,
      feedbackNote: p.feedback_note,
    })),
  ]

  const counts = {
    all: allPosts.length,
    x: allPosts.filter(p => p.platform === 'x').length,
    linkedin: allPosts.filter(p => p.platform === 'linkedin').length,
    substack: allPosts.filter(p => p.platform === 'substack').length,
  }

  const posts = platform === 'all' ? allPosts : allPosts.filter(p => p.platform === platform)
  const postedCount = posts.filter(p => p.status === 'posted').length
  const pendingCount = posts.filter(p => p.status !== 'posted').length

  // Nav helpers
  const prev = new Date(currentDate)
  const next = new Date(currentDate)
  if (view === 'day') { prev.setDate(currentDate.getDate() - 1); next.setDate(currentDate.getDate() + 1) }
  else if (view === 'week') { prev.setDate(currentDate.getDate() - 7); next.setDate(currentDate.getDate() + 7) }
  else { prev.setMonth(currentDate.getMonth() - 1); next.setMonth(currentDate.getMonth() + 1) }

  const navQ = (d: Date) => `/calendar?view=${view}&date=${fmt(d)}&platform=${platform}`
  const viewQ = (v: string) => `/calendar?view=${v}&date=${dateParam}&platform=${platform}`
  const platQ = (p: string) => `/calendar?view=${view}&date=${dateParam}&platform=${p}`

  // View title
  let viewTitle = ''
  if (view === 'month') {
    viewTitle = currentDate.toLocaleDateString('en', { month: 'long', year: 'numeric' })
  } else if (view === 'week') {
    const start = new Date(currentDate)
    start.setDate(currentDate.getDate() - currentDate.getDay())
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    viewTitle = `${start.toLocaleDateString('en', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}`
  } else {
    viewTitle = currentDate.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-5">

        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-semibold tracking-tight text-1">Calendar</h1>
            <p className="text-2 text-sm mt-1">{postedCount} published · {pendingCount} pending</p>
          </div>
          <div className="flex items-center gap-1 glass-panel p-1">
            {(['day', 'week', 'month'] as const).map(v => (
              <a
                key={v}
                href={viewQ(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                  view === v ? 'bg-[rgb(var(--fg))] text-[rgb(var(--bg))]' : 'text-3 hover:text-2'
                }`}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </a>
            ))}
          </div>
        </header>

        {/* Platform filters + legend */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a href={platQ('all')} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium ${platform === 'all' ? 'bg-[rgb(var(--fg))] text-[rgb(var(--bg))]' : 'glass-inset text-3 hover:text-2'}`}>
              All <span className={platform === 'all' ? 'opacity-70' : 'text-4'}>{counts.all}</span>
            </a>
            {(Object.entries(PLATFORM_PILLS) as [string, typeof PLATFORM_PILLS.x][]).map(([key, cfg]) => {
              const Icon = cfg.icon
              const active = platform === key
              return (
                <a key={key} href={platQ(key)} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium ${active ? 'bg-[rgb(var(--fg))] text-[rgb(var(--bg))]' : 'glass-inset text-3 hover:text-2'}`}>
                  <Icon className={`w-3 h-3 ${active ? '' : cfg.color}`} />
                  {cfg.label}
                  <span className={active ? 'opacity-70' : 'text-4'}>{counts[key as keyof typeof counts]}</span>
                </a>
              )
            })}
          </div>
          <div className="flex items-center gap-4 text-[11px] text-3">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" /> Published</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /> Scheduled</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-zinc-500" /> Draft</span>
          </div>
        </div>

        {/* Calendar panel */}
        <div className="glass-panel p-5 space-y-4">
          {/* Sub-header: title + nav */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-1">{viewTitle}</h2>
            <div className="flex gap-2">
              <a href={navQ(prev)} className="glass-inset p-2 rounded-lg"><ChevronLeft className="w-4 h-4 text-3" /></a>
              <a href={navQ(new Date())} className="glass-inset px-3 py-2 rounded-lg text-xs text-3 hover:text-2">Today</a>
              <a href={navQ(next)} className="glass-inset p-2 rounded-lg"><ChevronRight className="w-4 h-4 text-3" /></a>
            </div>
          </div>

          {/* Views */}
          {view === 'month' && <MonthViewClient date={dateParam} posts={posts} platform={platform} />}
          {view === 'week' && <WeekViewClient date={dateParam} posts={posts} platform={platform} />}
          {view === 'day' && <DayViewClient date={dateParam} posts={posts} platform={platform} />}
        </div>
      </div>
    </div>
  )
}

function fmt(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
