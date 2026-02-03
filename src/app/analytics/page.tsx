import { createClient } from '@/lib/supabase/server'
import type { Post, Platform } from '@/lib/supabase/types'
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import { 
  TrendingUp, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2, 
  MousePointer,
  BarChart3,
  Calendar,
  Zap,
  Target,
  Twitter,
  Linkedin,
  MessageSquare
} from 'lucide-react'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  
  const [{ data: metrics }, { data: posts }, { data: platforms }] = await Promise.all([
    supabase.from('nex_metrics').select('*'),
    supabase.from('nex_posts').select('*'),
    supabase.from('nex_platforms').select('*')
  ]) as [{ data: any[] | null }, { data: Post[] | null }, { data: Platform[] | null }]

  // Aggregate metrics
  const totalMetrics = {
    impressions: metrics?.reduce((sum, m) => sum + (m.impressions || 0), 0) || 0,
    engagements: metrics?.reduce((sum, m) => sum + (m.engagements || 0), 0) || 0,
    likes: metrics?.reduce((sum, m) => sum + (m.likes || 0), 0) || 0,
    comments: metrics?.reduce((sum, m) => sum + (m.comments || 0), 0) || 0,
    shares: metrics?.reduce((sum, m) => sum + (m.shares || 0), 0) || 0,
    clicks: metrics?.reduce((sum, m) => sum + (m.clicks || 0), 0) || 0,
  }

  const engagementRate = totalMetrics.impressions > 0 
    ? ((totalMetrics.engagements / totalMetrics.impressions) * 100).toFixed(2)
    : '0.00'

  // Post stats
  const postStats = {
    total: posts?.length || 0,
    published: posts?.filter(p => p.status === 'published').length || 0,
    scheduled: posts?.filter(p => p.status === 'scheduled').length || 0,
    draft: posts?.filter(p => p.status === 'draft').length || 0,
  }

  const platformIcons: Record<string, React.ReactNode> = {
    'X/Twitter': <Twitter className="h-5 w-5" />,
    'LinkedIn': <Linkedin className="h-5 w-5" />,
    'Reddit': <MessageSquare className="h-5 w-5" />,
  }

  const hasMetrics = metrics && metrics.length > 0

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-[rgb(var(--muted-fg))] mb-2">
          <BarChart3 className="h-4 w-4" />
          <span className="text-sm font-medium">Performance Tracking</span>
        </div>
        <h1 className="text-3xl font-bold mb-1">Analytics</h1>
        <p className="text-[rgb(var(--muted-fg))]">Track your content performance across platforms</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          { name: 'Impressions', value: totalMetrics.impressions, icon: Eye, color: 'text-blue-400' },
          { name: 'Engagements', value: totalMetrics.engagements, icon: TrendingUp, color: 'text-green-400' },
          { name: 'Likes', value: totalMetrics.likes, icon: Heart, color: 'text-red-400' },
          { name: 'Comments', value: totalMetrics.comments, icon: MessageCircle, color: 'text-yellow-400' },
          { name: 'Shares', value: totalMetrics.shares, icon: Share2, color: 'text-purple-400' },
          { name: 'Clicks', value: totalMetrics.clicks, icon: MousePointer, color: 'text-cyan-400' },
        ].map((stat) => (
          <Card key={stat.name} variant="glass">
            <CardContent className="py-4">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                <span className="text-xs text-[rgb(var(--muted-fg))]">{stat.name}</span>
              </div>
              <p className="text-2xl font-bold">
                {stat.value.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Engagement Rate Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Engagement Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-5xl font-bold text-[rgb(var(--accent))]">
                {engagementRate}%
              </p>
              <p className="text-sm text-[rgb(var(--muted-fg))] mt-2">
                {hasMetrics ? 'Based on total impressions' : 'No data yet - start posting!'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Content Pipeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Content Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Posts</span>
                <span className="font-semibold">{postStats.total}</span>
              </div>
              <div className="h-2 bg-[rgb(var(--muted))] rounded-full overflow-hidden">
                <div className="h-full flex">
                  {postStats.published > 0 && (
                    <div 
                      className="bg-green-500 h-full" 
                      style={{ width: `${(postStats.published / postStats.total) * 100}%` }}
                    />
                  )}
                  {postStats.scheduled > 0 && (
                    <div 
                      className="bg-blue-500 h-full" 
                      style={{ width: `${(postStats.scheduled / postStats.total) * 100}%` }}
                    />
                  )}
                  {postStats.draft > 0 && (
                    <div 
                      className="bg-yellow-500 h-full" 
                      style={{ width: `${(postStats.draft / postStats.total) * 100}%` }}
                    />
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <div className="h-2 w-2 rounded-full bg-green-500 mx-auto mb-1" />
                  <span className="text-[rgb(var(--muted-fg))]">Published</span>
                  <p className="font-semibold">{postStats.published}</p>
                </div>
                <div>
                  <div className="h-2 w-2 rounded-full bg-blue-500 mx-auto mb-1" />
                  <span className="text-[rgb(var(--muted-fg))]">Scheduled</span>
                  <p className="font-semibold">{postStats.scheduled}</p>
                </div>
                <div>
                  <div className="h-2 w-2 rounded-full bg-yellow-500 mx-auto mb-1" />
                  <span className="text-[rgb(var(--muted-fg))]">Draft</span>
                  <p className="font-semibold">{postStats.draft}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              By Platform
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {platforms?.slice(0, 4).map((platform) => {
                const platformPosts = posts?.filter(p => p.platform_id === platform.id).length || 0
                const percentage = postStats.total > 0 ? (platformPosts / postStats.total) * 100 : 0
                return (
                  <div key={platform.id}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="flex items-center gap-2">
                        {platformIcons[platform.name] || <Target className="h-4 w-4" />}
                        {platform.name}
                      </span>
                      <span className="text-[rgb(var(--muted-fg))]">{platformPosts}</span>
                    </div>
                    <div className="h-1.5 bg-[rgb(var(--muted))] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[rgb(var(--accent))] rounded-full" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Message */}
      {!hasMetrics && (
        <Card>
          <CardContent className="py-12 text-center">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-[rgb(var(--muted-fg))] opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Performance Data Yet</h3>
            <p className="text-[rgb(var(--muted-fg))] max-w-md mx-auto">
              Once you start publishing content, I&apos;ll track impressions, engagement, and other metrics here. 
              The feedback loop will help optimize future content.
            </p>
            <div className="mt-6 p-4 bg-[rgb(var(--muted))] rounded-[--radius-lg] max-w-md mx-auto text-left">
              <p className="text-sm font-medium mb-2">What I&apos;ll track:</p>
              <ul className="text-sm text-[rgb(var(--muted-fg))] space-y-1">
                <li>• Impressions & reach per post</li>
                <li>• Engagement rates by platform</li>
                <li>• Best performing content themes</li>
                <li>• Optimal posting times</li>
                <li>• Audience growth over time</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
