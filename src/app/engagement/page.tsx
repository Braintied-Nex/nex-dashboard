import { createAdminClient } from '@/lib/supabase/admin'
import {
  MessageCircle,
  Heart,
  Eye,
  Repeat2,
  ExternalLink,
  ArrowUpRight,
  TrendingUp,
  Users,
} from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function EngagementPage() {
  const sb = createAdminClient()

  const { data: engagements } = await sb
    .from('nex_x_engagements')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  const all = engagements || []

  // Stats
  const totalEngagements = all.length
  const withMetrics = all.filter((e: any) => (e.impressions || 0) > 0)
  const totalImpressions = all.reduce((s: number, e: any) => s + (e.impressions || 0), 0)
  const totalLikes = all.reduce((s: number, e: any) => s + (e.likes || 0), 0)
  const avgER = withMetrics.length > 0
    ? withMetrics.reduce((s: number, e: any) => s + (e.engagement_rate || 0), 0) / withMetrics.length
    : 0

  // Unique authors engaged with
  const uniqueAuthors = new Set(all.map((e: any) => e.trigger_author).filter(Boolean))

  // Tone breakdown
  const tones: Record<string, number> = {}
  for (const e of all) {
    const tone = (e as any).tone || 'unknown'
    tones[tone] = (tones[tone] || 0) + 1
  }

  // Type breakdown
  const types: Record<string, number> = {}
  for (const e of all) {
    const t = (e as any).engagement_type || 'unknown'
    types[t] = (types[t] || 0) + 1
  }

  return (
    <div className="min-h-screen p-6 lg:p-8 animate-in">
      <div className="max-w-6xl mx-auto space-y-6">

        <header>
          <h1 className="text-[28px] font-semibold tracking-tight text-1">Engagement</h1>
          <p className="text-2 text-sm mt-1">
            {totalEngagements} engagements with {uniqueAuthors.size} people
          </p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <StatCard label="Engagements" value={totalEngagements.toString()} icon={MessageCircle} />
          <StatCard label="People" value={uniqueAuthors.size.toString()} icon={Users} />
          <StatCard label="Impressions" value={totalImpressions.toLocaleString()} icon={Eye} />
          <StatCard label="Likes Earned" value={totalLikes.toString()} icon={Heart} />
          <StatCard label="Avg ER" value={`${avgER.toFixed(2)}%`} icon={TrendingUp} />
        </div>

        {/* Breakdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* By Type */}
          <div className="glass-panel p-5">
            <h3 className="text-[13px] font-medium text-2 mb-3">By Type</h3>
            <div className="space-y-2">
              {Object.entries(types).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-[12px] text-3 capitalize">{type}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 rounded-full bg-[rgb(var(--glass-inset))] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-purple-400/60"
                        style={{ width: `${(count / totalEngagements) * 100}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-2 tabular-nums w-6 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* By Tone */}
          <div className="glass-panel p-5">
            <h3 className="text-[13px] font-medium text-2 mb-3">By Tone</h3>
            <div className="space-y-2">
              {Object.entries(tones).sort((a, b) => b[1] - a[1]).map(([tone, count]) => (
                <div key={tone} className="flex items-center justify-between">
                  <span className="text-[12px] text-3 capitalize">{tone}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 rounded-full bg-[rgb(var(--glass-inset))] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-400/60"
                        style={{ width: `${(count / totalEngagements) * 100}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-2 tabular-nums w-6 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Engagement Table */}
        <div className="glass-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgb(var(--glass-border))]">
                  <th className="text-left text-[10px] text-4 font-medium uppercase tracking-wider px-6 py-3">Our Reply</th>
                  <th className="text-left text-[10px] text-4 font-medium uppercase tracking-wider px-3 py-3 w-28">To</th>
                  <th className="text-center text-[10px] text-4 font-medium uppercase tracking-wider px-3 py-3 w-20">Tone</th>
                  <th className="text-right text-[10px] text-4 font-medium uppercase tracking-wider px-3 py-3 w-20"><Eye className="w-3 h-3 inline" /></th>
                  <th className="text-right text-[10px] text-4 font-medium uppercase tracking-wider px-3 py-3 w-16"><Heart className="w-3 h-3 inline" /></th>
                  <th className="text-right text-[10px] text-4 font-medium uppercase tracking-wider px-3 py-3 w-20">ER</th>
                  <th className="text-right text-[10px] text-4 font-medium uppercase tracking-wider px-6 py-3 w-32">When</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgb(var(--glass-border))]">
                {all.map((eng: any) => (
                  <tr key={eng.id} className="hover:bg-[rgb(var(--glass-inset))] transition-colors group">
                    <td className="px-6 py-3">
                      <a
                        href={eng.our_tweet_id ? `https://x.com/sentigen_ai/status/${eng.our_tweet_id}` : '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <p className="text-[12px] text-2 line-clamp-2 max-w-sm group-hover:text-blue-400 transition-colors leading-relaxed">
                          {eng.our_content || '—'}
                        </p>
                        {eng.our_tweet_id && (
                          <ExternalLink className="w-3 h-3 text-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                        )}
                      </a>
                    </td>
                    <td className="px-3 py-3">
                      {eng.trigger_author ? (
                        <a
                          href={`https://x.com/${eng.trigger_author}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-3 hover:text-blue-400 transition-colors"
                        >
                          @{eng.trigger_author}
                        </a>
                      ) : (
                        <span className="text-[11px] text-4">—</span>
                      )}
                    </td>
                    <td className="text-center px-3 py-3">
                      {eng.tone ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgb(var(--glass-inset))] text-3 capitalize">
                          {eng.tone}
                        </span>
                      ) : (
                        <span className="text-[10px] text-4">—</span>
                      )}
                    </td>
                    <td className="text-right px-3 py-3 text-[12px] text-2 tabular-nums">
                      {(eng.impressions || 0) > 0 ? eng.impressions.toLocaleString() : '—'}
                    </td>
                    <td className="text-right px-3 py-3 text-[12px] tabular-nums">
                      <span className={(eng.likes || 0) > 0 ? 'text-rose-400' : 'text-4'}>
                        {(eng.likes || 0) > 0 ? eng.likes : '—'}
                      </span>
                    </td>
                    <td className="text-right px-3 py-3">
                      {(eng.engagement_rate || 0) > 0 ? (
                        <span className={`text-[11px] font-medium tabular-nums ${
                          eng.engagement_rate > 1 ? 'text-green-400' :
                          eng.engagement_rate > 0.5 ? 'text-amber-400' : 'text-3'
                        }`}>
                          {eng.engagement_rate}%
                        </span>
                      ) : (
                        <span className="text-[11px] text-4">—</span>
                      )}
                    </td>
                    <td className="text-right px-6 py-3 text-[11px] text-4 tabular-nums">
                      {formatTime(eng.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="glass-panel p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-3.5 h-3.5 text-3" />
        <span className="text-[10px] text-4 uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-[20px] font-semibold text-1 tracking-tight tabular-nums">{value}</div>
    </div>
  )
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en', { month: 'short', day: 'numeric' }) + ' ' +
    d.toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit' })
}
