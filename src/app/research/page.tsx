import { createClient } from '@/lib/supabase/server'
import type { ThoughtLeader, Competitor, ContentPattern, ResearchLog, Trend } from '@/lib/supabase/types'
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import { 
  Users, 
  Building2, 
  Lightbulb, 
  TrendingUp,
  ExternalLink,
  Twitter,
  Linkedin,
  Target,
  Sparkles,
  BookOpen,
  Eye,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Clock
} from 'lucide-react'

export default async function ResearchPage() {
  const supabase = await createClient()
  
  const [
    { data: thoughtLeaders },
    { data: competitors },
    { data: researchLogs },
    { data: contentPatterns },
    { data: trends }
  ] = await Promise.all([
    supabase.from('nex_thought_leaders').select('*').order('relevance_score', { ascending: false }).limit(10),
    supabase.from('nex_competitors').select('*').order('created_at', { ascending: false }).limit(10),
    supabase.from('nex_research_log').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('nex_content_patterns').select('*').order('effectiveness_score', { ascending: false }).limit(5),
    supabase.from('nex_trends').select('*').order('relevance_score', { ascending: false }).limit(5)
  ]) as [
    { data: ThoughtLeader[] | null },
    { data: Competitor[] | null },
    { data: ResearchLog[] | null },
    { data: ContentPattern[] | null },
    { data: Trend[] | null }
  ]

  const platformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitter': return <Twitter className="h-4 w-4" />
      case 'linkedin': return <Linkedin className="h-4 w-4" />
      default: return <Target className="h-4 w-4" />
    }
  }

  const categoryColors: Record<string, string> = {
    // Leader categories
    founder: 'bg-blue-500/15 text-blue-400',
    investor: 'bg-green-500/15 text-green-400',
    builder: 'bg-purple-500/15 text-purple-400',
    commentator: 'bg-yellow-500/15 text-yellow-400',
    journalist: 'bg-orange-500/15 text-orange-400',
    // Competitor categories
    direct: 'bg-red-500/15 text-red-400',
    adjacent: 'bg-orange-500/15 text-orange-400',
    aspirational: 'bg-cyan-500/15 text-cyan-400',
  }

  const momentumIcon = (momentum: string) => {
    switch (momentum) {
      case 'rising': return <ArrowUpRight className="h-4 w-4 text-green-400" />
      case 'falling': return <ArrowDownRight className="h-4 w-4 text-red-400" />
      default: return <Minus className="h-4 w-4 text-[rgb(var(--muted-fg))]" />
    }
  }

  const hasData = (thoughtLeaders?.length || 0) + (competitors?.length || 0) + (contentPatterns?.length || 0) > 0

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-[rgb(var(--muted-fg))] mb-2">
          <BookOpen className="h-4 w-4" />
          <span className="text-sm font-medium">Intelligence Gathering</span>
        </div>
        <h1 className="text-3xl font-bold mb-1">Research</h1>
        <p className="text-[rgb(var(--muted-fg))]">
          Track thought leaders, competitors, trends, and content patterns
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Card variant="glass">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-[rgb(var(--accent))]" />
              <div>
                <p className="text-2xl font-bold">{thoughtLeaders?.length || 0}</p>
                <p className="text-sm text-[rgb(var(--muted-fg))]">Leaders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-[rgb(var(--accent))]" />
              <div>
                <p className="text-2xl font-bold">{competitors?.length || 0}</p>
                <p className="text-sm text-[rgb(var(--muted-fg))]">Competitors</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-[rgb(var(--accent))]" />
              <div>
                <p className="text-2xl font-bold">{trends?.length || 0}</p>
                <p className="text-sm text-[rgb(var(--muted-fg))]">Trends</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Lightbulb className="h-8 w-8 text-[rgb(var(--accent))]" />
              <div>
                <p className="text-2xl font-bold">{contentPatterns?.length || 0}</p>
                <p className="text-sm text-[rgb(var(--muted-fg))]">Patterns</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Eye className="h-8 w-8 text-[rgb(var(--accent))]" />
              <div>
                <p className="text-2xl font-bold">{researchLogs?.length || 0}</p>
                <p className="text-sm text-[rgb(var(--muted-fg))]">Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {!hasData ? (
        /* Empty State */
        <Card>
          <CardContent className="py-16 text-center">
            <Sparkles className="h-16 w-16 mx-auto mb-6 text-[rgb(var(--accent))] opacity-50" />
            <h2 className="text-2xl font-bold mb-3">Research Intelligence Ready</h2>
            <p className="text-[rgb(var(--muted-fg))] max-w-lg mx-auto mb-8">
              I&apos;ll proactively research thought leaders, track competitors, identify trends, 
              and discover content patterns that work. This intelligence feeds into content strategy.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="p-4 bg-[rgb(var(--muted))] rounded-lg text-left">
                <Users className="h-6 w-6 text-blue-400 mb-2" />
                <h3 className="font-semibold text-sm mb-1">Thought Leaders</h3>
                <p className="text-xs text-[rgb(var(--muted-fg))]">
                  People whose content style and reach I study
                </p>
              </div>
              <div className="p-4 bg-[rgb(var(--muted))] rounded-lg text-left">
                <Building2 className="h-6 w-6 text-red-400 mb-2" />
                <h3 className="font-semibold text-sm mb-1">Competitors</h3>
                <p className="text-xs text-[rgb(var(--muted-fg))]">
                  Companies to track for positioning and content
                </p>
              </div>
              <div className="p-4 bg-[rgb(var(--muted))] rounded-lg text-left">
                <TrendingUp className="h-6 w-6 text-green-400 mb-2" />
                <h3 className="font-semibold text-sm mb-1">Trends</h3>
                <p className="text-xs text-[rgb(var(--muted-fg))]">
                  Topics gaining momentum I should cover
                </p>
              </div>
              <div className="p-4 bg-[rgb(var(--muted))] rounded-lg text-left">
                <Lightbulb className="h-6 w-6 text-yellow-400 mb-2" />
                <h3 className="font-semibold text-sm mb-1">Patterns</h3>
                <p className="text-xs text-[rgb(var(--muted-fg))]">
                  Content formats and hooks that work
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Data Display */
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Thought Leaders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Thought Leaders
                </CardTitle>
              </CardHeader>
              <div className="divide-y divide-[rgb(var(--border))] max-h-[400px] overflow-y-auto">
                {thoughtLeaders && thoughtLeaders.length > 0 ? (
                  thoughtLeaders.map((leader) => (
                    <div key={leader.id} className="px-6 py-3 flex items-center justify-between hover:bg-[rgb(var(--muted))]/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-[rgb(var(--muted))] flex items-center justify-center">
                          {platformIcon(leader.platform)}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{leader.name}</p>
                          <p className="text-xs text-[rgb(var(--muted-fg))]">
                            @{leader.handle} {leader.company && `· ${leader.company}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={categoryColors[leader.category] || ''}>
                          {leader.category}
                        </Badge>
                        <span className="text-xs text-[rgb(var(--muted-fg))] w-8 text-right">
                          {leader.relevance_score}%
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-8 text-center text-[rgb(var(--muted-fg))]">
                    No thought leaders tracked yet
                  </div>
                )}
              </div>
            </Card>

            {/* Competitors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Competitors
                </CardTitle>
              </CardHeader>
              <div className="divide-y divide-[rgb(var(--border))] max-h-[400px] overflow-y-auto">
                {competitors && competitors.length > 0 ? (
                  competitors.map((comp) => (
                    <div key={comp.id} className="px-6 py-3 hover:bg-[rgb(var(--muted))]/50 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{comp.name}</p>
                          {comp.website && (
                            <a 
                              href={`https://${comp.website}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[rgb(var(--muted-fg))] hover:text-[rgb(var(--accent))]"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={categoryColors[comp.category] || ''}>
                            {comp.category}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs text-[rgb(var(--muted-fg))]">
                        {comp.positioning || comp.description || 'No positioning defined'}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-8 text-center text-[rgb(var(--muted-fg))]">
                    No competitors tracked yet
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Trends */}
          {trends && trends.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trends.map((trend) => (
                    <div 
                      key={trend.id} 
                      className="p-4 bg-[rgb(var(--muted))] rounded-lg hover:bg-[rgb(var(--border))]/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{trend.topic}</h4>
                        {momentumIcon(trend.momentum)}
                      </div>
                      {trend.description && (
                        <p className="text-xs text-[rgb(var(--muted-fg))] mb-2 line-clamp-2">
                          {trend.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {trend.source}
                        </Badge>
                        <Badge 
                          className={
                            trend.status === 'published' ? 'bg-green-500/15 text-green-400' :
                            trend.status === 'creating' ? 'bg-blue-500/15 text-blue-400' :
                            trend.status === 'planning' ? 'bg-yellow-500/15 text-yellow-400' :
                            ''
                          }
                        >
                          {trend.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Content Patterns */}
          {contentPatterns && contentPatterns.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Content Patterns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {contentPatterns.map((pattern) => (
                    <div 
                      key={pattern.id} 
                      className="p-4 bg-[rgb(var(--muted))] rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{pattern.name}</h4>
                          {pattern.description && (
                            <p className="text-sm text-[rgb(var(--muted-fg))]">
                              {pattern.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{pattern.pattern_type}</Badge>
                          <div className="flex items-center gap-1">
                            <Zap className="h-4 w-4 text-yellow-400" />
                            <span className="text-sm font-medium">{pattern.effectiveness_score}%</span>
                          </div>
                        </div>
                      </div>
                      {(pattern.when_to_use || pattern.when_to_avoid) && (
                        <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-[rgb(var(--border))]">
                          {pattern.when_to_use && (
                            <div>
                              <p className="text-xs text-green-400 mb-1">When to use</p>
                              <p className="text-xs text-[rgb(var(--muted-fg))]">{pattern.when_to_use}</p>
                            </div>
                          )}
                          {pattern.when_to_avoid && (
                            <div>
                              <p className="text-xs text-red-400 mb-1">When to avoid</p>
                              <p className="text-xs text-[rgb(var(--muted-fg))]">{pattern.when_to_avoid}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Research Log */}
          {researchLogs && researchLogs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Recent Research Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {researchLogs.map((log) => (
                    <div key={log.id} className="p-4 bg-[rgb(var(--muted))] rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{log.topic}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{log.source}</Badge>
                          {log.time_spent_minutes && (
                            <span className="text-xs text-[rgb(var(--muted-fg))] flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {log.time_spent_minutes}m
                            </span>
                          )}
                        </div>
                      </div>
                      {log.summary && (
                        <p className="text-sm text-[rgb(var(--muted-fg))] mb-2">{log.summary}</p>
                      )}
                      {log.key_insights && log.key_insights.length > 0 && (
                        <ul className="space-y-1">
                          {log.key_insights.slice(0, 4).map((insight: string, i: number) => (
                            <li key={i} className="text-sm text-[rgb(var(--muted-fg))] flex items-start gap-2">
                              <span className="text-[rgb(var(--accent))]">•</span>
                              {insight}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
