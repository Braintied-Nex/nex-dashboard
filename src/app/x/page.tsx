import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import {
  Eye,
  Heart,
  Repeat2,
  MessageCircle,
  ExternalLink,
  TrendingUp,
  ArrowUpDown,
  Bookmark,
  Search,
} from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function XPostsPage() {
  const sb = createAdminClient()

  const { data: posts } = await sb
    .from('nex_x_post_metrics')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)

  const allPosts = posts || []

  // Stats
  const totalImpressions = allPosts.reduce((s, p: any) => s + (p.impressions || 0), 0)
  const totalLikes = allPosts.reduce((s, p: any) => s + (p.likes || 0), 0)
  const avgER = allPosts.length > 0
    ? allPosts.reduce((s, p: any) => s + (p.engagement_rate || 0), 0) / allPosts.length
    : 0
  const originals = allPosts.filter((p: any) => p.tweet_type === 'original')
  const replies = allPosts.filter((p: any) => p.tweet_type === 'reply')

  return (
    <div className="min-h-screen p-6 lg:p-8 animate-in">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <header>
          <div className="flex items-center gap-1.5 text-3 text-xs mb-2">
            <XIcon className="w-3.5 h-3.5" />
            X / Twitter
          </div>
          <h1 className="text-[28px] font-semibold tracking-tight text-1">
            All Posts
          </h1>
          <p className="text-2 text-sm mt-1">
            {allPosts.length} posts · {totalImpressions.toLocaleString()} impressions · {totalLikes} likes · {avgER.toFixed(2)}% avg ER
          </p>
        </header>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <FilterPill label="All" count={allPosts.length} active />
          <FilterPill label="Original" count={originals.length} />
          <FilterPill label="Replies" count={replies.length} />
        </div>

        {/* Posts Table */}
        <div className="glass-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgb(var(--glass-border))]">
                  <th className="text-left text-[10px] text-4 font-medium uppercase tracking-wider px-6 py-3">Post</th>
                  <th className="text-center text-[10px] text-4 font-medium uppercase tracking-wider px-3 py-3 w-16">Type</th>
                  <th className="text-right text-[10px] text-4 font-medium uppercase tracking-wider px-3 py-3 w-24">
                    <span className="flex items-center justify-end gap-1"><Eye className="w-3 h-3" /> Views</span>
                  </th>
                  <th className="text-right text-[10px] text-4 font-medium uppercase tracking-wider px-3 py-3 w-16">
                    <Heart className="w-3 h-3 ml-auto" />
                  </th>
                  <th className="text-right text-[10px] text-4 font-medium uppercase tracking-wider px-3 py-3 w-16">
                    <Repeat2 className="w-3 h-3 ml-auto" />
                  </th>
                  <th className="text-right text-[10px] text-4 font-medium uppercase tracking-wider px-3 py-3 w-16">
                    <MessageCircle className="w-3 h-3 ml-auto" />
                  </th>
                  <th className="text-right text-[10px] text-4 font-medium uppercase tracking-wider px-3 py-3 w-16">
                    <Bookmark className="w-3 h-3 ml-auto" />
                  </th>
                  <th className="text-right text-[10px] text-4 font-medium uppercase tracking-wider px-3 py-3 w-20">ER %</th>
                  <th className="text-right text-[10px] text-4 font-medium uppercase tracking-wider px-6 py-3 w-32">Posted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgb(var(--glass-border))]">
                {allPosts.map((post: any) => (
                  <tr key={post.id} className="hover:bg-[rgb(var(--glass-inset))] transition-colors group cursor-pointer">
                    <td className="px-6 py-3">
                      <Link href={`/x/${post.tweet_id}`} className="flex items-start gap-2">
                        <p className="text-[12px] text-2 line-clamp-2 max-w-lg leading-relaxed">
                          {post.tweet_text}
                        </p>
                        {post.tweet_id && (
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5">
                            <ExternalLink className="w-3 h-3 text-4" />
                          </span>
                        )}
                      </Link>
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
                      <span className={(post.likes || 0) > 0 ? 'text-rose-400' : 'text-4'}>
                        {post.likes || 0}
                      </span>
                    </td>
                    <td className="text-right px-3 py-3 text-[12px] tabular-nums">
                      <span className={(post.retweets || 0) > 0 ? 'text-green-400' : 'text-4'}>
                        {post.retweets || 0}
                      </span>
                    </td>
                    <td className="text-right px-3 py-3 text-[12px] tabular-nums">
                      <span className={(post.replies || 0) > 0 ? 'text-purple-400' : 'text-4'}>
                        {post.replies || 0}
                      </span>
                    </td>
                    <td className="text-right px-3 py-3 text-[12px] tabular-nums">
                      <span className={(post.bookmarks || 0) > 0 ? 'text-cyan-400' : 'text-4'}>
                        {post.bookmarks || 0}
                      </span>
                    </td>
                    <td className="text-right px-3 py-3">
                      <EngagementBadge rate={post.engagement_rate || 0} />
                    </td>
                    <td className="text-right px-6 py-3 text-[11px] text-4 tabular-nums">
                      {formatTime(post.created_at)}
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

// Components

function XIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}

function FilterPill({ label, count, active = false }: { label: string; count: number; active?: boolean }) {
  return (
    <button className={`
      px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5
      ${active
        ? 'bg-[rgb(var(--fg))] text-[rgb(var(--bg))] font-medium'
        : 'glass-inset text-3 hover:text-2'
      }
    `}>
      {label}
      <span className={active ? 'opacity-70' : 'text-4'}>{count}</span>
    </button>
  )
}

function EngagementBadge({ rate }: { rate: number }) {
  const color = rate > 1 ? 'text-green-400 bg-green-500/10' :
                rate > 0.5 ? 'text-amber-400 bg-amber-500/10' :
                rate > 0 ? 'text-3 bg-[rgb(var(--glass-inset))]' :
                'text-4'

  return (
    <span className={`text-[11px] font-medium tabular-nums px-1.5 py-0.5 rounded ${color}`}>
      {rate.toFixed(2)}%
    </span>
  )
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en', { month: 'short', day: 'numeric' }) + ' ' +
    d.toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit' })
}
