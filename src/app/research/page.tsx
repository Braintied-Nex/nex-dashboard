import { createAdminClient } from '@/lib/supabase/admin'
import { Users, Building2, LineChart, FileText, TrendingUp, Target, AlertTriangle } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ResearchPage() {
  const sb = createAdminClient()

  const [
    { data: leaders },
    { data: competitors },
    { data: patterns },
    { data: researchLog },
    { data: trends },
  ] = await Promise.all([
    sb.from('nex_thought_leaders').select('*').order('relevance_score', { ascending: false }),
    sb.from('nex_competitors').select('*').order('threat_level', { ascending: false }),
    sb.from('nex_content_patterns').select('*').order('effectiveness_score', { ascending: false }),
    sb.from('nex_research_log').select('*').order('created_at', { ascending: false }),
    sb.from('nex_trends').select('*').order('momentum', { ascending: false }),
  ])

  return (
    <div className="min-h-screen p-6 lg:p-8 animate-in">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header>
          <h1 className="text-[28px] font-semibold tracking-tight text-1">
            Research Intelligence
          </h1>
          <p className="text-2 text-sm mt-1">
            {(leaders || []).length} thought leaders · {(competitors || []).length} competitors · {(trends || []).length} trends tracked
          </p>
        </header>

        {/* Sections */}
        <div className="space-y-6">
          
          {/* Trends */}
          <Section
            title="Trends"
            icon={TrendingUp}
            count={(trends || []).length}
            color="text-green-400"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {(trends || []).map((trend) => (
                <TrendCard key={trend.id} trend={trend} />
              ))}
            </div>
          </Section>

          {/* Thought Leaders */}
          <Section
            title="Thought Leaders"
            icon={Users}
            count={(leaders || []).length}
            color="text-blue-400"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {(leaders || []).map((leader) => (
                <LeaderCard key={leader.id} leader={leader} />
              ))}
            </div>
          </Section>

          {/* Competitors */}
          <Section
            title="Competitors"
            icon={Building2}
            count={(competitors || []).length}
            color="text-rose-400"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(competitors || []).map((competitor) => (
                <CompetitorCard key={competitor.id} competitor={competitor} />
              ))}
            </div>
          </Section>

          {/* Content Patterns */}
          <Section
            title="Content Patterns"
            icon={LineChart}
            count={(patterns || []).length}
            color="text-purple-400"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {(patterns || []).map((pattern) => (
                <PatternCard key={pattern.id} pattern={pattern} />
              ))}
            </div>
          </Section>

          {/* Research Log */}
          <Section
            title="Research Log"
            icon={FileText}
            count={(researchLog || []).length}
            color="text-amber-400"
          >
            <div className="space-y-2">
              {(researchLog || []).map((log) => (
                <LogEntry key={log.id} log={log} />
              ))}
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}

function Section({ 
  title, 
  icon: Icon, 
  count, 
  color, 
  children 
}: { 
  title: string
  icon: any
  count: number
  color: string
  children: React.ReactNode 
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <h2 className="text-lg font-semibold text-1">{title}</h2>
        <span className="text-xs text-4">({count})</span>
      </div>
      <div className="glass-panel p-5">
        {children}
      </div>
    </div>
  )
}

