import { createClient } from '@/lib/supabase/server'
import type { Metric, Post } from '@/lib/supabase/types'
import { 
  TrendingUp, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2, 
  MousePointer,
  BarChart3
} from 'lucide-react'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  
  const [{ data: metrics }, { data: posts }] = await Promise.all([
    supabase.from('nex_metrics').select('*'),
    supabase.from('nex_posts').select('*').eq('status', 'published')
  ]) as [{ data: Metric[] | null }, { data: Post[] | null }]

  // Aggregate metrics (placeholder data since we're just starting)
  const totalMetrics = {
    impressions: metrics?.reduce((sum, m) => sum + m.impressions, 0) || 0,
    engagements: metrics?.reduce((sum, m) => sum + m.engagements, 0) || 0,
    likes: metrics?.reduce((sum, m) => sum + m.likes, 0) || 0,
    comments: metrics?.reduce((sum, m) => sum + m.comments, 0) || 0,
    shares: metrics?.reduce((sum, m) => sum + m.shares, 0) || 0,
    clicks: metrics?.reduce((sum, m) => sum + m.clicks, 0) || 0,
  }

  const statCards = [
    { name: 'Impressions', value: totalMetrics.impressions, icon: Eye, color: 'text-blue-400' },
    { name: 'Engagements', value: totalMetrics.engagements, icon: TrendingUp, color: 'text-green-400' },
    { name: 'Likes', value: totalMetrics.likes, icon: Heart, color: 'text-red-400' },
    { name: 'Comments', value: totalMetrics.comments, icon: MessageCircle, color: 'text-yellow-400' },
    { name: 'Shares', value: totalMetrics.shares, icon: Share2, color: 'text-purple-400' },
    { name: 'Clicks', value: totalMetrics.clicks, icon: MousePointer, color: 'text-cyan-400' },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-zinc-400 mt-1">Track your content performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
            <stat.icon className={`h-5 w-5 ${stat.color} mb-3`} />
            <p className="text-2xl font-semibold">{stat.value.toLocaleString()}</p>
            <p className="text-sm text-zinc-500">{stat.name}</p>
          </div>
        ))}
      </div>

      {/* Coming Soon */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-12">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Analytics Coming Soon</h2>
          <p className="text-zinc-400 max-w-md mx-auto">
            Once we start posting content, this page will show detailed analytics 
            including engagement trends, best posting times, top performing content, 
            and audience growth.
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
            <div className="p-4 bg-zinc-800/50 rounded-lg">
              <h3 className="font-medium mb-1">Engagement Trends</h3>
              <p className="text-sm text-zinc-500">Track likes, comments, shares over time</p>
            </div>
            <div className="p-4 bg-zinc-800/50 rounded-lg">
              <h3 className="font-medium mb-1">Best Times</h3>
              <p className="text-sm text-zinc-500">Discover optimal posting schedule</p>
            </div>
            <div className="p-4 bg-zinc-800/50 rounded-lg">
              <h3 className="font-medium mb-1">Top Content</h3>
              <p className="text-sm text-zinc-500">See what resonates with your audience</p>
            </div>
          </div>
        </div>
      </div>

      {/* Published Posts */}
      <div className="mt-8 bg-zinc-900 rounded-xl border border-zinc-800">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-lg font-semibold">Published Posts ({posts?.length || 0})</h2>
        </div>
        {posts && posts.length > 0 ? (
          <div className="divide-y divide-zinc-800">
            {posts.map((post) => (
              <div key={post.id} className="p-4">
                <p className="text-sm truncate">{post.content}</p>
                <p className="text-xs text-zinc-500 mt-1">
                  Published {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-zinc-500">
            No published posts yet. Analytics will appear once you start publishing.
          </div>
        )}
      </div>
    </div>
  )
}
