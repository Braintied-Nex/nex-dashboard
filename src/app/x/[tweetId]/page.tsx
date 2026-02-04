import { createAdminClient } from '@/lib/supabase/admin'
import { 
  Eye, 
  Heart, 
  Repeat2, 
  MessageCircle, 
  Bookmark, 
  ExternalLink, 
  ArrowLeft,
  TrendingUp,
  Clock
} from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface Props {
  params: Promise<{ tweetId: string }>
}

export default async function TweetDetailPage({ params }: Props) {
  const { tweetId } = await params
  const sb = createAdminClient()

  const [{ data: post }, { data: engagements }] = await Promise.all([
    sb.from('nex_x_post_metrics')
      .select('*')
      .eq('tweet_id', tweetId)
      .single(),
    sb.from('nex_x_engagements')
      .select('*')
      .or(`conversation_id.eq.${tweetId},trigger_tweet_id.eq.${tweetId}`)
      .order('created_at', { ascending: false }),
  ])

  if (!post) {
    return (
      <div className="min-h-screen p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-1 mb-2">Post Not Found</h1>
          <p className="text-2 mb-4">Tweet ID: {tweetId}</p>
          <Link href="/x" className="text-blue-400 hover:underline">
            ← Back to all posts
          </Link>
        </div>
      </div>
    )
  }

  const relatedEngagements = engagements || []

  return (
    <div className="min-h-screen p-6 lg:p-8 animate-in">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Back Button */}
        <Link 
          href="/x"
          className="inline-flex items-center gap-2 text-sm text-3 hover:text-1 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all posts
        </Link>

        {/* Post Header */}
        <header className="glass-panel p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <XIcon className="w-5 h-5 text-1" />
              <h1 className="text-xl font-semibold text-1">Post Details</h1>
            </div>
            <a
              href={`https://x.com/sentigen_ai/status/${tweetId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-inset hover:bg-[rgb(var(--glass-inset-hover))] transition-colors text-sm text-2"
            >
              View on X
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Tweet Text */}
          <div className="py-4">
            <p className="text-base text-1 leading-relaxed whitespace-pre-wrap">
              {post.tweet_text}
            </p>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 pt-4 border-t border-[rgb(var(--glass-border))] text-xs text-3">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatDateTime(post.created_at)}
            </div>
            <span className={`px-2 py-0.5 rounded-full ${
              post.tweet_type === 'original'
                ? 'bg-blue-500/15 text-blue-400'
                : 'bg-purple-500/15 text-purple-400'
            }`}>
              {post.tweet_type}
            </span>
          </div>
        </header>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <MetricCard
            icon={Eye}
            label="Impressions"
            value={post.impressions || 0}
            color="text-blue-400"
          />
          <MetricCard
            icon={Heart}
            label="Likes"
            value={post.likes || 0}
            color="text-rose-400"
          />
          <MetricCard
            icon={Repeat2}
            label="Retweets"
            value={post.retweets || 0}
            color="text-green-400"
          />
          <MetricCard
            icon={MessageCircle}
            label="Replies"
            value={post.replies || 0}
            color="text-purple-400"
          />
          <MetricCard
            icon={Bookmark}
            label="Bookmarks"
            value={post.bookmarks || 0}
            color="text-cyan-400"
          />
          <MetricCard
            icon={TrendingUp}
            label="Engagement Rate"
            value={`${(post.engagement_rate || 0).toFixed(2)}%`}
            color="text-amber-400"
            isPercent
          />
        </div>

        {/* Additional Metrics */}
        {(post.url_clicks || post.profile_clicks || post.detail_expands) && (
          <div className="glass-panel p-5">
            <h2 className="text-sm font-medium text-1 mb-3">Additional Engagement</h2>
            <div className="grid grid-cols-3 gap-4">
              {post.url_clicks != null && (
                <div>
                  <div className="text-xs text-4 mb-1">URL Clicks</div>
                  <div className="text-lg font-semibold text-2 tabular-nums">{post.url_clicks}</div>
                </div>
              )}
              {post.profile_clicks != null && (
                <div>
                  <div className="text-xs text-4 mb-1">Profile Clicks</div>
                  <div className="text-lg font-semibold text-2 tabular-nums">{post.profile_clicks}</div>
                </div>
              )}
              {post.detail_expands != null && (
                <div>
                  <div className="text-xs text-4 mb-1">Detail Expands</div>
                  <div className="text-lg font-semibold text-2 tabular-nums">{post.detail_expands}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Related Engagements */}
        {relatedEngagements.length > 0 && (
          <div className="glass-panel p-5 space-y-4">
            <h2 className="text-sm font-medium text-1">
              Related Engagements ({relatedEngagements.length})
            </h2>
            <div className="space-y-2">
              {relatedEngagements.map((engagement) => (
                <EngagementCard key={engagement.id} engagement={engagement} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function MetricCard({ 
  icon: Icon, 
  label, 
  value, 
  color,
  isPercent = false
}: { 
  icon: any
  label: string
  value: number | string
  color: string
  isPercent?: boolean
}) {
  return (
    <div className="glass-card p-4 space-y-2">
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-[10px] text-4 uppercase tracking-wider font-medium">{label}</span>
      </div>
      <div className={`text-xl font-semibold ${color} tabular-nums`}>
        {typeof value === 'number' && !isPercent ? value.toLocaleString() : value}
      </div>
    </div>
  )
}

function EngagementCard({ engagement }: { engagement: any }) {
  const typeColors: Record<string, string> = {
    reply: 'bg-purple-500/15 text-purple-400',
    quote: 'bg-blue-500/15 text-blue-400',
    original: 'bg-green-500/15 text-green-400',
    thread_reply: 'bg-amber-500/15 text-amber-400',
  }

  const typeColor = typeColors[engagement.type] || 'bg-gray-500/15 text-gray-400'

  return (
    <div className="glass-inset p-3 rounded-lg space-y-2">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${typeColor}`}>
              {engagement.type}
            </span>
            {engagement.tone && (
              <span className="text-[10px] text-4">{engagement.tone}</span>
            )}
          </div>
          {engagement.content && (
            <p className="text-xs text-2 line-clamp-2 leading-relaxed">{engagement.content}</p>
          )}
        </div>
        {engagement.created_at && (
          <span className="text-[10px] text-4 flex-shrink-0">
            {formatTime(engagement.created_at)}
          </span>
        )}
      </div>

      {/* Metrics */}
      {(engagement.likes || engagement.retweets || engagement.replies) && (
        <div className="flex items-center gap-3 text-xs pt-2 border-t border-[rgb(var(--glass-border))]">
          {engagement.likes != null && engagement.likes > 0 && (
            <div className="flex items-center gap-1 text-rose-400">
              <Heart className="w-3 h-3" />
              {engagement.likes}
            </div>
          )}
          {engagement.retweets != null && engagement.retweets > 0 && (
            <div className="flex items-center gap-1 text-green-400">
              <Repeat2 className="w-3 h-3" />
              {engagement.retweets}
            </div>
          )}
          {engagement.replies != null && engagement.replies > 0 && (
            <div className="flex items-center gap-1 text-purple-400">
              <MessageCircle className="w-3 h-3" />
              {engagement.replies}
            </div>
          )}
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

function formatDateTime(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en', { month: 'short', day: 'numeric' }) + ' ' +
    d.toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit' })
}
