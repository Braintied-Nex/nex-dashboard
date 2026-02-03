import { createClient } from '@/lib/supabase/server'
import { 
  Sparkles,
  Settings,
  Users,
  Building2,
  FileText,
  Twitter,
  Linkedin,
  MessageSquare,
  BookOpen,
  ArrowRight,
  CheckCircle,
  Circle
} from 'lucide-react'
import Link from 'next/link'

const platformIcons: Record<string, React.ReactNode> = {
  'X/Twitter': <Twitter className="h-4 w-4" />,
  'LinkedIn': <Linkedin className="h-4 w-4" />,
  'Reddit': <MessageSquare className="h-4 w-4" />,
  'Substack': <BookOpen className="h-4 w-4" />,
}

const contentTypeIcons: Record<string, React.ReactNode> = {
  'thread': <Twitter className="h-4 w-4" />,
  'carousel': <Linkedin className="h-4 w-4" />,
  'ama': <MessageSquare className="h-4 w-4" />,
  'demo': <Twitter className="h-4 w-4" />,
  'case_study': <Linkedin className="h-4 w-4" />,
  'post': <FileText className="h-4 w-4" />,
}

const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default async function Dashboard() {
  const supabase = await createClient()
  
  const [
    { data: platforms },
    { data: scheduledPosts },
    { data: thoughtLeaders },
    { data: competitors },
  ] = await Promise.all([
    supabase.from('nex_platforms').select('*'),
    supabase.from('nex_posts').select('*, platform:nex_platforms(*)').order('scheduled_for', { ascending: true }).limit(10),
    supabase.from('nex_thought_leaders').select('*'),
    supabase.from('nex_competitors').select('*'),
  ])

  const readyPlatforms = platforms?.filter(p => p.api_enabled).length || 0
  const totalPlatforms = platforms?.length || 0
  const postsThisWeek = scheduledPosts?.filter(p => p.status === 'scheduled' || p.status === 'draft').length || 0

  // Group posts by day
  const postsByDay: Record<number, typeof scheduledPosts> = {}
  scheduledPosts?.forEach(post => {
    if (post.scheduled_for) {
      const day = new Date(post.scheduled_for).getDay()
      const adjustedDay = day === 0 ? 6 : day - 1 // Convert to Mon=0
      if (!postsByDay[adjustedDay]) postsByDay[adjustedDay] = []
      postsByDay[adjustedDay]?.push(post)
    }
  })

  return (
    <div className="min-h-screen p-8 animate-fade-in">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="space-y-1">
          <p className="text-xs font-medium text-[rgb(var(--fg-muted))] flex items-center gap-1.5">
            <Sparkles className="h-3 w-3" />
            Command Center
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Welcome back, Galen</h1>
          <p className="text-sm text-[rgb(var(--fg-muted))]">
            This week's strategy is ready. Review before I start posting.
          </p>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { 
              label: 'Platforms Connected', 
              value: readyPlatforms, 
              sublabel: `${readyPlatforms}/${totalPlatforms} Ready`,
              icon: Settings 
            },
            { 
              label: 'Thought Leaders', 
              value: thoughtLeaders?.length || 0, 
              sublabel: 'Tracking',
              icon: Users 
            },
            { 
              label: 'Competitors', 
              value: competitors?.length || 0, 
              sublabel: 'Monitoring',
              icon: Building2 
            },
            { 
              label: 'Posts Planned', 
              value: postsThisWeek, 
              sublabel: 'This Week',
              icon: FileText 
            },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="h-9 w-9 rounded-xl bg-[rgb(var(--surface-inset))] flex items-center justify-center">
                  <stat.icon className="h-4 w-4 text-[rgb(var(--fg-muted))]" />
                </div>
                <span className="text-[10px] text-[rgb(var(--fg-subtle))]">{stat.sublabel}</span>
              </div>
              <p className="text-2xl font-semibold tracking-tight">{stat.value}</p>
              <p className="text-xs text-[rgb(var(--fg-muted))] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-5">
          
          {/* This Week's Content - Takes 2 columns */}
          <div className="col-span-2 glass-card">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[rgb(var(--border-subtle))]">
              <h2 className="text-sm font-semibold">This Week's Content</h2>
              <Link href="/calendar" className="text-xs text-[rgb(var(--fg-muted))] hover:text-[rgb(var(--fg))] flex items-center gap-1">
                Full Calendar <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="p-4 space-y-1">
              {dayLabels.slice(0, 5).map((day, index) => {
                const posts = postsByDay[index] || []
                const post = posts[0]
                
                return (
                  <div 
                    key={day} 
                    className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-[rgb(var(--surface-inset))] transition-colors"
                  >
                    <span className="text-xs text-[rgb(var(--fg-subtle))] w-8">{day}</span>
                    
                    {post ? (
                      <>
                        <div className="h-8 w-8 rounded-lg bg-[rgb(var(--surface-inset))] flex items-center justify-center">
                          {contentTypeIcons[post.metadata?.type] || <FileText className="h-4 w-4 text-[rgb(var(--fg-muted))]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{post.title || post.content?.slice(0, 50)}</p>
                          <p className="text-[10px] text-[rgb(var(--fg-subtle))] capitalize">{post.metadata?.type || 'Post'}</p>
                        </div>
                        <span className={`text-[10px] px-2.5 py-1 rounded-full ${
                          post.status === 'scheduled' 
                            ? 'bg-[rgb(var(--fg))]/10 text-[rgb(var(--fg-muted))]' 
                            : post.status === 'draft'
                            ? 'bg-[rgb(var(--fg))]/5 text-[rgb(var(--fg-subtle))]'
                            : 'bg-[rgb(var(--fg))]/5 text-[rgb(var(--fg-subtle))]'
                        }`}>
                          {post.status}
                        </span>
                      </>
                    ) : (
                      <p className="text-xs text-[rgb(var(--fg-subtle))]">No content scheduled</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Platforms */}
          <div className="glass-card">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-[rgb(var(--border-subtle))]">
              <Settings className="h-4 w-4 text-[rgb(var(--fg-muted))]" />
              <h2 className="text-sm font-semibold">Platforms</h2>
            </div>
            <div className="p-4 space-y-1">
              {platforms?.map((platform) => (
                <div 
                  key={platform.id} 
                  className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[rgb(var(--surface-inset))] transition-colors"
                >
                  <div className="h-8 w-8 rounded-lg bg-[rgb(var(--surface-inset))] flex items-center justify-center">
                    {platformIcons[platform.name] || <Settings className="h-4 w-4 text-[rgb(var(--fg-muted))]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{platform.name}</p>
                    <p className="text-[10px] text-[rgb(var(--fg-subtle))]">
                      {platform.handle || (platform.api_enabled ? 'via Ayrshare' : 'Setup needed')}
                    </p>
                  </div>
                  {platform.api_enabled ? (
                    <CheckCircle className="h-4 w-4 text-[rgb(var(--fg-muted))]" />
                  ) : (
                    <Circle className="h-4 w-4 text-[rgb(var(--fg-subtle))]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Research Insights */}
        <div className="glass-card">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[rgb(var(--border-subtle))]">
            <h2 className="text-sm font-semibold">Research Insights</h2>
            <Link href="/research" className="text-xs text-[rgb(var(--fg-muted))] hover:text-[rgb(var(--fg))] flex items-center gap-1">
              All Research <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[rgb(var(--fg-muted))]" />
                  <span className="text-xs text-[rgb(var(--fg-muted))]">Thought Leaders</span>
                </div>
                <p className="text-xl font-semibold">{thoughtLeaders?.length || 0}</p>
                <p className="text-[10px] text-[rgb(var(--fg-subtle))]">Tracked for content inspiration</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[rgb(var(--fg-muted))]" />
                  <span className="text-xs text-[rgb(var(--fg-muted))]">Competitors</span>
                </div>
                <p className="text-xl font-semibold">{competitors?.length || 0}</p>
                <p className="text-[10px] text-[rgb(var(--fg-subtle))]">Monitored for positioning</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[rgb(var(--fg-muted))]" />
                  <span className="text-xs text-[rgb(var(--fg-muted))]">Patterns</span>
                </div>
                <p className="text-xl font-semibold">13</p>
                <p className="text-[10px] text-[rgb(var(--fg-subtle))]">Content patterns learned</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
