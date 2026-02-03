import { createClient } from '@/lib/supabase/server'
import type { ContentIdea, Platform, Theme } from '@/lib/supabase/types'
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import { 
  Lightbulb,
  Sparkles,
  Zap,
  CheckCircle2,
  Clock,
  Archive,
  FileText,
  MessageSquare,
  Layers,
  Reply,
  Twitter,
  Linkedin,
  ExternalLink,
  ArrowRight,
  TrendingUp,
  Users,
  Building2,
  Target
} from 'lucide-react'

export default async function IdeasPage() {
  const supabase = await createClient()
  
  const [
    { data: ideas },
    { data: platforms },
    { data: themes }
  ] = await Promise.all([
    supabase.from('nex_content_ideas')
      .select('*')
      .order('potential_score', { ascending: false })
      .order('created_at', { ascending: false }),
    supabase.from('nex_platforms').select('*'),
    supabase.from('nex_themes').select('*')
  ]) as [
    { data: ContentIdea[] | null },
    { data: Platform[] | null },
    { data: Theme[] | null }
  ]

  const stats = {
    captured: ideas?.filter(i => i.status === 'captured').length || 0,
    validated: ideas?.filter(i => i.status === 'validated').length || 0,
    queued: ideas?.filter(i => i.status === 'queued').length || 0,
    inProgress: ideas?.filter(i => i.status === 'in_progress').length || 0,
    completed: ideas?.filter(i => i.status === 'completed').length || 0,
    archived: ideas?.filter(i => i.status === 'archived').length || 0,
  }

  const activeIdeas = ideas?.filter(i => !['completed', 'archived'].includes(i.status)) || []
  const highPotential = activeIdeas.filter(i => i.potential_score >= 70)
  const timeSensitive = activeIdeas.filter(i => i.time_sensitivity !== 'none')

  const ideaTypeIcon = (type: string) => {
    switch (type) {
      case 'post': return <FileText className="h-4 w-4" />
      case 'thread': return <Layers className="h-4 w-4" />
      case 'article': return <FileText className="h-4 w-4" />
      case 'reply': return <Reply className="h-4 w-4" />
      case 'series': return <Layers className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const inspirationIcon = (source: string | null) => {
    switch (source) {
      case 'conversation': return <MessageSquare className="h-3 w-3" />
      case 'research': return <Lightbulb className="h-3 w-3" />
      case 'trend': return <TrendingUp className="h-3 w-3" />
      case 'competitor': return <Building2 className="h-3 w-3" />
      case 'thought_leader': return <Users className="h-3 w-3" />
      default: return <Sparkles className="h-3 w-3" />
    }
  }

  const statusColors: Record<string, string> = {
    captured: 'bg-purple-500/15 text-purple-400',
    validated: 'bg-blue-500/15 text-blue-400',
    queued: 'bg-cyan-500/15 text-cyan-400',
    in_progress: 'bg-yellow-500/15 text-yellow-400',
    completed: 'bg-green-500/15 text-green-400',
    archived: 'bg-[rgb(var(--muted))] text-[rgb(var(--muted-fg))]',
  }

  const effortColors: Record<string, string> = {
    low: 'text-green-400',
    medium: 'text-yellow-400',
    high: 'text-red-400',
  }

  const timeSensitivityColors: Record<string, string> = {
    none: '',
    low: 'border-l-2 border-l-yellow-500/30',
    medium: 'border-l-2 border-l-orange-500/50',
    high: 'border-l-2 border-l-red-500/70',
  }

  const getPlatformName = (id: string | null) => platforms?.find(p => p.id === id)?.name || null
  const getThemeName = (id: string | null) => themes?.find(t => t.id === id)?.name || null

  const hasIdeas = (ideas?.length || 0) > 0

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-[rgb(var(--muted-fg))] mb-2">
          <Lightbulb className="h-4 w-4" />
          <span className="text-sm font-medium">Content Pipeline</span>
        </div>
        <h1 className="text-3xl font-bold mb-1">Ideas</h1>
        <p className="text-[rgb(var(--muted-fg))]">
          Capture, validate, and develop content ideas
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        <Card variant="glass">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-purple-400" />
              <div>
                <p className="text-2xl font-bold">{stats.captured}</p>
                <p className="text-xs text-[rgb(var(--muted-fg))]">Captured</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-blue-400" />
              <div>
                <p className="text-2xl font-bold">{stats.validated}</p>
                <p className="text-xs text-[rgb(var(--muted-fg))]">Validated</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-cyan-400" />
              <div>
                <p className="text-2xl font-bold">{stats.queued}</p>
                <p className="text-xs text-[rgb(var(--muted-fg))]">Queued</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Zap className="h-6 w-6 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
                <p className="text-xs text-[rgb(var(--muted-fg))]">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-400" />
              <div>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-xs text-[rgb(var(--muted-fg))]">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Archive className="h-6 w-6 text-[rgb(var(--muted-fg))]" />
              <div>
                <p className="text-2xl font-bold">{stats.archived}</p>
                <p className="text-xs text-[rgb(var(--muted-fg))]">Archived</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {!hasIdeas ? (
        /* Empty State */
        <Card>
          <CardContent className="py-16 text-center">
            <Sparkles className="h-16 w-16 mx-auto mb-6 text-[rgb(var(--accent))] opacity-50" />
            <h2 className="text-2xl font-bold mb-3">Ideas Pipeline Ready</h2>
            <p className="text-[rgb(var(--muted-fg))] max-w-lg mx-auto mb-8">
              I capture content ideas from research, conversations, trends, and competitors. 
              Each idea gets validated, scored, and developed into posts.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-[rgb(var(--muted-fg))]">
              <span className="px-3 py-1.5 bg-purple-500/15 text-purple-400 rounded-full">Captured</span>
              <ArrowRight className="h-4 w-4" />
              <span className="px-3 py-1.5 bg-blue-500/15 text-blue-400 rounded-full">Validated</span>
              <ArrowRight className="h-4 w-4" />
              <span className="px-3 py-1.5 bg-cyan-500/15 text-cyan-400 rounded-full">Queued</span>
              <ArrowRight className="h-4 w-4" />
              <span className="px-3 py-1.5 bg-yellow-500/15 text-yellow-400 rounded-full">In Progress</span>
              <ArrowRight className="h-4 w-4" />
              <span className="px-3 py-1.5 bg-green-500/15 text-green-400 rounded-full">Published</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Ideas List */}
          <div className="lg:col-span-2 space-y-6">
            {/* High Potential Ideas */}
            {highPotential.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    High Potential
                    <Badge className="bg-yellow-500/15 text-yellow-400 ml-2">
                      {highPotential.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <div className="divide-y divide-[rgb(var(--border))]">
                  {highPotential.slice(0, 5).map((idea) => (
                    <div 
                      key={idea.id} 
                      className={`p-6 hover:bg-[rgb(var(--muted))]/50 transition-colors ${timeSensitivityColors[idea.time_sensitivity]}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-lg bg-[rgb(var(--muted))] flex items-center justify-center flex-shrink-0">
                          {ideaTypeIcon(idea.idea_type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <h4 className="font-medium">{idea.title || idea.description.slice(0, 50)}</h4>
                              {idea.title && (
                                <p className="text-sm text-[rgb(var(--muted-fg))] line-clamp-2">{idea.description}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-lg font-bold text-[rgb(var(--accent))]">{idea.potential_score}</span>
                              <Badge className={statusColors[idea.status]}>{idea.status.replace('_', ' ')}</Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-[rgb(var(--muted-fg))]">
                            <span className="flex items-center gap-1">
                              {inspirationIcon(idea.inspiration_source)}
                              {idea.inspiration_source || 'organic'}
                            </span>
                            {getPlatformName(idea.platform_id) && (
                              <span className="flex items-center gap-1">
                                <Target className="h-3 w-3" />
                                {getPlatformName(idea.platform_id)}
                              </span>
                            )}
                            <span className={effortColors[idea.effort_estimate]}>
                              {idea.effort_estimate} effort
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* All Active Ideas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  All Ideas
                  <Badge variant="secondary" className="ml-2">
                    {activeIdeas.length} active
                  </Badge>
                </CardTitle>
              </CardHeader>
              <div className="divide-y divide-[rgb(var(--border))] max-h-[600px] overflow-y-auto">
                {activeIdeas.length > 0 ? (
                  activeIdeas.map((idea) => (
                    <div 
                      key={idea.id} 
                      className={`p-4 hover:bg-[rgb(var(--muted))]/50 transition-colors ${timeSensitivityColors[idea.time_sensitivity]}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-lg bg-[rgb(var(--muted))] flex items-center justify-center flex-shrink-0">
                          {ideaTypeIcon(idea.idea_type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h4 className="font-medium text-sm truncate">{idea.title || idea.description.slice(0, 60)}</h4>
                            <Badge className={`${statusColors[idea.status]} text-xs`}>
                              {idea.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          {idea.title && (
                            <p className="text-xs text-[rgb(var(--muted-fg))] line-clamp-1 mb-1">{idea.description}</p>
                          )}
                          <div className="flex items-center gap-2 text-xs text-[rgb(var(--muted-fg))]">
                            <span className="font-medium text-[rgb(var(--accent))]">{idea.potential_score}%</span>
                            <span>·</span>
                            <span className={effortColors[idea.effort_estimate]}>{idea.effort_estimate}</span>
                            {getThemeName(idea.theme_id) && (
                              <>
                                <span>·</span>
                                <span>{getThemeName(idea.theme_id)}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-[rgb(var(--muted-fg))]">
                    No active ideas yet
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Add */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Quick Capture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  placeholder="Capture a content idea..."
                  className="w-full px-4 py-3 bg-[rgb(var(--muted))] border border-[rgb(var(--border))] rounded-lg text-[rgb(var(--fg))] focus:outline-none focus:border-[rgb(var(--accent))] transition-colors resize-none text-sm"
                  rows={3}
                />
                <button className="w-full mt-3 px-4 py-2 bg-[rgb(var(--accent))] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                  Add Idea
                </button>
              </CardContent>
            </Card>

            {/* Time Sensitive */}
            {timeSensitive.length > 0 && (
              <Card className="border-orange-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-400">
                    <Clock className="h-5 w-5" />
                    Time Sensitive
                  </CardTitle>
                </CardHeader>
                <div className="divide-y divide-[rgb(var(--border))]">
                  {timeSensitive.slice(0, 3).map((idea) => (
                    <div key={idea.id} className="px-6 py-3">
                      <p className="text-sm font-medium truncate">{idea.title || idea.description.slice(0, 40)}</p>
                      <p className="text-xs text-orange-400">{idea.time_sensitivity} urgency</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* By Type */}
            <Card>
              <CardHeader>
                <CardTitle>By Type</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {['post', 'thread', 'article', 'reply', 'series'].map(type => {
                  const count = activeIdeas.filter(i => i.idea_type === type).length
                  return (
                    <div key={type} className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm capitalize">
                        {ideaTypeIcon(type)}
                        {type}
                      </span>
                      <span className="text-sm text-[rgb(var(--muted-fg))]">{count}</span>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