function TrendCard({ trend }: { trend: any }) {
  const statusColors: Record<string, string> = {
    rising: 'bg-green-500/15 text-green-400',
    stable: 'bg-blue-500/15 text-blue-400',
    declining: 'bg-amber-500/15 text-amber-400',
    emerging: 'bg-purple-500/15 text-purple-400',
  }

  const statusColor = statusColors[trend.status] || 'bg-gray-500/15 text-gray-400'

  return (
    <div className="glass-card p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-1 mb-1">{trend.topic}</h3>
          {trend.description && (
            <p className="text-xs text-3 line-clamp-2 leading-relaxed">{trend.description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[rgb(var(--glass-border))]">
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColor}`}>
          {trend.status}
        </span>
        <div className="flex items-center gap-3 text-xs">
          {trend.momentum != null && (
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-green-400 tabular-nums">{trend.momentum}</span>
            </div>
          )}
          {trend.relevance_score != null && (
            <div className="flex items-center gap-1">
              <Target className="w-3 h-3 text-blue-400" />
              <span className="text-blue-400 tabular-nums">{trend.relevance_score}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function LeaderCard({ leader }: { leader: any }) {
  const categoryColors: Record<string, string> = {
    'AI/ML': 'bg-purple-500/15 text-purple-400',
    'Productivity': 'bg-blue-500/15 text-blue-400',
    'Business': 'bg-amber-500/15 text-amber-400',
    'Tech': 'bg-cyan-500/15 text-cyan-400',
  }

  const categoryColor = categoryColors[leader.category] || 'bg-gray-500/15 text-gray-400'

  return (
    <div className="glass-card p-4 space-y-3">
      <div>
        <h3 className="text-sm font-medium text-1">{leader.name}</h3>
        {leader.handle && (
          <p className="text-xs text-4 mt-0.5">@{leader.handle}</p>
        )}
      </div>

      {leader.topics && leader.topics.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {leader.topics.slice(0, 3).map((topic: string, i: number) => (
            <span key={i} className="text-[10px] px-1.5 py-0.5 rounded glass-inset text-3">
              {topic}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-[rgb(var(--glass-border))]">
        {leader.category && (
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${categoryColor}`}>
            {leader.category}
          </span>
        )}
        {leader.relevance_score != null && (
          <div className="flex items-center gap-1">
            <Target className="w-3 h-3 text-blue-400" />
            <span className="text-xs text-blue-400 tabular-nums">{leader.relevance_score}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function CompetitorCard({ competitor }: { competitor: any }) {
  const threatColors: Record<string, string> = {
    high: 'bg-rose-500/15 text-rose-400',
    medium: 'bg-amber-500/15 text-amber-400',
    low: 'bg-green-500/15 text-green-400',
  }

  const threatColor = threatColors[competitor.threat_level] || 'bg-gray-500/15 text-gray-400'

  return (
    <div className="glass-card p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-1">{competitor.name}</h3>
          {competitor.category && (
            <p className="text-xs text-4 mt-0.5">{competitor.category}</p>
          )}
        </div>
        {competitor.threat_level && (
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${threatColor}`}>
            <AlertTriangle className="w-3 h-3" />
            {competitor.threat_level}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {competitor.strengths && (
          <div className="glass-inset p-2 rounded-lg">
            <div className="text-[10px] text-4 uppercase tracking-wider mb-1">Strengths</div>
            <p className="text-xs text-2 line-clamp-2 leading-relaxed">{competitor.strengths}</p>
          </div>
        )}
        {competitor.weaknesses && (
          <div className="glass-inset p-2 rounded-lg">
            <div className="text-[10px] text-4 uppercase tracking-wider mb-1">Weaknesses</div>
            <p className="text-xs text-2 line-clamp-2 leading-relaxed">{competitor.weaknesses}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function PatternCard({ pattern }: { pattern: any }) {
  const typeColors: Record<string, string> = {
    thread: 'bg-purple-500/15 text-purple-400',
    post: 'bg-blue-500/15 text-blue-400',
    video: 'bg-rose-500/15 text-rose-400',
    article: 'bg-amber-500/15 text-amber-400',
  }

  const typeColor = typeColors[pattern.type] || 'bg-gray-500/15 text-gray-400'

  return (
    <div className="glass-card p-4 space-y-3">
      <div>
        <h3 className="text-sm font-medium text-1">{pattern.name}</h3>
        {pattern.description && (
          <p className="text-xs text-3 mt-1 line-clamp-2 leading-relaxed">{pattern.description}</p>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[rgb(var(--glass-border))]">
        {pattern.type && (
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${typeColor}`}>
            {pattern.type}
          </span>
        )}
        {pattern.effectiveness_score != null && (
          <div className="flex items-center gap-1">
            <LineChart className="w-3 h-3 text-green-400" />
            <span className="text-xs text-green-400 tabular-nums">{pattern.effectiveness_score}%</span>
          </div>
        )}
      </div>
    </div>
  )
}

function LogEntry({ log }: { log: any }) {
  // findings can be a string, object, or null — safely convert
  const findingsText = typeof log.findings === 'string' ? log.findings : null
  const insights: string[] = Array.isArray(log.key_insights) ? log.key_insights : []
  const actions: string[] = Array.isArray(log.action_items) ? log.action_items : []

  return (
    <div className="glass-inset p-3 rounded-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {log.topic && (
            <h4 className="text-sm font-medium text-1 mb-1">{log.topic}</h4>
          )}
          {log.source && (
            <p className="text-[10px] text-4 mb-1">{String(log.source)}</p>
          )}
          {findingsText && (
            <p className="text-xs text-2 line-clamp-2 leading-relaxed">{findingsText}</p>
          )}
          {insights.length > 0 && (
            <div className="mt-2 space-y-1">
              {insights.slice(0, 4).map((insight, i) => (
                <p key={i} className="text-[11px] text-3 leading-relaxed">• {String(insight)}</p>
              ))}
              {insights.length > 4 && (
                <p className="text-[10px] text-4">+{insights.length - 4} more</p>
              )}
            </div>
          )}
          {actions.length > 0 && (
            <div className="mt-2 space-y-1">
              {actions.map((action, i) => (
                <p key={i} className="text-[11px] text-amber-400/80 leading-relaxed">→ {String(action)}</p>
              ))}
            </div>
          )}
        </div>
        {log.created_at && (
          <span className="text-[10px] text-4 flex-shrink-0">
            {new Date(log.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>
    </div>
  )
}
