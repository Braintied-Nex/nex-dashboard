import { createClient } from '@/lib/supabase/server'
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import { 
  Users, 
  Building2, 
  Lightbulb, 
  TrendingUp,
  ExternalLink,
  Twitter,
  Linkedin,
  Target
} from 'lucide-react'
import Link from 'next/link'

export default async function ResearchPage() {
  const supabase = await createClient()
  
  const [
    { data: thoughtLeaders },
    { data: competitors },
    { data: researchLogs },
    { data: contentPatterns }
  ] = await Promise.all([
    supabase.from('nex_thought_leaders').select('*').order('relevance_score', { ascending: false }),
    supabase.from('nex_competitors').select('*').order('created_at', { ascending: false }),
    supabase.from('nex_research_log').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('nex_content_patterns').select('*').order('effectiveness_score', { ascending: false })
  ])

  const platformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitter': return <Twitter className="h-4 w-4" />
      case 'linkedin': return <Linkedin className="h-4 w-4" />
      default: return <Target className="h-4 w-4" />
    }
  }

  const categoryColors: Record<string, string> = {
    founder: 'bg-blue-500/15 text-blue-400',
    investor: 'bg-green-500/15 text-green-400',
    builder: 'bg-purple-500/15 text-purple-400',
    commentator: 'bg-yellow-500/15 text-yellow-400',
    direct: 'bg-red-500/15 text-red-400',
    adjacent: 'bg-orange-500/15 text-orange-400',
    aspirational: 'bg-cyan-500/15 text-cyan-400',
  }

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Research</h1>
        <p className="text-[rgb(var(--muted-fg))]">
          Tracking thought leaders, competitors, and content patterns
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card variant="glass">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-[rgb(var(--accent))]" />
              <div>
                <p className="text-2xl font-bold">{thoughtLeaders?.length || 0}</p>
                <p className="text-sm text-[rgb(var(--muted-fg))]">Thought Leaders</p>
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
              <Lightbulb className="h-8 w-8 text-[rgb(var(--accent))]" />
              <div>
                <p className="text-2xl font-bold">{contentPatterns?.length || 0}</p>
                <p className="text-sm text-[rgb(var(--muted-fg))]">Patterns Found</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-[rgb(var(--accent))]" />
              <div>
                <p className="text-2xl font-bold">{researchLogs?.length || 0}</p>
                <p className="text-sm text-[rgb(var(--muted-fg))]">Research Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Thought Leaders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Thought Leaders to Study
            </CardTitle>
          </CardHeader>
          <div className="divide-y divide-[rgb(var(--border))] max-h-[400px] overflow-y-auto">
            {thoughtLeaders && thoughtLeaders.length > 0 ? (
              thoughtLeaders.map((leader: any) => (
                <div key={leader.id} className="px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[rgb(var(--muted))] flex items-center justify-center">
                      {platformIcon(leader.platform)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{leader.name}</p>
                      <p className="text-xs text-[rgb(var(--muted-fg))]">
                        @{leader.handle} · {leader.company}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={categoryColors[leader.category] || ''}>
                      {leader.category}
                    </Badge>
                    <span className="text-xs text-[rgb(var(--muted-fg))]">
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
              competitors.map((comp: any) => (
                <div key={comp.id} className="px-6 py-3">
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
                    <Badge className={categoryColors[comp.category] || ''}>
                      {comp.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-[rgb(var(--muted-fg))]">
                    {comp.positioning || 'No positioning defined'}
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

      {/* Research Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Latest Research Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          {researchLogs && researchLogs.length > 0 ? (
            <div className="space-y-4">
              {researchLogs.map((log: any) => (
                <div key={log.id} className="p-4 bg-[rgb(var(--muted))] rounded-[--radius-lg]">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{log.topic}</p>
                    <Badge variant="default">{log.source}</Badge>
                  </div>
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
          ) : (
            <div className="py-8 text-center text-[rgb(var(--muted-fg))]">
              No research sessions recorded yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
