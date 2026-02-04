import { createAdminClient } from '@/lib/supabase/admin'
import {
  BarChart3,
  Eye,
  Heart,
  Repeat2,
  MessageCircle,
  Bookmark,
  TrendingUp,
  Clock,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AnalyticsPage() {
  const sb = createAdminClient()

  const [{ data: posts }, { data: engagements }, { data: dailyCosts }] = await Promise.all([
    sb.from('nex_x_post_metrics')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200),
    sb.from('nex_x_engagements')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100),
    sb.from('nex_daily_costs')
      .select('*')
      .order('date', { ascending: false })
      .limit(30),
  ])

  const all = posts || []
  const allEng = engagements || []

  // Overall stats
  const totalImpressions = all.reduce((s: number, p: any) => s + (p.impressions || 0), 0)
  const totalLikes = all.reduce((s: number, p: any) => s + (p.likes || 0), 0)
  const totalRetweets = all.reduce((s: number, p: any) => s + (p.retweets || 0), 0)
  const totalReplies = all.reduce((s: number, p: any) => s + (p.replies || 0), 0)
  const totalBookmarks = all.reduce((s: number, p: any) => s + (p.bookmarks || 0), 0)
  const avgER = all.length > 0
    ? all.reduce((s: number, p: any) => s + (p.engagement_rate || 0), 0) / all.length
    : 0

  // Originals vs Replies
  const originals = all.filter((p: any) => p.tweet_type === 'original')
  const replies = all.filter((p: any) => p.tweet_type === 'reply')

  const originalStats = {
    count: originals.length,
    impressions: originals.reduce((s: number, p: any) => s + (p.impressions || 0), 0),
    likes: originals.reduce((s: number, p: any) => s + (p.likes || 0), 0),
    avgER: originals.length > 0
      ? originals.reduce((s: number, p: any) => s + (p.engagement_rate || 0), 0) / originals.length
      : 0,
  }

  const replyStats = {
    count: replies.length,
    impressions: replies.reduce((s: number, p: any) => s + (p.impressions || 0), 0),
    likes: replies.reduce((s: number, p: any) => s + (p.likes || 0), 0),
    avgER: replies.length > 0
      ? replies.reduce((s: number, p: any) => s + (p.engagement_rate || 0), 0) / replies.length
      : 0,
  }

  // Hourly distribution
  const hourlyDist: Record<number, { count: number; impressions: number; likes: number }> = {}
  for (const p of all) {
    const h = new Date((p as any).created_at).getHours()
    if (!hourlyDist[h]) hourlyDist[h] = { count: 0, impressions: 0, likes: 0 }
    hourlyDist[h].count++
    hourlyDist[h].impressions += (p as any).impressions || 0
    hourlyDist[h].likes += (p as any).likes || 0
  }

  // Find best hour
  let bestHour = 0
  let bestHourER = 0
  for (const [h, data] of Object.entries(hourlyDist)) {
    const er = data.impressions > 0 ? (data.likes / data.impressions) * 100 : 0
    if (er > bestHourER) {
      bestHourER = er
      bestHour = parseInt(h)
    }
  }

  // Top 10 posts by impressions
  const topByImpressions = [...all]
    .sort((a: any, b: any) => (b.impressions || 0) - (a.impressions || 0))
    .slice(0, 10)

  // Top 10 by engagement rate (min 20 impressions)
  const topByER = [...all]
    .filter((p: any) => (p.impressions || 0) > 20)
    .sort((a: any, b: any) => (b.engagement_rate || 0) - (a.engagement_rate || 0))
    .slice(0, 10)

  // Cost summary
  const totalCost = (dailyCosts || []).reduce((s: number, c: any) => s + (c.total_cost_usd || 0), 0)
  const costPerImpression = totalImpressions > 0 ? totalCost / totalImpressions : 0
  const costPerLike = totalLikes > 0 ? totalCost / totalLikes : 0

  return (
    <div className="min-h-screen p-6 lg:p-8 animate-in">
      <div className="max-w-7xl mx-auto space-y-6">

        <header>
          <h1 className="text-[28px] font-semibold tracking-tight text-1">Analytics</h1>
          <p className="text-2 text-sm mt-1">
            {all.length} posts · {totalImpressions.toLocaleString()} impressions · {avgER.toFixed(2)}% avg ER
          </p>
        </header>

        {/* Big Numbers */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <BigStat label="Impressions" value={totalImpressions.toLocaleString()} icon={Eye} color="blue" />
          <BigStat label="Likes" value={totalLikes.toString()} icon={Heart} color="rose" />
          <BigStat label="Retweets" value={totalRetweets.toString()} icon={Repeat2} color="green" />
          <BigStat label="Replies" value={totalReplies.toString()} icon={MessageCircle} color="purple" />
          <BigStat label="Bookmarks" value={totalBookmarks.toString()} icon={Bookmark} color="cyan" />
          <BigStat label="Avg ER" value={`${avgER.toFixed(2)}%`} icon={TrendingUp} color="amber" />
        </div>

        {/* Original vs Reply Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-panel p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <h3 className="text-[14px] font-medium text-1">Original Posts</h3>
              <span className="text-[11px] text-4 ml-auto">{originalStats.count} posts</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-[18px] font-semibold text-1 tabular-nums">{originalStats.impressions.toLocaleString()}</div>
                <div className="text-[10px] text-4">impressions</div>
              </div>
              <div>
                <div className="text-[18px] font-semibold text-1 tabular-nums">{originalStats.likes}</div>
                <div className="text-[10px] text-4">likes</div>
              </div>
              <div>
                <div className={`text-[18px] font-semibold tabular-nums ${originalStats.avgER > 1 ? 'text-green-400' : 'text-1'}`}>
                  {originalStats.avgER.toFixed(2)}%
                </div>
                <div className="text-[10px] text-4">avg ER</div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-purple-400" />
              <h3 className="text-[14px] font-medium text-1">Replies</h3>
              <span className="text-[11px] text-4 ml-auto">{replyStats.count} posts</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-[18px] font-semibold text-1 tabular-nums">{replyStats.impressions.toLocaleString()}</div>
                <div className="text-[10px] text-4">impressions</div>
              </div>
              <div>
                <div className="text-[18px] font-semibold text-1 tabular-nums">{replyStats.likes}</div>
                <div className="text-[10px] text-4">likes</div>
              </div>
              <div>
                <div className={`text-[18px] font-semibold tabular-nums ${replyStats.avgER > 1 ? 'text-green-400' : 'text-1'}`}>
                  {replyStats.avgER.toFixed(2)}%
                </div>
                <div className="text-[10px] text-4">avg ER</div>
              </div>
            </div>
          </div>
        </div>

        {/* Insights Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-panel p-5">
            <div className="text-[11px] text-4 uppercase tracking-wider mb-2">Best Hour</div>
            <div className="text-[22px] font-semibold text-1">
              {bestHour > 12 ? bestHour - 12 : bestHour}{bestHour >= 12 ? 'pm' : 'am'}
            </div>
            <div className="text-[11px] text-3 mt-1">
              {hourlyDist[bestHour]?.count || 0} posts, {bestHourER.toFixed(1)}% ER
            </div>
          </div>

          <div className="glass-panel p-5">
            <div className="text-[11px] text-4 uppercase tracking-wider mb-2">Cost Efficiency</div>
            <div className="text-[22px] font-semibold text-1">${totalCost.toFixed(2)}</div>
            <div className="text-[11px] text-3 mt-1">
              ${(costPerImpression * 1000).toFixed(4)}/1k imp · ${costPerLike.toFixed(4)}/like
            </div>
          </div>

          <div className="glass-panel p-5">
            <div className="text-[11px] text-4 uppercase tracking-wider mb-2">Engagement Sources</div>
            <div className="text-[22px] font-semibold text-1">{allEng.length}</div>
            <div className="text-[11px] text-3 mt-1">
              {new Set(allEng.map((e: any) => e.trigger_author).filter(Boolean)).size} unique people
            </div>
          </div>
        </div>

        {/* Hourly Activity */}
        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[14px] font-medium text-1">Posts by Hour (UTC)</h3>
            <span className="text-[10px] text-4">
              Peak: {(() => {
                const maxC = Math.max(...Object.values(hourlyDist).map(d => d.count), 0)
                return maxC
              })()} posts/hr
            </span>
          </div>
          <div className="flex items-end gap-[3px] h-40">
            {Array.from({ length: 24 }, (_, h) => {
              const data = hourlyDist[h]
              const count = data?.count || 0
              const maxCount = Math.max(...Object.values(hourlyDist).map(d => d.count), 1)
              const heightPct = count > 0 ? Math.max((count / maxCount) * 100, 6) : 0
              const hasLikes = (data?.likes || 0) > 0

              return (
                <div key={h} className="flex-1 flex flex-col items-center" style={{ height: '100%' }}>
                  {/* Count label */}
                  <div className="flex-shrink-0 mb-1" style={{ minHeight: '14px' }}>
                    {count > 0 && (
                      <span className="text-[9px] text-3 tabular-nums">{count}</span>
                    )}
                  </div>

                  {/* Bar area */}
                  <div className="flex-1 w-full flex items-end">
                    <div
                      className={`w-full rounded-t-sm transition-all ${
                        count === 0
                          ? 'bg-[rgb(var(--glass-inset))]'
                          : hasLikes
                            ? 'bg-blue-400/70 hover:bg-blue-400'
                            : 'bg-blue-400/30 hover:bg-blue-400/50'
                      }`}
                      style={{ height: count > 0 ? `${heightPct}%` : '3px' }}
                      title={`${h}:00 UTC — ${count} posts, ${data?.impressions || 0} impressions, ${data?.likes || 0} likes`}
                    />
                  </div>

                  {/* Hour label */}
                  <div className="flex-shrink-0 mt-2">
                    <span className={`text-[9px] tabular-nums ${h % 3 === 0 ? 'text-3' : 'text-4/50'}`}>
                      {h === 0 ? '12a' : h < 12 ? `${h}a` : h === 12 ? '12p' : `${h - 12}p`}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[rgb(var(--glass-border))]">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-blue-400/70" />
              <span className="text-[10px] text-4">Has likes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-blue-400/30" />
              <span className="text-[10px] text-4">No likes yet</span>
            </div>
          </div>
        </div>

        {/* Top Posts Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* By Reach */}
          <div className="glass-panel">
            <div className="px-5 py-4 border-b border-[rgb(var(--glass-border))]">
              <h3 className="text-[14px] font-medium text-1">Top by Reach</h3>
            </div>
            <div className="divide-y divide-[rgb(var(--glass-border))]">
              {topByImpressions.map((post: any, idx: number) => (
                <a
                  key={post.id}
                  href={`https://x.com/sentigen_ai/status/${post.tweet_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 flex items-start gap-3 hover:bg-[rgb(var(--glass-inset))] transition-colors group block"
                >
                  <span className="text-[10px] text-4 tabular-nums w-4 pt-0.5 flex-shrink-0">{idx + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
                      {post.tweet_text}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-3 tabular-nums">{(post.impressions || 0).toLocaleString()} views</span>
                      {(post.likes || 0) > 0 && <span className="text-[10px] text-rose-400 tabular-nums">{post.likes}❤</span>}
                      <span className="text-[10px] text-4 tabular-nums">{post.engagement_rate}%</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* By Engagement Rate */}
          <div className="glass-panel">
            <div className="px-5 py-4 border-b border-[rgb(var(--glass-border))]">
              <h3 className="text-[14px] font-medium text-1">Top by Engagement Rate</h3>
              <span className="text-[10px] text-4">min 20 impressions</span>
            </div>
            <div className="divide-y divide-[rgb(var(--glass-border))]">
              {topByER.map((post: any, idx: number) => (
                <a
                  key={post.id}
                  href={`https://x.com/sentigen_ai/status/${post.tweet_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 flex items-start gap-3 hover:bg-[rgb(var(--glass-inset))] transition-colors group block"
                >
                  <span className="text-[10px] text-4 tabular-nums w-4 pt-0.5 flex-shrink-0">{idx + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
                      {post.tweet_text}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-[10px] font-medium tabular-nums ${
                        post.engagement_rate > 5 ? 'text-green-400' : 'text-amber-400'
                      }`}>{post.engagement_rate}% ER</span>
                      <span className="text-[10px] text-3 tabular-nums">{(post.impressions || 0).toLocaleString()} views</span>
                      {(post.likes || 0) > 0 && <span className="text-[10px] text-rose-400 tabular-nums">{post.likes}❤</span>}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

function BigStat({ label, value, icon: Icon, color }: { label: string; value: string; icon: any; color: string }) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500/10 text-blue-400',
    rose: 'bg-rose-500/10 text-rose-400',
    green: 'bg-green-500/10 text-green-400',
    purple: 'bg-purple-500/10 text-purple-400',
    amber: 'bg-amber-500/10 text-amber-400',
    cyan: 'bg-cyan-500/10 text-cyan-400',
  }
  return (
    <div className="glass-panel p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>
      <div className="text-[22px] font-semibold text-1 tracking-tight tabular-nums">{value}</div>
      <div className="text-[11px] text-3 mt-0.5">{label}</div>
    </div>
  )
}
