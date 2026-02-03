import { createClient } from '@/lib/supabase/server'
import type { Platform, Post, Theme } from '@/lib/supabase/types'
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import { 
  FileText, 
  Calendar, 
  TrendingUp, 
  Target,
  Twitter,
  Linkedin,
  Github,
  Mail,
  ArrowRight,
  Zap,
  Users,
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

const platformIcons: Record<string, React.ReactNode> = {
  twitter: <Twitter className="h-5 w-5" />,
  linkedin: <Linkedin className="h-5 w-5" />,
  github: <Github className="h-5 w-5" />,
  mail: <Mail className="h-5 w-5" />,
  'message-square': <Mail className="h-5 w-5" />,
}

// Platform status from our research
const platformStatus: Record<string, { status: 'ready' | 'limited' | 'pending', note: string }> = {
  'X/Twitter': { status: 'ready', note: '@sentigen_ai API active' },
  'LinkedIn': { status: 'ready', note: 'via Ayrshare (Galen)' },
  'Reddit': { status: 'ready', note: 'u/braintied API ready' },
  'GitHub': { status: 'ready', note: '@Braintied-Nex' },
  'Substack': { status: 'pending', note: 'Need account' },
}

export default async function Dashboard() {
  const supabase = await createClient()
  
  const [
    { data: platforms },
    { data: posts },
    { data: themes },
    { data: thoughtLeaders },
    { data: competitors },
    { data: researchLogs }
  ] = await Promise.all([
    supabase.from('nex_platforms').select('*'),
    supabase.from('nex_posts').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('nex_themes').select('*'),
    supabase.from('nex_thought_leaders').select('*'),
    supabase.from('nex_competitors').select('*'),
    supabase.from('nex_research_log').select('*').limit(1)
  ]) as [
    { data: Platform[] | null },
    { data: Post[] | null },
    { data: Theme[] | null },
    { data: any[] | null },
    { data: any[] | null },
    { data: any[] | null }
  ]

  const readyPlatforms = Object.values(platformStatus).filter(p => p.status === 'ready').length
  const totalPlatforms = Object.keys(platformStatus).length

  const statusIcon = (status: string) => {
    if (status === 'ready') return <CheckCircle2 className="h-4 w-4 text-green-400" />
    if (status === 'limited') return <AlertTriangle className="h-4 w-4 text-yellow-400" />
    return <Clock className="h-4 w-4 text-red-400" />
  }

  const statusColors: Record<string, string> = {
    ready: 'text-green-400',
    limited: 'text-yellow-400',
    pending: 'text-red-400',
  }

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-[rgb(var(--accent))] mb-2">
          <Zap className="h-4 w-4" />
          <span className="text-sm font-medium">Command Center</span>
        </div>
        <h1 className="text-3xl font-bold mb-1">Welcome back, Galen</h1>
        <p className="text-[rgb(var(--muted-fg))]">
          Review my strategy before I start posting. All systems are documented.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card variant="glass">
          <CardContent className="py-5">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-[--radius-lg] bg-[rgb(var(--muted))]">
                <Target className="h-5 w-5 text-[rgb(var(--accent))]" />
              </div>
              <span className="text-xs font-medium text-green-400">
                {readyPlatforms}/{totalPlatforms} Ready
              </span>
            </div>
            <p className="text-3xl font-semibold mb-1">{readyPlatforms}</p>
            <p className="text-sm text-[rgb(var(--muted-fg))]">Platforms Connected</p>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardContent className="py-5">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-[--radius-lg] bg-[rgb(var(--muted))]">
                <Users className="h-5 w-5 text-[rgb(var(--accent))]" />
              </div>
              <span className="text-xs text-[rgb(var(--muted-fg))]">Tracking</span>
            </div>
            <p className="text-3xl font-semibold mb-1">{thoughtLeaders?.length || 0}</p>
            <p className="text-sm text-[rgb(var(--muted-fg))]">Thought Leaders</p>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardContent className="py-5">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-[--radius-lg] bg-[rgb(var(--muted))]">
                <Building2 className="h-5 w-5 text-[rgb(var(--accent))]" />
              </div>
              <span className="text-xs text-[rgb(var(--muted-fg))]">Monitoring</span>
            </div>
            <p className="text-3xl font-semibold mb-1">{competitors?.length || 0}</p>
            <p className="text-sm text-[rgb(var(--muted-fg))]">Competitors</p>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardContent className="py-5">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-[--radius-lg] bg-[rgb(var(--muted))]">
                <FileText className="h-5 w-5 text-[rgb(var(--accent))]" />
              </div>
              <span className="text-xs text-[rgb(var(--muted-fg))]">Drafts</span>
            </div>
            <p className="text-3xl font-semibold mb-1">{posts?.filter(p => p.status === 'draft').length || 0}</p>
            <p className="text-sm text-[rgb(var(--muted-fg))]">Posts Ready</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Platform Status */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Platform Status</CardTitle>
            <Link 
              href="/strategy" 
              className="text-sm text-[rgb(var(--accent))] hover:underline flex items-center gap-1"
            >
              View Strategy <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(platformStatus).map(([name, info]) => (
                <div 
                  key={name} 
                  className="flex items-center justify-between p-4 bg-[rgb(var(--muted))] rounded-[--radius-lg]"
                >
                  <div className="flex items-center gap-3">
                    {statusIcon(info.status)}
                    <div>
                      <p className="font-medium text-sm">{name}</p>
                      <p className="text-xs text-[rgb(var(--muted-fg))]">{info.note}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium ${statusColors[info.status]}`}>
                    {info.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link 
              href="/strategy"
              className="flex items-center gap-3 p-3 bg-[rgb(var(--accent))] text-[rgb(var(--accent-fg))] rounded-[--radius-lg] hover:brightness-110 transition-all"
            >
              <Target className="h-5 w-5" />
              <div>
                <p className="font-medium text-sm">Review Strategy</p>
                <p className="text-xs opacity-80">Before I start posting</p>
              </div>
            </Link>
            <Link 
              href="/research"
              className="flex items-center gap-3 p-3 bg-[rgb(var(--muted))] rounded-[--radius-lg] hover:bg-[rgb(var(--border))] transition-all"
            >
              <Users className="h-5 w-5" />
              <div>
                <p className="font-medium text-sm">View Research</p>
                <p className="text-xs text-[rgb(var(--muted-fg))]">Thought leaders & competitors</p>
              </div>
            </Link>
            <Link 
              href="/posts"
              className="flex items-center gap-3 p-3 bg-[rgb(var(--muted))] rounded-[--radius-lg] hover:bg-[rgb(var(--border))] transition-all"
            >
              <FileText className="h-5 w-5" />
              <div>
                <p className="font-medium text-sm">Draft Posts</p>
                <p className="text-xs text-[rgb(var(--muted-fg))]">Create content queue</p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Research Insights */}
      {researchLogs && researchLogs.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Latest Research Findings</CardTitle>
            <Link 
              href="/research" 
              className="text-sm text-[rgb(var(--accent))] hover:underline flex items-center gap-1"
            >
              All Research <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {researchLogs[0]?.key_insights?.slice(0, 6).map((insight: string, i: number) => (
                <div 
                  key={i}
                  className="p-3 bg-[rgb(var(--muted))] rounded-[--radius-lg] text-sm"
                >
                  <span className="text-[rgb(var(--accent))] mr-2">💡</span>
                  {insight}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Themes */}
      <div className="mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Content Themes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {themes?.map((theme) => (
                <div 
                  key={theme.id} 
                  className="flex items-center gap-2 p-3 bg-[rgb(var(--muted))] rounded-[--radius-lg]"
                >
                  <div 
                    className="h-3 w-3 rounded-full shrink-0" 
                    style={{ backgroundColor: theme.color || '#666' }}
                  />
                  <span className="text-sm font-medium truncate">{theme.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
