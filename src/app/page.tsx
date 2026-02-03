import { createClient } from '@/lib/supabase/server'
import type { Post, Platform } from '@/lib/supabase/types'
import { 
  Sparkles,
  Users,
  Building2,
  FileText,
  ArrowRight,
  CheckCircle,
  Circle,
  Clock,
  Calendar,
  TrendingUp,
  Zap
} from 'lucide-react'
import Link from 'next/link'

// Platform icons
const PlatformIcon = ({ name, className = "h-4 w-4" }: { name: string; className?: string }) => {
  const icons: Record<string, React.ReactNode> = {
    'X/Twitter': (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    'LinkedIn': (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    'Reddit': (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0z"/>
      </svg>
    ),
    'Substack': (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
      </svg>
    ),
  }
  return <>{icons[name] || <FileText className={className} />}</>
}

type PostWithRelations = Post & { platform?: Platform | null }

export default async function Dashboard() {
  const supabase = await createClient()
  
  const [
    { data: platforms },
    { data: posts },
    { data: thoughtLeaders },
    { data: competitors },
    { data: ideas },
  ] = await Promise.all([
    supabase.from('nex_platforms').select('*'),
    supabase.from('nex_posts').select('*, platform:nex_platforms(*)').order('scheduled_for', { ascending: true }).limit(20),
    supabase.from('nex_thought_leaders').select('*'),
    supabase.from('nex_competitors').select('*'),
    supabase.from('nex_content_ideas').select('*').eq('status', 'captured').limit(5),
  ]) as [
    { data: Platform[] | null },
    { data: PostWithRelations[] | null },
    { data: any[] | null },
    { data: any[] | null },
    { data: any[] | null },
  ]

  // Compute intelligent insights
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

  const scheduledPosts = posts?.filter(p => p.status === 'scheduled') || []
  const draftPosts = posts?.filter(p => p.status === 'draft' || p.status === 'idea') || []
  const publishedPosts = posts?.filter(p => p.status === 'published') || []

  const todayPosts = scheduledPosts.filter(p => {
    if (!p.scheduled_for) return false
    const d = new Date(p.scheduled_for)
    return d >= today && d < tomorrow
  })

  const thisWeekPosts = scheduledPosts.filter(p => {
    if (!p.scheduled_for) return false
    const d = new Date(p.scheduled_for)
    return d >= today && d < nextWeek
  })

  // Get greeting based on time
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  // Determine the primary action/insight
  const getInsight = () => {
    if (todayPosts.length > 0) {
      return {
        message: `${todayPosts.length} post${todayPosts.length > 1 ? 's' : ''} scheduled for today`,
        type: 'action' as const
      }
    }
    if (draftPosts.length > 0) {
      return {
        message: `${draftPosts.length} draft${draftPosts.length > 1 ? 's' : ''} ready to polish`,
        type: 'suggestion' as const
      }
    }
    if (ideas && ideas.length > 0) {
      return {
        message: `${ideas.length} new idea${ideas.length > 1 ? 's' : ''} to explore`,
        type: 'info' as const
      }
    }
    return {
      message: 'Ready when you are',
      type: 'neutral' as const
    }
  }

  const insight = getInsight()

  // Next 5 days content preview
  const next5Days = []
  for (let i = 0; i < 5; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    const dayPosts = scheduledPosts.filter(p => p.scheduled_for?.startsWith(dateStr))
    next5Days.push({ 
      date, 
      posts: dayPosts,
      dayName: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : date.toLocaleDateString('en', { weekday: 'short' })
    })
  }

  return (
    <div className="min-h-screen p-8 animate-in">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <header>
          <div className="flex items-center gap-1.5 text-3 text-xs mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Command Center
          </div>
          <h1 className="text-[32px] font-semibold tracking-tight text-1">
            {greeting}, Galen
          </h1>
          <p className="text-2 text-[15px] mt-2">
            {insight.message}
          </p>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard 
            icon={Calendar}
            value={thisWeekPosts.length}
            label="This Week"
            sublabel="scheduled"
          />
          <StatCard 
            icon={FileText}
            value={draftPosts.length}
            label="Drafts"
            sublabel="in progress"
          />
          <StatCard 
            icon={Users}
            value={thoughtLeaders?.length || 0}
            label="Leaders"
            sublabel="tracking"
          />
          <StatCard 
            icon={Building2}
            value={competitors?.length || 0}
            label="Competitors"
            sublabel="monitoring"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Content Timeline - Takes 2 columns */}
          <div className="lg:col-span-2 glass-panel">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[rgb(var(--glass-border))]">
              <h2 className="text-[15px] font-medium text-1">This Week</h2>
              <Link href="/posts" className="text-xs text-3 hover:text-2 flex items-center gap-1 transition-colors">
                All Posts <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="p-4">
              {next5Days.map(({ date, posts: dayPosts, dayName }, idx) => (
                <div 
                  key={idx}
                  className={`flex gap-4 py-3 ${idx < next5Days.length - 1 ? 'border-b border-[rgb(var(--glass-border))]' : ''}`}
                >
                  <div className={`
                    w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0
                    ${idx === 0 ? 'bg-[rgb(var(--fg))] text-[rgb(var(--bg))]' : 'glass-inset text-2'}
                  `}>
                    <span className="text-[10px] uppercase font-medium">{dayName}</span>
                    <span className="text-sm font-semibold">{date.getDate()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    {dayPosts.length > 0 ? (
                      <div className="space-y-2">
                        {dayPosts.map(post => (
                          <div 
                            key={post.id}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl glass-inset"
                          >
                            <div className="w-8 h-8 rounded-lg glass-inset flex items-center justify-center flex-shrink-0">
                              {post.platform && <PlatformIcon name={post.platform.name} className="w-3.5 h-3.5 text-3" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] text-1 truncate">{post.content}</p>
                              <p className="text-[10px] text-4">
                                {post.scheduled_for && new Date(post.scheduled_for).toLocaleTimeString('en', { 
                                  hour: 'numeric', 
                                  minute: '2-digit' 
                                })}
                              </p>
                            </div>
                            <span className="text-[10px] px-2 py-1 rounded-full bg-blue-500/15 text-blue-400">
                              scheduled
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex items-center">
                        <p className="text-sm text-4">No posts scheduled</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Platforms */}
            <div className="glass-panel">
              <div className="flex items-center gap-2 px-6 py-4 border-b border-[rgb(var(--glass-border))]">
                <Zap className="w-4 h-4 text-3" />
                <h2 className="text-[14px] font-medium text-1">Platforms</h2>
              </div>
              <div className="p-3 space-y-1">
                {platforms?.map((platform) => (
                  <div 
                    key={platform.id}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl glass-inset"
                  >
                    <div className="w-9 h-9 rounded-xl glass-inset flex items-center justify-center">
                      <PlatformIcon name={platform.name} className="w-4 h-4 text-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] text-1">{platform.name}</div>
                      <div className="text-[10px] text-4">
                        {platform.handle || (platform.api_enabled ? 'Connected' : 'Setup needed')}
                      </div>
                    </div>
                    {platform.api_enabled ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-4" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-panel p-4">
              <h3 className="text-[13px] font-medium text-2 mb-3 px-2">Quick Actions</h3>
              <div className="space-y-1">
                <Link 
                  href="/posts"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[rgb(var(--glass-inset))] transition-colors text-3 hover:text-1"
                >
                  <FileText className="w-4 h-4" />
                  <span className="text-[13px]">Create Post</span>
                </Link>
                <Link 
                  href="/ideas"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[rgb(var(--glass-inset))] transition-colors text-3 hover:text-1"
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="text-[13px]">Browse Ideas</span>
                </Link>
                <Link 
                  href="/research"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[rgb(var(--glass-inset))] transition-colors text-3 hover:text-1"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-[13px]">View Research</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

function StatCard({ 
  icon: Icon, 
  value, 
  label, 
  sublabel 
}: { 
  icon: any
  value: number
  label: string
  sublabel: string
}) {
  return (
    <div className="glass-panel p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl glass-inset flex items-center justify-center">
          <Icon className="w-4 h-4 text-3" />
        </div>
        <span className="text-[10px] text-4 uppercase tracking-wide">{sublabel}</span>
      </div>
      <div className="text-[28px] font-semibold text-1 tracking-tight">{value}</div>
      <div className="text-[12px] text-3 mt-0.5">{label}</div>
    </div>
  )
}
