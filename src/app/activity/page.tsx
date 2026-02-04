import { createAdminClient } from '@/lib/supabase/admin'
import {
  Activity,
  MessageCircle,
  ArrowUpRight,
  Heart,
  Repeat2,
  Eye,
  Zap,
  ExternalLink,
} from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ActivityPage() {
  const sb = createAdminClient()

  const [{ data: engagements }, { data: recentPosts }] = await Promise.all([
    sb.from('nex_x_engagements')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50),
    sb.from('nex_x_post_metrics')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50),
  ])

  type TimelineItem = {
    id: string
    type: 'post' | 'engagement'
    time: string
    data: any
  }

  const timeline: TimelineItem[] = [
    ...(recentPosts || []).map((p: any) => ({
      id: `post-${p.id}`,
      type: 'post' as const,
      time: p.created_at,
      data: p,
    })),
    ...(engagements || []).map((e: any) => ({
      id: `eng-${e.id}`,
      type: 'engagement' as const,
      time: e.created_at,
      data: e,
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

  // Group by day
  const grouped: Record<string, TimelineItem[]> = {}
  for (const item of timeline) {
    const d = new Date(item.time)
    const key = d.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(item)
  }

  return (
    <div className="min-h-screen p-6 lg:p-8 animate-in">
      <div className="max-w-4xl mx-auto space-y-6">

        <header>
          <h1 className="text-[28px] font-semibold tracking-tight text-1">Timeline</h1>
          <p className="text-2 text-sm mt-1">{timeline.length} events</p>
        </header>

        {/* Timeline grouped by day */}
        <div className="space-y-8">
          {Object.entries(grouped).map(([day, items]) => (
            <div key={day}>
              <div className="text-xs font-medium text-3 uppercase tracking-wider mb-3 px-1">
                {day}
              </div>
              <div className="space-y-px">
                {items.map((item) => {
                  const d = new Date(item.time)
                  const timeStr = d.toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit' })

                  return (
                    <div key={item.id} className="flex gap-4 group">
                      {/* Time column */}
                      <div className="w-16 flex-shrink-0 pt-4 text-right">
                        <span className="text-[11px] text-4 tabular-nums">{timeStr}</span>
                      </div>

                      {/* Line */}
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className={`w-2 h-2 rounded-full mt-5 ${
                          item.type === 'post'
                            ? item.data.tweet_type === 'original' ? 'bg-blue-400' : 'bg-purple-400'
                            : 'bg-green-400'
                        }`} />
                        <div className="w-px flex-1 bg-[rgb(var(--glass-border))]" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-4 pt-3 min-w-0">
                        {item.type === 'post' ? (
                          <PostEntry post={item.data} />
                        ) : (
                          <EngagementEntry eng={item.data} />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PostEntry({ post }: { post: any }) {
  return (
    <a
      href={`https://x.com/sentigen_ai/status/${post.tweet_id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block glass-panel px-5 py-4 hover:bg-[rgb(var(--glass-hover))] transition-colors"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[11px] font-medium text-2">
          {post.tweet_type === 'original' ? 'Posted' : 'Replied'}
        </span>
        <ExternalLink className="w-3 h-3 text-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <p className="text-[13px] text-1 leading-relaxed line-clamp-3">
        {post.tweet_text}
      </p>
      <div className="flex items-center gap-4 mt-3">
        {(post.impressions || 0) > 0 && (
          <Stat icon={Eye} value={post.impressions} />
        )}
        {(post.likes || 0) > 0 && (
          <Stat icon={Heart} value={post.likes} color="text-rose-400" />
        )}
        {(post.retweets || 0) > 0 && (
          <Stat icon={Repeat2} value={post.retweets} color="text-green-400" />
        )}
        {(post.replies || 0) > 0 && (
          <Stat icon={MessageCircle} value={post.replies} color="text-purple-400" />
        )}
        {(post.engagement_rate || 0) > 0 && (
          <span className={`text-[10px] font-medium ml-auto tabular-nums ${
            post.engagement_rate > 1 ? 'text-green-400' :
            post.engagement_rate > 0.5 ? 'text-amber-400' : 'text-3'
          }`}>
            {post.engagement_rate}% ER
          </span>
        )}
      </div>
    </a>
  )
}

function EngagementEntry({ eng }: { eng: any }) {
  return (
    <div className="glass-panel px-5 py-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[11px] font-medium text-2">Engaged</span>
        {eng.trigger_author && (
          <span className="text-[11px] text-3">→ @{eng.trigger_author}</span>
        )}
        {eng.tone && (
          <span className="text-[10px] text-4 ml-auto">{eng.tone}</span>
        )}
      </div>
      {eng.trigger_content && (
        <p className="text-[12px] text-4 line-clamp-2 mb-2 italic">
          &ldquo;{eng.trigger_content}&rdquo;
        </p>
      )}
      {eng.our_content && (
        <p className="text-[13px] text-1 leading-relaxed line-clamp-3">
          {eng.our_content}
        </p>
      )}
      {((eng.impressions || 0) > 0 || (eng.likes || 0) > 0) && (
        <div className="flex items-center gap-3 mt-3">
          {eng.impressions > 0 && <Stat icon={Eye} value={eng.impressions} />}
          {eng.likes > 0 && <Stat icon={Heart} value={eng.likes} color="text-rose-400" />}
          {eng.engagement_rate > 0 && (
            <span className="text-[10px] text-amber-400 ml-auto tabular-nums">{eng.engagement_rate}%</span>
          )}
        </div>
      )}
    </div>
  )
}

function Stat({ icon: Icon, value, color = 'text-3' }: { icon: any; value: number; color?: string }) {
  return (
    <div className="flex items-center gap-1">
      <Icon className={`w-3 h-3 ${color}`} />
      <span className="text-[10px] text-3 tabular-nums">{value}</span>
    </div>
  )
}
