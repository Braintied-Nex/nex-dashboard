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
  'X/Twitter': <Twitter className="w-4 h-4" />,
  'LinkedIn': <Linkedin className="w-4 h-4" />,
  'Reddit': <MessageSquare className="w-4 h-4" />,
  'Substack': <BookOpen className="w-4 h-4" />,
}

export default async function Dashboard() {
  const supabase = await createClient()
  
  const [
    { data: platforms },
    { data: posts },
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
  const postsThisWeek = posts?.length || 0

  // Sample content for the week
  const weekContent = [
    { day: 'Mon', title: 'Why AI Chief of Staff > AI Assistant', type: 'Thread', status: 'ready', icon: Twitter },
    { day: 'Tue', title: '5 Tasks Sentigen Handles Proactively', type: 'Carousel', status: 'ready', icon: Linkedin },
    { day: 'Wed', title: 'Building AI for Execs - r/artificial', type: 'AMA', status: 'draft', icon: MessageSquare },
    { day: 'Thu', title: '30-sec inbox triage video', type: 'Demo', status: 'draft', icon: Twitter },
    { day: 'Fri', title: 'How Sentigen saves 2hrs/day', type: 'Case Study', status: 'idea', icon: Linkedin },
  ]

  return (
    <div className="min-h-screen p-10 animate-in">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <header>
          <div className="flex items-center gap-1.5 text-tertiary text-xs mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Command Center</span>
          </div>
          <h1 className="text-[32px] font-semibold tracking-tight text-primary">
            Welcome back, Galen
          </h1>
          <p className="text-secondary text-sm mt-1">
            This week's strategy is ready. Review before I start posting.
          </p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard 
            icon={Settings}
            value={readyPlatforms}
            label="Platforms Connected"
            badge={`${readyPlatforms}/${totalPlatforms} Ready`}
          />
          <StatCard 
            icon={Users}
            value={thoughtLeaders?.length || 0}
            label="Thought Leaders"
            badge="Tracking"
          />
          <StatCard 
            icon={Building2}
            value={competitors?.length || 0}
            label="Competitors"
            badge="Monitoring"
          />
          <StatCard 
            icon={FileText}
            value={postsThisWeek}
            label="Posts Planned"
            badge="This Week"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-3 gap-5">
          
          {/* This Week's Content */}
          <div className="col-span-2 glass-panel">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[rgb(var(--glass-border-subtle))]">
              <h2 className="text-sm font-semibold text-primary">This Week's Content</h2>
              <Link 
                href="/calendar" 
                className="text-xs text-tertiary hover:text-secondary flex items-center gap-1 transition-colors"
              >
                Full Calendar <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="p-3">
              {weekContent.map((item, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-2xl glass-inset-hover"
                >
                  <span className="text-xs text-tertiary w-7">{item.day}</span>
                  <div className="w-9 h-9 rounded-xl glass-inset flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-primary truncate">{item.title}</div>
                    <div className="text-[10px] text-tertiary">{item.type}</div>
                  </div>
                  <span className={`
                    text-[10px] px-3 py-1 rounded-full
                    ${item.status === 'ready' 
                      ? 'bg-[rgb(var(--fg))]/10 text-secondary' 
                      : 'bg-[rgb(var(--fg))]/5 text-tertiary'
                    }
                  `}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Platforms */}
          <div className="glass-panel">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-[rgb(var(--glass-border-subtle))]">
              <Settings className="w-4 h-4 text-secondary" />
              <h2 className="text-sm font-semibold text-primary">Platforms</h2>
            </div>
            <div className="p-3">
              {platforms?.map((platform) => (
                <div 
                  key={platform.id}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl glass-inset-hover"
                >
                  <div className="w-9 h-9 rounded-xl glass-inset flex items-center justify-center">
                    {platformIcons[platform.name] || <Settings className="w-4 h-4 text-secondary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-primary">{platform.name}</div>
                    <div className="text-[10px] text-tertiary">
                      {platform.handle || (platform.api_enabled ? 'via Ayrshare' : 'Setup needed')}
                    </div>
                  </div>
                  {platform.api_enabled ? (
                    <CheckCircle className="w-4 h-4 text-secondary" />
                  ) : (
                    <Circle className="w-4 h-4 text-tertiary" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Research Insights */}
        <div className="glass-panel">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[rgb(var(--glass-border-subtle))]">
            <h2 className="text-sm font-semibold text-primary">Research Insights</h2>
            <Link 
              href="/research" 
              className="text-xs text-tertiary hover:text-secondary flex items-center gap-1 transition-colors"
            >
              All Research <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-6 grid grid-cols-3 gap-8">
            <InsightCard 
              icon={Users}
              value={thoughtLeaders?.length || 0}
              label="Thought Leaders"
              sublabel="Tracked for content inspiration"
            />
            <InsightCard 
              icon={Building2}
              value={competitors?.length || 0}
              label="Competitors"
              sublabel="Monitored for positioning"
            />
            <InsightCard 
              icon={Sparkles}
              value={13}
              label="Patterns"
              sublabel="Content patterns learned"
            />
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
  badge 
}: { 
  icon: any
  value: number
  label: string
  badge: string
}) {
  return (
    <div className="glass-panel p-5">
      <div className="flex items-start justify-between mb-5">
        <div className="w-10 h-10 rounded-2xl glass-inset flex items-center justify-center">
          <Icon className="w-5 h-5 text-secondary" />
        </div>
        <span className="text-[10px] text-tertiary">{badge}</span>
      </div>
      <div className="text-3xl font-semibold text-primary tracking-tight">{value}</div>
      <div className="text-xs text-secondary mt-1">{label}</div>
    </div>
  )
}

function InsightCard({
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
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-secondary" />
        <span className="text-xs text-secondary">{label}</span>
      </div>
      <div className="text-2xl font-semibold text-primary">{value}</div>
      <div className="text-[10px] text-tertiary">{sublabel}</div>
    </div>
  )
}
