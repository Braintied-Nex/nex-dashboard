import { createAdminClient } from '@/lib/supabase/admin'
import { Lightbulb, CheckCircle2, Clock, Zap, TrendingUp } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type Status = 'captured' | 'validated' | 'queued' | 'in_progress' | 'completed'

export default async function IdeasPage() {
  const sb = createAdminClient()

  const [{ data: ideas }, { data: queue }] = await Promise.all([
    sb.from('nex_content_ideas').select('*').order('created_at', { ascending: false }),
    sb.from('nex_content_queue').select('*').order('created_at', { ascending: false }),
  ])

  const allIdeas = [...(ideas || []), ...(queue || [])]
  
  // Group by status
  const grouped: Record<Status, any[]> = {
    captured: [],
    validated: [],
    queued: [],
    in_progress: [],
    completed: [],
  }

  allIdeas.forEach((idea) => {
    const status = (idea.status || 'captured') as Status
    if (grouped[status]) {
      grouped[status].push(idea)
    }
  })

  const statusConfig: Record<Status, { label: string; icon: any; color: string }> = {
    captured: { label: 'Captured', icon: Lightbulb, color: 'text-blue-400 bg-blue-500/15' },
    validated: { label: 'Validated', icon: CheckCircle2, color: 'text-green-400 bg-green-500/15' },
    queued: { label: 'Queued', icon: Clock, color: 'text-amber-400 bg-amber-500/15' },
    in_progress: { label: 'In Progress', icon: Zap, color: 'text-purple-400 bg-purple-500/15' },
    completed: { label: 'Completed', icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-500/15' },
  }

  return (
    <div className="min-h-screen p-6 lg:p-8 animate-in">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header>
          <h1 className="text-[28px] font-semibold tracking-tight text-1">
            Content Ideas
          </h1>
          <p className="text-2 text-sm mt-1">
            {allIdeas.length} ideas across {Object.keys(grouped).filter(k => grouped[k as Status].length > 0).length} stages
          </p>
        </header>

        {/* Status Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {(Object.keys(grouped) as Status[]).map((status) => {
            const config = statusConfig[status]
            const Icon = config.icon
            const statusIdeas = grouped[status]

            return (
              <div key={status} className="space-y-3">
                {/* Column Header */}
                <div className="flex items-center gap-2 px-2">
                  <div className={`p-1.5 rounded-lg ${config.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-medium text-1">{config.label}</h2>
                    <p className="text-xs text-4">{statusIdeas.length}</p>
                  </div>
                </div>

                {/* Ideas */}
                <div className="space-y-2">
                  {statusIdeas.map((idea) => (
                    <IdeaCard key={idea.id} idea={idea} />
                  ))}
                  {statusIdeas.length === 0 && (
                    <div className="glass-inset p-4 text-center text-4 text-xs">
                      No ideas yet
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function IdeaCard({ idea }: { idea: any }) {
  const typeColors: Record<string, string> = {
    thread: 'bg-purple-500/15 text-purple-400',
    post: 'bg-blue-500/15 text-blue-400',
    article: 'bg-amber-500/15 text-amber-400',
    video: 'bg-rose-500/15 text-rose-400',
  }

  const typeColor = typeColors[idea.type || 'post'] || 'bg-gray-500/15 text-gray-400'

  return (
    <div className="glass-card p-4 space-y-3 hover:bg-[rgb(var(--glass-hover))] transition-colors cursor-pointer">
      {/* Title */}
      <h3 className="text-sm font-medium text-1 line-clamp-2 leading-tight">
        {idea.title}
      </h3>

      {/* Description */}
      {idea.description && (
        <p className="text-xs text-3 line-clamp-3 leading-relaxed">
          {idea.description}
        </p>
      )}

      {/* Meta */}
      <div className="flex items-center justify-between pt-2 border-t border-[rgb(var(--glass-border))]">
        <div className="flex items-center gap-1.5">
          {idea.type && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${typeColor}`}>
              {idea.type}
            </span>
          )}
          {idea.effort && (
            <span className="text-[10px] text-4 flex items-center gap-0.5">
              <Zap className="w-3 h-3" />
              {idea.effort}
            </span>
          )}
        </div>
        {idea.potential_score != null && (
          <div className="flex items-center gap-0.5 text-xs">
            <TrendingUp className="w-3 h-3 text-green-400" />
            <span className="text-green-400 font-medium tabular-nums">
              {idea.potential_score}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
