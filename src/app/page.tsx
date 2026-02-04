import { createAdminClient } from '@/lib/supabase/admin'
import {
  Eye,
  Heart,
  Repeat2,
  MessageCircle,
  BarChart3,
  Clock,
  DollarSign,
  ExternalLink,
  Activity,
  ArrowUpRight,
  Bookmark,
  TrendingUp,
  Zap,
  AlertTriangle,
} from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// ───────────────────────── DATA FETCHING ─────────────────────────

async function getDashboardData() {
  const sb = createAdminClient()

  const [
    { data: posts },
    { data: engagements },
    { data: dailyMetrics },
    { data: dailyCosts },
  ] = await Promise.all([
    sb.from('nex_x_post_metrics')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200),
    sb.from('nex_x_engagements')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20),
    sb.from('nex_x_daily_metrics')
      .select('*')
      .order('date', { ascending: false })
      .limit(7),
    sb.from('nex_daily_costs')
      .select('*')
      .order('date', { ascending: false })
      .limit(7),
  ])

  const allPosts = posts || []
  const totalImpressions = allPosts.reduce((s: number, p: any) => s + (p.impressions || 0), 0)
  const totalLikes = allPosts.reduce((s: number, p: any) => s + (p.likes || 0), 0)
  const totalRetweets = allPosts.reduce((s: number, p: any) => s + (p.retweets || 0), 0)
  const totalReplies = allPosts.reduce((s: number, p: any) => s + (p.replies || 0), 0)
  const totalBookmarks = allPosts.reduce((s: number, p: any) => s + (p.bookmarks || 0), 0)
  const avgEngagement = allPosts.length > 0
    ? allPosts.reduce((s: number, p: any) => s + (p.engagement_rate || 0), 0) / allPosts.length
    : 0

  const originals = allPosts.filter((p: any) => p.tweet_type === 'original')
  const replies = allPosts.filter((p: any) => p.tweet_type === 'reply')

  // Top performers (min 50 impressions)
  const topPerformers = [...allPosts]
    .filter((p: any) => (p.impressions || 0) > 50)
    .sort((a: any, b: any) => (b.engagement_rate || 0) - (a.engagement_rate || 0))
    .slice(0, 5)

  // Recent posts (last 15)
  const recentPosts = allPosts.slice(0, 15)

  // Posts with zero engagement after 6+ hours
  const sixHoursAgo = Date.now() - 6 * 60 * 60 * 1000
  const deadPosts = allPosts.filter((p: any) => 
    new Date(p.created_at).getTime() < sixHoursAgo && 
    (p.likes || 0) === 0 && (p.retweets || 0) === 0 && (p.replies || 0) === 0
  )

  // Best performing post
  const bestPost = [...allPosts]
    .filter((p: any) => (p.impressions || 0) > 20)
    .sort((a: any, b: any) => (b.engagement_rate || 0) - (a.engagement_rate || 0))[0]

  // Worst ratio: high impressions, zero engagement
  const worstRatio = [...allPosts]
    .filter((p: any) => (p.impressions || 0) > 100 && (p.likes || 0) === 0)
    .sort((a: any, b: any) => (b.impressions || 0) - (a.impressions || 0))[0]

  // Posts in last 24h
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000
  const last24h = allPosts.filter((p: any) => new Date(p.created_at).getTime() > oneDayAgo)
  const last24hImpressions = last24h.reduce((s: number, p: any) => s + (p.impressions || 0), 0)
  const last24hLikes = last24h.reduce((s: number, p: any) => s + (p.likes || 0), 0)

  // Reply vs original performance
  const replyAvgER = replies.length > 0
    ? replies.reduce((s: number, p: any) => s + (p.engagement_rate || 0), 0) / replies.length
    : 0
  const originalAvgER = originals.length > 0
    ? originals.reduce((s: number, p: any) => s + (p.engagement_rate || 0), 0) / originals.length
    : 0

  const todayCost = dailyCosts?.[0] || null

  return {
    stats: {
      totalPosts: allPosts.length,
      totalImpressions,
      totalLikes,
      totalRetweets,
      totalReplies,
      totalBookmarks,
      avgEngagement: Math.round(avgEngagement * 100) / 100,
      originals: originals.length,
      replies: replies.length,
      replyAvgER: Math.round(replyAvgER * 100) / 100,
      originalAvgER: Math.round(originalAvgER * 100) / 100,
    },
    topPerformers,
    recentPosts,
    engagements: engagements || [],
    todayCost,
    last24h: {
      count: last24h.length,
      impressions: last24hImpressions,
      likes: last24hLikes,
    },
    deadPosts: deadPosts.length,
    bestPost,
    worstRatio,
  }
}

