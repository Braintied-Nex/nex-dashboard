import { createAdminClient } from '@/lib/supabase/admin'
import { Target, Users, Calendar, PieChart, MessageSquare, Sparkles } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function StrategyPage() {
  const sb = createAdminClient()

  const [{ data: strategies }, { data: xStrategy }] = await Promise.all([
    sb.from('nex_strategy').select('*').order('platform'),
    sb.from('nex_x_strategy').select('*').single(),
  ])

  const allStrategies = strategies || []

  return (
    <div className="min-h-screen p-6 lg:p-8 animate-in">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header>
          <h1 className="text-[28px] font-semibold tracking-tight text-1">
            Content Strategy
          </h1>
          <p className="text-2 text-sm mt-1">
            Multi-platform content strategy and guidelines
          </p>
        </header>

        {/* X Strategy Highlight */}
        {xStrategy && (
          <div className="glass-panel p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <XIcon className="w-4 h-4 text-1" />
                  <h2 className="text-lg font-semibold text-1">X / Twitter Strategy</h2>
                </div>
                <p className="text-xs text-3 max-w-2xl leading-relaxed">
                  Primary platform for thought leadership and community engagement
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Voice */}
              {xStrategy.voice && (
                <div className="glass-inset p-4 space-y-2">
                  <div className="flex items-center gap-2 text-4">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="text-[10px] uppercase tracking-wider font-medium">Voice</span>
                  </div>
                  <p className="text-sm text-2 leading-relaxed">{xStrategy.voice}</p>
                </div>
              )}

              {/* Themes */}
              {xStrategy.themes && Array.isArray(xStrategy.themes) && xStrategy.themes.length > 0 && (
                <div className="glass-inset p-4 space-y-2">
                  <div className="flex items-center gap-2 text-4">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="text-[10px] uppercase tracking-wider font-medium">Themes</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {xStrategy.themes.map((theme: any, i: number) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-full bg-blue-500/15 text-blue-400">
                        {String(theme)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Reply Patterns */}
              {xStrategy.reply_patterns && (
                <div className="glass-inset p-4 space-y-2">
                  <div className="flex items-center gap-2 text-4">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="text-[10px] uppercase tracking-wider font-medium">Reply Patterns</span>
                  </div>
                  <p className="text-sm text-2 leading-relaxed">{xStrategy.reply_patterns}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Platform Strategies */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {allStrategies.map((strategy) => (
            <StrategyCard key={strategy.id} strategy={strategy} />
          ))}
        </div>
      </div>
    </div>
  )
}

function StrategyCard({ strategy }: { strategy: any }) {
  const platformColors: Record<string, string> = {
    x: 'bg-blue-500/15 text-blue-400',
    twitter: 'bg-blue-500/15 text-blue-400',
    linkedin: 'bg-cyan-500/15 text-cyan-400',
    substack: 'bg-amber-500/15 text-amber-400',
    youtube: 'bg-rose-500/15 text-rose-400',
    tiktok: 'bg-purple-500/15 text-purple-400',
  }

  const platformColor = platformColors[strategy.platform?.toLowerCase()] || 'bg-gray-500/15 text-gray-400'

  return (
    <div className="glass-card p-5 space-y-4">
      {/* Platform Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${platformColor}`}>
            {strategy.platform}
          </span>
          {strategy.status && (
            <span className="text-[10px] text-4 uppercase tracking-wider">
              {strategy.status}
            </span>
          )}
        </div>
      </div>

      {/* Goals */}
      {strategy.goals && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-4">
            <Target className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase tracking-wider font-medium">Goals</span>
          </div>
          <p className="text-sm text-2 leading-relaxed">{strategy.goals}</p>
        </div>
      )}

      {/* Target Audience */}
      {strategy.target_audience && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-4">
            <Users className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase tracking-wider font-medium">Target Audience</span>
          </div>
          <p className="text-sm text-2 leading-relaxed">{strategy.target_audience}</p>
        </div>
      )}

      {/* Posting Frequency */}
      {strategy.posting_frequency && (
        <div className="flex items-center gap-3 pt-3 border-t border-[rgb(var(--glass-border))]">
          <div className="flex items-center gap-1.5 text-3">
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-xs">{strategy.posting_frequency}</span>
          </div>
        </div>
      )}

      {/* Content Mix */}
      {strategy.content_mix && strategy.content_mix.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-4">
            <PieChart className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase tracking-wider font-medium">Content Mix</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {strategy.content_mix.map((type: string, i: number) => (
              <span key={i} className="text-xs px-2 py-0.5 rounded glass-inset text-3">
                {type}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function XIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}
