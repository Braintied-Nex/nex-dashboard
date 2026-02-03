import { createClient } from '@/lib/supabase/server'
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import { 
  FileText, 
  Target,
  Twitter,
  Linkedin,
  Github,
  MessageSquare,
  BookOpen,
  ArrowRight,
  Sparkles,
  Users,
  Building2,
  Clock,
  Calendar,
  TrendingUp,
  Lightbulb,
  MessageCircle,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react'
import Link from 'next/link'

const platformIcons: Record<string, React.ReactNode> = {
  'X/Twitter': <Twitter className="h-4 w-4" />,
  'LinkedIn': <Linkedin className="h-4 w-4" />,
  'Reddit': <MessageSquare className="h-4 w-4" />,
  'GitHub': <Github className="h-4 w-4" />,
  'Substack': <BookOpen className="h-4 w-4" />,
}

export default async function Dashboard() {
  const supabase = await createClient()
  
  const [
    { data: platforms },
    { data: allPosts },
    { data: scheduledPosts },
    { data: thoughtLeaders },
    { data: competitors },
    { data: pendingEngagements },
    { data: activeIdeas },
    { data: risingTrends }
  ] = await Promise.all([
    supabase.from('nex_platforms').select('*'),
    supabase.from('nex_posts').select('*'),
    supabase.from('nex_posts').select('*, platform:nex_platforms(*), theme:nex_themes(*)').eq('status', 'scheduled').order('scheduled_for', { ascending: true }).limit(5),
    supabase.from('nex_thought_leaders').select('*'),
    supabase.from('nex_competitors').select('*'),
    supabase.from('nex_engagement_queue').select('*').eq('status', 'pending').order('priority', { ascending: false }).limit(5),
    supabase.from('nex_content_ideas').select('*').not('status', 'in', '("completed","archived")').order('potential_score', { ascending: false }).limit(5),
    supabase.from('nex_trends').select('*').eq('status', 'watching').order('relevance_score', { ascending: false }).limit(5)
  ])

  const readyPlatforms = platforms?.filter(p => p.api_enabled).length || 0
  const scheduledCount = allPosts?.filter(p => p.status === 'scheduled').length || 0
  const pendingCount = pendingEngagements?.length || 0
  const urgentCount = pendingEngagements?.filter(e => e.priority === 'urgent' || e.priority === 'high').length || 0

  const momentumIcon = (momentum: string) => {
    switch (momentum) {
      case 'rising': return <ArrowUpRight className="h-4 w-4 text-[rgb(var(--success))]" />
      case 'falling': return <ArrowDownRight className="h-4 w-4 text-[rgb(var(--error))]" />
      default: return <Minus className="h-4 w-4 text-[rgb(var(--fg-muted))]" />
    }
  }

  return (
    <div className="min-h-screen p-10 animate-fade-in">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <header className="space-y-2">
          <p className="text-sm font-medium text-[rgb(var(--accent))] flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Command Center
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">Welcome back, Galen</h1>
          <p className="text-lg text-[rgb(var(--fg-muted))]">
            {pendingCount > 0 
              ? `${pendingCount} engagement${pendingCount > 1 ? 's' : ''} waiting${urgentCount > 0 ? ` · ${urgentCount} urgent` : ''}`
              : scheduledCount > 0 
                ? `${scheduledCount} posts scheduled`
                : 'Ready to build your presence'}
          </p>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-5 gap-4">
          {[
            { label: 'Platforms', value: readyPlatforms, icon: Target, color: 'accent' },
            { label: 'Responses', value: pendingCount, icon: MessageCircle, color: urgentCount > 0 ? 'warning' : 'accent' },
            { label: 'Ideas', value: activeIdeas?.length || 0, icon: Lightbulb, color: 'accent' },
            { label: 'Scheduled', value: scheduledCount, icon: FileText, color: 'accent' },
            { label: 'Trends', value: risingTrends?.length || 0, icon: TrendingUp, color: 'accent' },
          ].map((stat) => (
            <Card key={stat.label} variant="glass">
              <CardContent className="p-6">
                <div className={`h-10 w-10 rounded-2xl bg-[rgb(var(--${stat.color}))]/10 flex items-center justify-center mb-4`}>
                  <stat.icon className={`h-5 w-5 text-[rgb(var(--${stat.color}))]`} />
                </div>
                <p className="text-3xl font-semibold tracking-tight">{stat.value}</p>
                <p className="text-sm text-[rgb(var(--fg-muted))] mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-3 gap-6">
          
          {/* Engagement Queue */}
          <Card className="col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-[rgb(var(--accent))]/10 flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 text-[rgb(var(--accent))]" />
                </div>
                <CardTitle>Engagement Queue</CardTitle>
                {urgentCount > 0 && (
                  <Badge variant="warning">{urgentCount} urgent</Badge>
                )}
              </div>
              <Link href="/engagement" className="text-sm text-[rgb(var(--accent))] hover:underline flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <div className="divide-y divide-[rgb(var(--border-subtle))]">
              {pendingEngagements && pendingEngagements.length > 0 ? (
                pendingEngagements.slice(0, 4).map((item: any) => (
                  <div key={item.id} className="px-8 py-5 hover:bg-[rgb(var(--surface))]/50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-[rgb(var(--surface-raised))] flex items-center justify-center flex-shrink-0">
                        {platformIcons[item.platform] || <MessageCircle className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-medium text-sm">{item.author_name || item.author_handle}</span>
                          <Badge variant={item.priority === 'urgent' ? 'error' : item.priority === 'high' ? 'warning' : 'secondary'}>
                            {item.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-[rgb(var(--fg-muted))] line-clamp-2">{item.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-8 py-12 text-center text-[rgb(var(--fg-muted))]">
                  <MessageCircle className="h-8 w-8 mx-auto mb-3 opacity-30" />
                  <p>No pending engagements</p>
                </div>
              )}
            </div>
          </Card>

          {/* Upcoming Content */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-[rgb(var(--accent))]/10 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-[rgb(var(--accent))]" />
                </div>
                <CardTitle>Upcoming</CardTitle>
              </div>
              <Link href="/calendar" className="text-sm text-[rgb(var(--accent))] hover:underline flex items-center gap-1">
                Calendar <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {scheduledPosts && scheduledPosts.length > 0 ? (
                scheduledPosts.slice(0, 4).map((post: any) => (
                  <div key={post.id} className="p-4 rounded-2xl bg-[rgb(var(--surface))]/50 hover:bg-[rgb(var(--surface))] transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-xl bg-[rgb(var(--surface-raised))] flex items-center justify-center flex-shrink-0">
                        {post.platform ? platformIcons[post.platform.name] : <FileText className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm line-clamp-2">{post.content}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-[rgb(var(--fg-muted))]">
                          <Clock className="h-3 w-3" />
                          {new Date(post.scheduled_for).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-[rgb(var(--fg-muted))]">
                  <Calendar className="h-8 w-8 mx-auto mb-3 opacity-30" />
                  <p>No scheduled posts</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-2 gap-6">
          
          {/* Trends */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-[rgb(var(--accent))]/10 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-[rgb(var(--accent))]" />
                </div>
                <CardTitle>Trending</CardTitle>
              </div>
              <Link href="/research" className="text-sm text-[rgb(var(--accent))] hover:underline flex items-center gap-1">
                Research <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-2">
              {risingTrends && risingTrends.length > 0 ? (
                risingTrends.map((trend: any) => (
                  <div key={trend.id} className="flex items-center justify-between p-4 rounded-2xl bg-[rgb(var(--surface))]/50 hover:bg-[rgb(var(--surface))] transition-colors">
                    <div className="flex items-center gap-3">
                      {momentumIcon(trend.momentum)}
                      <span className="text-sm font-medium">{trend.topic}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{trend.source}</Badge>
                      <span className="text-sm text-[rgb(var(--accent))] font-medium">{trend.relevance_score}%</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-[rgb(var(--fg-muted))]">
                  <TrendingUp className="h-8 w-8 mx-auto mb-3 opacity-30" />
                  <p>No trends tracked</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ideas */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-[rgb(var(--accent))]/10 flex items-center justify-center">
                  <Lightbulb className="h-4 w-4 text-[rgb(var(--accent))]" />
                </div>
                <CardTitle>Top Ideas</CardTitle>
              </div>
              <Link href="/ideas" className="text-sm text-[rgb(var(--accent))] hover:underline flex items-center gap-1">
                All ideas <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-2">
              {activeIdeas && activeIdeas.length > 0 ? (
                activeIdeas.map((idea: any) => (
                  <div key={idea.id} className="flex items-center justify-between p-4 rounded-2xl bg-[rgb(var(--surface))]/50 hover:bg-[rgb(var(--surface))] transition-colors">
                    <div className="flex-1 min-w-0 mr-4">
                      <p className="text-sm font-medium truncate">{idea.title || idea.description.slice(0, 50)}</p>
                      <p className="text-xs text-[rgb(var(--fg-muted))] capitalize mt-1">{idea.status.replace('_', ' ')}</p>
                    </div>
                    <span className="text-lg font-semibold text-[rgb(var(--accent))]">{idea.potential_score}</span>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-[rgb(var(--fg-muted))]">
                  <Lightbulb className="h-8 w-8 mx-auto mb-3 opacity-30" />
                  <p>No ideas yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Research Summary */}
        <Card variant="glass">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-[rgb(var(--accent))]/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-[rgb(var(--accent))]" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">{thoughtLeaders?.length || 0}</p>
                    <p className="text-sm text-[rgb(var(--fg-muted))]">Thought Leaders</p>
                  </div>
                </div>
                <div className="w-px h-12 bg-[rgb(var(--border))]" />
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-[rgb(var(--accent))]/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-[rgb(var(--accent))]" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">{competitors?.length || 0}</p>
                    <p className="text-sm text-[rgb(var(--fg-muted))]">Competitors</p>
                  </div>
                </div>
                <div className="w-px h-12 bg-[rgb(var(--border))]" />
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-[rgb(var(--accent))]/10 flex items-center justify-center">
                    <Target className="h-5 w-5 text-[rgb(var(--accent))]" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">{platforms?.length || 0}</p>
                    <p className="text-sm text-[rgb(var(--fg-muted))]">Platforms</p>
                  </div>
                </div>
              </div>
              <Link 
                href="/research" 
                className="px-6 py-3 rounded-2xl bg-[rgb(var(--accent))] text-white font-medium text-sm shadow-lg shadow-[rgb(var(--accent))]/20 hover:shadow-xl transition-all"
              >
                Research Hub
              </Link>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