// ───────────────────────── INSIGHT ENGINE ─────────────────────────

function generateInsight(data: Awaited<ReturnType<typeof getDashboardData>>): {
  greeting: string
  insight: string
  mood: 'good' | 'neutral' | 'alert'
} {
  const hour = new Date().getHours()
  const timeGreeting = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening'

  // Build a smart insight based on actual data patterns
  const insights: { text: string; mood: 'good' | 'neutral' | 'alert'; weight: number }[] = []

  // Best performer callout
  if (data.bestPost && data.bestPost.engagement_rate > 1) {
    insights.push({
      text: `Our best post hit ${data.bestPost.engagement_rate}% ER with ${data.bestPost.impressions} views. Replies to people with audiences are still our best move.`,
      mood: 'good',
      weight: 3,
    })
  }

  // Reply vs original insight
  if (data.stats.replyAvgER > data.stats.originalAvgER * 2) {
    insights.push({
      text: `Replies are outperforming originals ${data.stats.replyAvgER}% vs ${data.stats.originalAvgER}% ER. The reply-first growth strategy is working. Keep engaging, the original content will land harder once we have the audience.`,
      mood: 'good',
      weight: 4,
    })
  }

  // Dead posts warning
  if (data.deadPosts > 10) {
    insights.push({
      text: `${data.deadPosts} posts have zero engagement after 6+ hours. Most are replies to smaller accounts. We should be pickier about who we reply to, or make the replies more standalone-valuable.`,
      mood: 'alert',
      weight: 5,
    })
  }

  // High impressions no engagement
  if (data.worstRatio) {
    insights.push({
      text: `One post got ${data.worstRatio.impressions} impressions but zero likes. The reach is there but the content didn't resonate. Worth studying what missed.`,
      mood: 'alert',
      weight: 2,
    })
  }

  // 24h velocity
  if (data.last24h.count > 0) {
    const pace = data.last24h.impressions / data.last24h.count
    insights.push({
      text: `Last 24h: ${data.last24h.count} posts, ${data.last24h.impressions.toLocaleString()} impressions (${Math.round(pace)}/post avg). ${data.last24h.likes} likes.`,
      mood: data.last24h.likes > 5 ? 'good' : 'neutral',
      weight: 1,
    })
  }

  // Cost efficiency
  if (data.todayCost && data.todayCost.total_cost_usd < 0.10) {
    insights.push({
      text: `Running at $${data.todayCost.total_cost_usd.toFixed(2)}/day. ${data.todayCost.tweets_posted} tweets for pocket change. The Haiku/Sonnet tiering is paying off.`,
      mood: 'good',
      weight: 2,
    })
  }

  // Milestone callouts
  if (data.stats.totalImpressions > 4000 && data.stats.totalImpressions < 5000) {
    insights.push({
      text: `We're at ${data.stats.totalImpressions.toLocaleString()} impressions. Closing in on 5k. The jsrailton reply alone drove 680 of those. One good reply to the right person > 20 original posts.`,
      mood: 'good',
      weight: 3,
    })
  }

  // Pick the highest weight insight
  insights.sort((a, b) => b.weight - a.weight)
  const picked = insights[0] || { text: `${data.stats.totalPosts} posts tracked. Building the data.`, mood: 'neutral' as const }

  return {
    greeting: `${timeGreeting}, Galen`,
    insight: picked.text,
    mood: picked.mood,
  }
}

