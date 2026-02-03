import { createClient } from '@/lib/supabase/server'
import { 
  Sparkles,
  Users,
  Building2,
  FileText,
  Twitter,
  Linkedin,
  MessageSquare,
  BookOpen,
  ArrowRight,
  CheckCircle,
  Circle,
  Settings
} from 'lucide-react'
import Link from 'next/link'

const platformIcons: Record<string, any> = {
  'X/Twitter': Twitter,
  'LinkedIn': Linkedin,
  'Reddit': MessageSquare,
  'Substack': BookOpen,
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
    supabase.from('nex_posts').select('*').order('scheduled_for', { ascending: true }).limit(10),
    supabase.from('nex_thought_leaders').select('*'),
    supabase.from('nex_competitors').select('*'),
  ])

  const postsThisWeek = posts?.filter(p => p.status === 'scheduled' || p.status === 'draft').length || 0

  const weekContent = [
    { day: 'Mon', title: 'Why AI Chief of Staff > AI Assistant', type: 'Thread', status: 'ready', icon: Twitter },
    { day: 'Tue', title: '5 Tasks Sentigen Handles Proactively', type: 'Carousel', status: 'ready', icon: Linkedin },
    { day: 'Wed', title: 'Building AI for Execs - r/artificial', type: 'AMA', status: 'draft', icon: MessageSquare },
    { day: 'Thu', title: '30-sec inbox triage video', type: 'Demo', status: 'draft', icon: Twitter },
    { day: 'Fri', title: 'How Sentigen saves 2hrs/day', type: 'Case Study', status: 'idea', icon: Linkedin },
  ]

  return (
    <div className="min-h-screen p-10 animate-in">
      <div className="max-w-5xl space-y-10">
        
        {/* Header */}
        <header>
          <div className="flex items-center gap-1.5 text-3 text-xs mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Command Center
          </div>
          <h1 className="text-[34px] font-semibold tracking-tight text-1">
            Welcome back, Galen
          </h1>
          <p className="text-2 text-[15px] mt-2">
            This week's strategy is ready. Review before I start posting.
          </p>
        </header>

        {/* Stats - simplified, only what matters */}
        <div className="grid grid-cols-4 gap-5">
          <Stat 
            icon={Users}
            value={thoughtLeaders?.length || 0}
            label="Thought Leaders"
            badge="Tracking"
          />
          <Stat 
            icon={Building2}
            value={competitors?.length || 0}
            label="Competitors"
            badge="Monitoring"
          />
          <Stat 
            icon={FileText}
            value={postsThisWeek}
            label="Posts Planned"
            badge="This Week"
          />
          <Stat 
            icon={Sparkles}
            value={13}
            label="Patterns Learned"
            badge="Intelligence"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-5">
          
          {/* This Week's Content */}
          <div className="col-span-2 glass-panel">
            <div className="flex items-center justify-between px-6 py-5">
              <h2 className="text-[15px] font-medium text-1">This Week's Content</h2>
              <Link href="/calendar" className="text-xs text-3 hover:text-2 flex items-center gap-1 transition-colors">
                Full Calendar <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="px-4 pb-4 space-y-1">
              {weekContent.map((item, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-4 px-4 py-4 rounded-2xl glass-inset"
                >
                  <span className="text-[11px] text-4 w-7">{item.day}</span>
                  <div className="w-10 h-10 rounded-xl glass-inset flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] text-1">{item.title}</div>
                    <div className="text-[10px] text-4 mt-0.5">{item.type}</div>
                  </div>
                  <span className={`
                    text-[10px] px-3 py-1.5 rounded-full font-medium
                    ${item.status === 'ready' ? 'bg-[rgb(var(--fg))]/10 text-2' : 'bg-[rgb(var(--fg))]/5 text-4'}
                  `}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Platforms */}
          <div className="glass-panel">
            <div className="flex items-center gap-2 px-6 py-5">
              <Settings className="w-4 h-4 text-3" />
              <h2 className="text-[15px] font-medium text-1">Platforms</h2>
            </div>
            <div className="px-4 pb-4 space-y-1">
              {platforms?.map((platform) => {
                const Icon = platformIcons[platform.name] || Settings
                return (
                  <div 
                    key={platform.id}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-2xl glass-inset"
                  >
                    <div className="w-10 h-10 rounded-xl glass-inset flex items-center justify-center">
                      <Icon className="w-4 h-4 text-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] text-1">{platform.name}</div>
                      <div className="text-[10px] text-4">
                        {platform.handle || (platform.api_enabled ? 'via Ayrshare' : 'Setup needed')}
                      </div>
                    </div>
                    {platform.api_enabled ? (
                      <CheckCircle className="w-4 h-4 text-3" />
                    ) : (
                      <Circle className="w-4 h-4 text-4" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Research Insights */}
        <div className="glass-panel">
          <div className="flex items-center justify-between px-6 py-5">
            <h2 className="text-[15px] font-medium text-1">Research Insights</h2>
            <Link href="/research" className="text-xs text-3 hover:text-2 flex items-center gap-1 transition-colors">
              All Research <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

function Stat({ icon: Icon, value, label, badge }: { icon: any; value: number; label: string; badge: string }) {
  return (
    <div className="glass-panel p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="w-11 h-11 rounded-2xl glass-inset flex items-center justify-center">
          <Icon className="w-5 h-5 text-3" />
        </div>
        <span className="text-[10px] text-4">{badge}</span>
      </div>
      <div className="text-[32px] font-semibold text-1 tracking-tight">{value}</div>
      <div className="text-[12px] text-3 mt-1">{label}</div>
    </div>
  )
}
