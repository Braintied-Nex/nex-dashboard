import { createClient } from '@/lib/supabase/server'
import type { Platform, Post, Theme, EngagementItem, ContentIdea, Trend } from '@/lib/supabase/types'
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
  Zap,
  Users,
  Building2,
  CheckCircle2,
  Clock,
  Sparkles,
  Calendar,
  TrendingUp,
  Lightbulb,
  MessageCircle,
  AlertCircle,
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

type PostWithRelations = Post & { platform: Platform | null; theme: Theme | null }

export default async function Dashboard() {
  const supabase = await createClient()
  
  const [
    { data: platforms },
    { data: allPosts },
    { data: scheduledPosts },
    { data: themes },
    { data: thoughtLeaders },
    { data: competitors },
    { data: researchLogs },
    { data: pendingEngagements },
    { data: activeIdeas },
    { data: risingTrends }
  ] = await Promise.all([
    supabase.from('nex_platforms').select('*'),
    supabase.from('nex_posts').select('*'),
    supabase.from('nex_posts').select('*, platform:nex_platforms(*), theme:nex_themes(*)').eq('status', 'scheduled').order('scheduled_for', { ascending: true }).limit(10),
    supabase.from('nex_themes').select('*'),
    supabase.from('nex_thought_leaders').select('*'),
    supabase.from('nex_competitors').select('*'),
    supabase.from('nex_research_log').select('*').order('created_at', { ascending: false }).limit(1),
    supabase.from('nex_engagement_queue').select('*').eq('status', 'pending').order('priority', { ascending: false }).limit(5),
    supabase.from('nex_content_ideas').select('*').not('status', 'in', '("completed","archived")').order('potential_score', { ascending: false }).limit(5),
    supabase.from('nex_trends').select('*').eq('status', 'watching').order('relevance_score', { ascending: false }).limit(5)
  ]) as [
    { data: Platform[] | null },
    { data: Post[] | null },
    { data: PostWithRelations[] | null },
    { data: Theme[] | null },
    { data: any[] | null },
    { data: any[] | null },
    { data: any[] | null },
    { data: EngagementItem[] | null },
    { data: ContentIdea[] | null },
    { data: Trend[] | null }
  ]

  const readyPlatforms = platforms?.filter(p => p.api_enabled).length || 0
  const totalPlatforms = platforms?.length || 0
  const scheduledCount = allPosts?.filter(p => p.status === 'scheduled').length || 0
  const draftCount = allPosts?.filter(p => p.status === 'draft').length || 0
  const pendingCount = pendingEngagements?.length || 0
  const urgentCount = pendingEngagements?.filter(e => e.priority === 'urgent' || e.priority === 'high').length || 0

  // Group scheduled posts by date
  const postsByDate = (scheduledPosts || []).reduce((acc, post) => {
    if (post.scheduled_for) {
      const date = new Date(post.scheduled_for).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      if (!acc[date]) acc[date] = []
      acc[date].push(post)
    }
    return acc
  }, {} as Record<string, PostWithRelations[]>)

  const momentumIcon = (momentum: string) => {
    switch (momentum) {
      case 'rising': return <ArrowUpRight className="h-3 w-3 text-green-400" />
      case 'falling': return <ArrowDownRight className="h-3 w-3 text-red-400" />
      default: return <Minus className="h-3 w-3 text-[rgb(var(--muted-fg))]" />
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-[rgb(var(--muted-fg))] mb-2">
          <Zap className="h-4 w-4" />
          <span className="text-sm font-medium">Command Center</span>
        </div>
        <h1 className="text-3xl font-bold mb-1">Welcome back, Galen</h1>
        <p className="text-[rgb(var(--muted-fg))]">
          {pendingCount > 0 
            ? `${pendingCount} engagement${pendingCount > 1 ? 's' : ''} waiting for response${urgentCount > 0 ? ` (${urgentCount} urgent)` : ''}.`
            : scheduledCount > 0 
              ? `${scheduledCount} posts scheduled and ready to go.`
              : 'Ready to build your content presence.'}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Card variant="glass">
          <CardContent className="py-5">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-[--radius-lg] bg-[rgb(var(--muted))]">
                <Target className="h-5 w-5 text-[rgb(var(--accent))]" />
              </div>
              <span className="text-xs font-medium text-green-400">
                {readyPlatforms}/{totalPlatforms}
              </span>
            </div>
            <p className="text-3xl font-semibold mb-1">{readyPlatforms}</p>
            <p className="text-sm text-[rgb(var(--muted-fg))]">Platforms</p>
          </CardContent>
        </Card>

        <Card variant="glass" className={urgentCount > 0 ? 'border-orange-500/30' : ''}>
          <CardContent className="py-5">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-[--radius-lg] bg-[rgb(var(--muted))]">
                <MessageCircle className={`h-5 w-5 ${urgentCount > 0 ? 'text-orange-400' : 'text-[rgb(var(--accent))]'}`} />
              </div>
              <Link href="/engagement" className="text-xs text-[rgb(var(--muted-fg))] hover:text-[rgb(var(--fg))]">View →</Link>
            </div>
            <p className="text-3xl font-semibold mb-1">{pendingCount}</p>
            <p className="text-sm text-[rgb(var(--muted-fg))]">To Respond</p>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardContent className="py-5">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-[--radius-lg] bg-[rgb(var(--muted))]">
                <Lightbulb className="h-5 w-5 text-[rgb(var(--accent))]" />
              </div>
              <Link href="/ideas" className="text-xs text-[rgb(var(--muted-fg))] hover:text-[rgb(var(--fg))]">View →</Link>
            </div>
            <p className="text-3xl font-semibold mb-1">{activeIdeas?.length || 0}</p>
            <p className="text-sm text-[rgb(var(--muted-fg))]">Ideas</p>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardContent className="py-5">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-[--radius-lg] bg-[rgb(var(--muted))]">
                <FileText className="h-5 w-5 text-[rgb(var(--accent))]" />
              </div>
              <Link href="/posts" className="text-xs text-[rgb(var(--muted-fg))] hover:text-[rgb(var(--fg))]">View →</Link>
            </div>
            <p className="text-3xl font-semibold mb-1">{scheduledCount}</p>
            <p className="text-sm text-[rgb(var(--muted-fg))]">Scheduled</p>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardContent className="py-5">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-[--radius-lg] bg-[rgb(var(--muted))]">
                <TrendingUp className="h-5 w-5 text-[rgb(var(--accent))]" />
              </div>
              <Link href="/research" className="text-xs text-[rgb(var(--muted-fg))] hover:text-[rgb(var(--fg))]">View →</Link>
            </div>
            <p className="text-3xl font-semibold mb-1">{risingTrends?.length || 0}</p>
            <p className="text-sm text-[rgb(var(--muted-fg))]">Trends</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Pending Engagements - Priority Focus */}
        {pendingCount > 0 && (
          <Card className={urgentCount > 0 ? 'lg:col-span-2 border-orange-500/30' : 'lg:col-span-2'}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Engagement Queue
                {urgentCount > 0 && (
                  <Badge className="bg-orange-500/15 text-orange-400 ml-2">{urgentCount} urgent</Badge>
                )}
              </CardTitle>
              <Link 
                href="/engagement" 
                className="text-sm text-[rgb(var(--accent))] hover:underline flex items-center gap-1"
              >
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <div className="divide-y divide-[rgb(var(--border))]">
              {pendingEngagements?.slice(0, 3).map((item) => (
                <div key={item.id} className="px-6 py-4">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-[rgb(var(--muted))] flex items-center justify-center flex-shrink-0">
                      {platformIcons[item.platform] || <MessageCircle className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{item.author_name || item.author_handle}</span>
                        <Badge 
                          className={
                            item.priority === 'urgent' ? 'bg-red-500/15 text-red-400' :
                            item.priority === 'high' ? 'bg-orange-500/15 text-orange-400' :
                            'bg-blue-500/15 text-blue-400'
                          }
                        >
                          {item.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-[rgb(var(--muted-fg))] line-clamp-2">{item.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Upcoming Content - Show if no engagements or alongside */}
        <Card className={pendingCount > 0 ? '' : 'lg:col-span-2'}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Content
            </CardTitle>
            <Link 
              href="/calendar" 
              className="text-sm text-[rgb(var(--accent))] hover:underline flex items-center gap-1"
            >
              Calendar <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {Object.keys(postsByDate).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(postsByDate).slice(0, 3).map(([date, datePosts]) => (
                  <div key={date}>
                    <p className="text-xs font-medium text-[rgb(var(--muted-fg))] mb-2">{date}</p>
                    <div className="space-y-2">
                      {datePosts.slice(0, 2).map((post) => (
                        <div 
                          key={post.id}
                          className="flex items-start gap-3 p-3 bg-[rgb(var(--muted))] rounded-[--radius-lg]"
                        >
                          <div className="p-2 rounded-[--radius-md] bg-[rgb(var(--bg))]">
                            {post.platform ? platformIcons[post.platform.name] : <FileText className="h-4 w-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm line-clamp-2">{post.content}</p>
                            {post.platform && (
                              <span className="text-xs text-[rgb(var(--muted-fg))]">{post.platform.name}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-[rgb(var(--muted-fg))]">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No scheduled posts yet</p>
                <Link href="/posts" className="text-sm text-[rgb(var(--accent))] hover:underline mt-2 inline-block">
                  Create your first post →
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions + Status */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Quick Actions
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
                  <p className="text-xs opacity-80">Platform playbooks</p>
                </div>
              </Link>
              <Link 
                href="/ideas"
                className="flex items-center gap-3 p-3 bg-[rgb(var(--muted))] rounded-[--radius-lg] hover:bg-[rgb(var(--border))] transition-all"
              >
                <Lightbulb className="h-5 w-5" />
                <div>
                  <p className="font-medium text-sm">Ideas Pipeline</p>
                  <p className="text-xs text-[rgb(var(--muted-fg))]">{activeIdeas?.length || 0} to develop</p>
                </div>
              </Link>
              <Link 
                href="/research"
                className="flex items-center gap-3 p-3 bg-[rgb(var(--muted))] rounded-[--radius-lg] hover:bg-[rgb(var(--border))] transition-all"
              >
                <Users className="h-5 w-5" />
                <div>
                  <p className="font-medium text-sm">Research Hub</p>
                  <p className="text-xs text-[rgb(var(--muted-fg))]">{(thoughtLeaders?.length || 0) + (competitors?.length || 0)} tracked</p>
                </div>
              </Link>
            </CardContent>
          </Card>

          {/* Platforms Status */}
          <Card>
            <CardHeader>
              <CardTitle>Platforms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {platforms?.slice(0, 4).map((platform) => (
                <div 
                  key={platform.id}
                  className="flex items-center justify-between p-3 bg-[rgb(var(--muted))] rounded-[--radius-lg]"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-[--radius-md] bg-[rgb(var(--bg))]">
                      {platformIcons[platform.name] || <Target className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{platform.name}</p>
                      <p className="text-xs text-[rgb(var(--muted-fg))]">{platform.handle || 'Not set'}</p>
                    </div>
                  </div>
                  {platform.api_enabled ? (
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                  ) : (
                    <Clock className="h-4 w-4 text-[rgb(var(--muted-fg))]" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Row: Trends + High Potential Ideas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trending Topics */}
        {risingTrends && risingTrends.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Trending Topics
              </CardTitle>
              <Link 
                href="/research" 
                className="text-sm text-[rgb(var(--accent))] hover:underline flex items-center gap-1"
              >
                All Trends <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {risingTrends.slice(0, 4).map((trend) => (
                  <div 
                    key={trend.id}
                    className="flex items-center justify-between p-3 bg-[rgb(var(--muted))] rounded-[--radius-lg]"
                  >
                    <div className="flex items-center gap-3">
                      {momentumIcon(trend.momentum)}
                      <span className="text-sm font-medium">{trend.topic}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{trend.source}</Badge>
                      <span className="text-xs text-[rgb(var(--accent))]">{trend.relevance_score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* High Potential Ideas */}
        {activeIdeas && activeIdeas.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Top Ideas
              </CardTitle>
              <Link 
                href="/ideas" 
                className="text-sm text-[rgb(var(--accent))] hover:underline flex items-center gap-1"
              >
                All Ideas <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {activeIdeas.slice(0, 4).map((idea) => (
                  <div 
                    key={idea.id}
                    className="flex items-center justify-between p-3 bg-[rgb(var(--muted))] rounded-[--radius-lg]"
                  >
                    <div className="flex-1 min-w-0 mr-3">
                      <p className="text-sm font-medium truncate">{idea.title || idea.description.slice(0, 50)}</p>
                      <p className="text-xs text-[rgb(var(--muted-fg))] capitalize">{idea.status.replace('_', ' ')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[rgb(var(--accent))]">{idea.potential_score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Research Summary - show if no trends or ideas */}
        {(!risingTrends || risingTrends.length === 0) && (!activeIdeas || activeIdeas.length === 0) && (
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Research Summary
              </CardTitle>
              <Link 
                href="/research" 
                className="text-sm text-[rgb(var(--accent))] hover:underline flex items-center gap-1"
              >
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-[rgb(var(--muted))] rounded-[--radius-lg] text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                  <p className="text-2xl font-bold">{thoughtLeaders?.length || 0}</p>
                  <p className="text-sm text-[rgb(var(--muted-fg))]">Thought Leaders</p>
                </div>
                <div className="p-4 bg-[rgb(var(--muted))] rounded-[--radius-lg] text-center">
                  <Building2 className="h-8 w-8 mx-auto mb-2 text-red-400" />
                  <p className="text-2xl font-bold">{competitors?.length || 0}</p>
                  <p className="text-sm text-[rgb(var(--muted-fg))]">Competitors</p>
                </div>
                <div className="p-4 bg-[rgb(var(--muted))] rounded-[--radius-lg] text-center">
                  <Lightbulb className="h-8 w-8 mx-auto mb-2 text-yellow-400" />
                  <p className="text-2xl font-bold">{researchLogs?.length || 0}</p>
                  <p className="text-sm text-[rgb(var(--muted-fg))]">Research Sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Content Themes */}
      {themes && themes.length > 0 && (
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Themes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {themes.map((theme) => (
                  <div 
                    key={theme.id}
                    className="flex items-center gap-2 px-4 py-2 bg-[rgb(var(--muted))] rounded-[--radius-lg]"
                  >
                    <div 
                      className="h-3 w-3 rounded-full" 
                      style={{ backgroundColor: theme.color || '#666' }}
                    />
                    <span className="text-sm">{theme.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