// ───────────────────────── PAGE ─────────────────────────

export default async function Dashboard() {
  const data = await getDashboardData()
  const { greeting, insight, mood } = generateInsight(data)

  return (
    <div className="min-h-screen p-6 lg:p-8 animate-in">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header — This is me talking */}
        <header>
          <div className="flex items-start justify-between">
            <div className="max-w-2xl">
              <h1 className="text-[28px] font-semibold tracking-tight text-1">
                {greeting}
              </h1>
              <p className={`text-sm mt-2 leading-relaxed ${
                mood === 'good' ? 'text-green-400/90' :
                mood === 'alert' ? 'text-amber-400/90' :
                'text-2'
              }`}>
                {insight}
              </p>
            </div>
            <a
              href="https://x.com/sentigen_ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-xl glass-inset text-xs text-3 hover:text-1 transition-colors flex-shrink-0"
            >
              <XIcon className="w-3.5 h-3.5" />
              @sentigen_ai
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </header>

        {/* Hero Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <HeroStat icon={Eye} value={data.stats.totalImpressions.toLocaleString()} label="Impressions" color="blue" />
          <HeroStat icon={Heart} value={data.stats.totalLikes.toString()} label="Likes" color="rose" />
          <HeroStat icon={Repeat2} value={data.stats.totalRetweets.toString()} label="Retweets" color="green" />
          <HeroStat icon={MessageCircle} value={data.stats.totalReplies.toString()} label="Replies" color="purple" />
          <HeroStat icon={BarChart3} value={`${data.stats.avgEngagement}%`} label="Avg ER" color="amber" />
          <HeroStat icon={Bookmark} value={data.stats.totalBookmarks.toString()} label="Bookmarks" color="cyan" />
        </div>

        {/* Breakdown bar */}
        <div className="flex gap-3 flex-wrap">
          <div className="glass-panel px-4 py-3 flex items-center gap-3">
            <span className="text-xs text-3">Original</span>
            <span className="text-sm font-semibold text-1">{data.stats.originals}</span>
            <span className="text-[10px] text-4">{data.stats.originalAvgER}% avg ER</span>
          </div>
          <div className="glass-panel px-4 py-3 flex items-center gap-3">
            <span className="text-xs text-3">Replies</span>
            <span className="text-sm font-semibold text-1">{data.stats.replies}</span>
            <span className="text-[10px] text-4">{data.stats.replyAvgER}% avg ER</span>
          </div>
          {data.deadPosts > 0 && (
            <div className="glass-panel px-4 py-3 flex items-center gap-3">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs text-3">{data.deadPosts} zero-engagement</span>
              <span className="text-[10px] text-4">6h+</span>
            </div>
          )}
          {data.todayCost && (
            <div className="glass-panel px-4 py-3 flex items-center gap-3 ml-auto">
              <DollarSign className="w-3.5 h-3.5 text-3" />
              <span className="text-xs text-3">Today</span>
              <span className="text-sm font-semibold text-1">${(data.todayCost.total_cost_usd || 0).toFixed(2)}</span>
              <span className="text-[10px] text-4">{data.todayCost.tweets_posted} tweets</span>
            </div>
          )}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Top Performers */}
          <div className="lg:col-span-2 glass-panel">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[rgb(var(--glass-border))]">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <h2 className="text-[15px] font-medium text-1">What&apos;s Working</h2>
              </div>
              <span className="text-[10px] text-4">50+ impressions</span>
            </div>
            <div className="divide-y divide-[rgb(var(--glass-border))]">
              {data.topPerformers.map((post: any, idx: number) => (
                <a
                  key={post.id}
                  href={`https://x.com/sentigen_ai/status/${post.tweet_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-4 flex gap-4 hover:bg-[rgb(var(--glass-inset))] transition-colors group block"
                >
                  <div className="flex-shrink-0 w-7 h-7 rounded-lg glass-inset flex items-center justify-center text-xs font-bold text-3">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-1 line-clamp-2 leading-relaxed group-hover:text-blue-400 transition-colors">
                      {post.tweet_text}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <MiniStat icon={Eye} value={post.impressions} />
                      <MiniStat icon={Heart} value={post.likes} color="rose" />
                      <MiniStat icon={Repeat2} value={post.retweets} color="green" />
                      <MiniStat icon={MessageCircle} value={post.replies} color="purple" />
                      <span className="text-[10px] font-medium text-amber-400 ml-auto">
                        {post.engagement_rate}% ER
                      </span>
                      <ExternalLink className="w-3 h-3 text-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </a>
              ))}
              {data.topPerformers.length === 0 && (
                <div className="px-6 py-8 text-center text-sm text-4">
                  No posts with 50+ impressions yet
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">

            {/* Engagement Activity */}
            <div className="glass-panel">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[rgb(var(--glass-border))]">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-400" />
                  <h2 className="text-[14px] font-medium text-1">Engagements</h2>
                </div>
                <span className="text-[10px] text-4">{data.engagements.length} tracked</span>
              </div>
              <div className="max-h-[280px] overflow-y-auto">
                {data.engagements.slice(0, 8).map((eng: any) => (
                  <div key={eng.id} className="px-4 py-3 border-b border-[rgb(var(--glass-border))] last:border-0">
                    <div className="flex items-start gap-3">
                      <div className={`
                        w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5
                        ${eng.engagement_type === 'reply' ? 'bg-purple-500/15' : 'bg-blue-500/15'}
                      `}>
                        {eng.engagement_type === 'reply' ? (
                          <MessageCircle className="w-3 h-3 text-purple-400" />
                        ) : (
                          <ArrowUpRight className="w-3 h-3 text-blue-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-2 line-clamp-2">
                          {eng.our_content || eng.trigger_content}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {eng.trigger_author && (
                            <span className="text-[10px] text-3">→ @{eng.trigger_author}</span>
                          )}
                          {eng.tone && (
                            <span className="text-[10px] text-4">{eng.tone}</span>
                          )}
                          {eng.engagement_rate > 0 && (
                            <span className="text-[10px] text-amber-400 ml-auto">{eng.engagement_rate}%</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {data.engagements.length === 0 && (
                  <div className="px-6 py-8 text-center text-sm text-4">No engagements logged yet</div>
                )}
              </div>
            </div>

            {/* Costs */}
            <div className="glass-panel">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[rgb(var(--glass-border))]">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <h2 className="text-[14px] font-medium text-1">Costs</h2>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {data.todayCost ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-3">Today</span>
                      <span className="text-sm font-semibold text-1">${(data.todayCost.total_cost_usd || 0).toFixed(4)}</span>
                    </div>
                    <div className="space-y-2">
                      <CostRow label="X API requests" value={data.todayCost.x_api_requests || 0} />
                      <CostRow label="OpenAI tokens" value={(data.todayCost.openai_tokens || 0).toLocaleString()} cost={data.todayCost.openai_cost_usd} />
                      <CostRow label="Gemini requests" value={data.todayCost.gemini_requests || 0} cost={data.todayCost.gemini_cost_usd} />
                      <CostRow label="Images generated" value={data.todayCost.images_generated || 0} />
                      <CostRow label="Tweets posted" value={data.todayCost.tweets_posted || 0} />
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-4 text-center py-4">No cost data today</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Posts — every row links to X */}
        <div className="glass-panel">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[rgb(var(--glass-border))]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-3" />
              <h2 className="text-[15px] font-medium text-1">Recent Posts</h2>
            </div>
            <Link href="/x" className="text-xs text-3 hover:text-2 flex items-center gap-1 transition-colors">
              All Posts <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgb(var(--glass-border))]">
                  <th className="text-left text-[10px] text-4 font-medium uppercase tracking-wider px-6 py-3">Post</th>
                  <th className="text-center text-[10px] text-4 font-medium uppercase tracking-wider px-3 py-3 w-16">Type</th>
                  <th className="text-right text-[10px] text-4 font-medium uppercase tracking-wider px-3 py-3 w-20"><Eye className="w-3 h-3 inline" /></th>
                  <th className="text-right text-[10px] text-4 font-medium uppercase tracking-wider px-3 py-3 w-16"><Heart className="w-3 h-3 inline" /></th>
                  <th className="text-right text-[10px] text-4 font-medium uppercase tracking-wider px-3 py-3 w-16"><Repeat2 className="w-3 h-3 inline" /></th>
                  <th className="text-right text-[10px] text-4 font-medium uppercase tracking-wider px-3 py-3 w-20">ER</th>
                  <th className="text-right text-[10px] text-4 font-medium uppercase tracking-wider px-6 py-3 w-28">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgb(var(--glass-border))]">
                {data.recentPosts.map((post: any) => (
                  <tr key={post.id} className="hover:bg-[rgb(var(--glass-inset))] transition-colors group">
                    <td className="px-6 py-3">
                      <a
                        href={`https://x.com/sentigen_ai/status/${post.tweet_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <p className="text-[12px] text-2 line-clamp-1 max-w-md group-hover:text-blue-400 transition-colors">
                          {post.tweet_text}
                        </p>
                        <ExternalLink className="w-3 h-3 text-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </a>
                    </td>
                    <td className="text-center px-3 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        post.tweet_type === 'original'
                          ? 'bg-blue-500/15 text-blue-400'
                          : 'bg-purple-500/15 text-purple-400'
                      }`}>
                        {post.tweet_type}
                      </span>
                    </td>
                    <td className="text-right px-3 py-3 text-[12px] text-2 tabular-nums">
                      {(post.impressions || 0).toLocaleString()}
                    </td>
                    <td className="text-right px-3 py-3 text-[12px] tabular-nums">
                      <span className={(post.likes || 0) > 0 ? 'text-rose-400' : 'text-4'}>{post.likes || 0}</span>
                    </td>
                    <td className="text-right px-3 py-3 text-[12px] tabular-nums">
                      <span className={(post.retweets || 0) > 0 ? 'text-green-400' : 'text-4'}>{post.retweets || 0}</span>
                    </td>
                    <td className="text-right px-3 py-3">
                      <span className={`text-[11px] font-medium tabular-nums ${
                        (post.engagement_rate || 0) > 1 ? 'text-green-400' :
                        (post.engagement_rate || 0) > 0.5 ? 'text-amber-400' :
                        'text-3'
                      }`}>
                        {(post.engagement_rate || 0).toFixed(2)}%
                      </span>
                    </td>
                    <td className="text-right px-6 py-3 text-[11px] text-4 tabular-nums">
                      {formatRelativeTime(post.created_at)}
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

// ───────────────────────── COMPONENTS ─────────────────────────

function XIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}

function HeroStat({ icon: Icon, value, label, color }: { icon: any; value: string; label: string; color: string }) {
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

function MiniStat({ icon: Icon, value, color = 'default' }: { icon: any; value: number; color?: string }) {
  const colorMap: Record<string, string> = { default: 'text-3', rose: 'text-rose-400', green: 'text-green-400', purple: 'text-purple-400' }
  return (
    <div className="flex items-center gap-1">
      <Icon className={`w-3 h-3 ${colorMap[color]}`} />
      <span className="text-[11px] text-3 tabular-nums">{value}</span>
    </div>
  )
}

function CostRow({ label, value, cost }: { label: string; value: number | string; cost?: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-4">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-3 tabular-nums">{value}</span>
        {cost !== undefined && cost > 0 && <span className="text-[10px] text-4 tabular-nums">${cost.toFixed(4)}</span>}
      </div>
    </div>
  )
}

function formatRelativeTime(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHr < 24) return `${diffHr}h ago`
  if (diffDay < 7) return `${diffDay}d ago`
  return date.toLocaleDateString('en', { month: 'short', day: 'numeric' })
}
