import { createClient } from '@/lib/supabase/server'
import type { Platform, Post, Theme, Strategy } from '@/lib/supabase/types'
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import { 
  FileText, 
  Calendar, 
  TrendingUp, 
  Target,
  Twitter,
  Linkedin,
  Github,
  Mail,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

const platformIcons: Record<string, React.ReactNode> = {
  twitter: <Twitter className="h-5 w-5" />,
  linkedin: <Linkedin className="h-5 w-5" />,
  github: <Github className="h-5 w-5" />,
  mail: <Mail className="h-5 w-5" />,
  'message-square': <Mail className="h-5 w-5" />,
}

export default async function Dashboard() {
  const supabase = await createClient()
  
  const [
    { data: platforms },
    { data: posts },
    { data: themes },
  ] = await Promise.all([
    supabase.from('nex_platforms').select('*'),
    supabase.from('nex_posts').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('nex_themes').select('*'),
  ]) as [
    { data: Platform[] | null },
    { data: Post[] | null },
    { data: Theme[] | null },
  ]

  const stats = [
    { 
      name: 'Total Posts', 
      value: posts?.length || 0, 
      icon: FileText,
      change: 'Ready to create',
      trend: 'neutral'
    },
    { 
      name: 'Scheduled', 
      value: posts?.filter(p => p.status === 'scheduled').length || 0, 
      icon: Calendar,
      change: 'This week',
      trend: 'neutral'
    },
    { 
      name: 'Platforms', 
      value: platforms?.length || 0, 
      icon: Target,
      change: 'Connected',
      trend: 'up'
    },
    { 
      name: 'Engagement', 
      value: '—', 
      icon: TrendingUp,
      change: 'Coming soon',
      trend: 'neutral'
    },
  ]

  const statusVariants: Record<string, 'success' | 'warning' | 'info' | 'error' | 'default'> = {
    published: 'success',
    scheduled: 'info',
    draft: 'warning',
    idea: 'default',
    archived: 'default',
  }

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-[rgb(var(--accent))] mb-2">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">Command Center</span>
        </div>
        <h1 className="text-3xl font-bold mb-1">Good evening, Galen</h1>
        <p className="text-[rgb(var(--muted-fg))]">Here&apos;s what&apos;s happening across your platforms.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <Card key={stat.name} variant="glass" className="animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
            <CardContent className="py-5">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-[--radius-lg] bg-[rgb(var(--muted))]">
                  <stat.icon className="h-5 w-5 text-[rgb(var(--muted-fg))]" />
                </div>
                <span className={`text-xs font-medium ${
                  stat.trend === 'up' ? 'text-[rgb(var(--success))]' : 'text-[rgb(var(--muted-fg))]'
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-3xl font-semibold mb-1">{stat.value}</p>
              <p className="text-sm text-[rgb(var(--muted-fg))]">{stat.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Platform Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Platforms</CardTitle>
            <Link 
              href="/settings" 
              className="text-sm text-[rgb(var(--accent))] hover:underline flex items-center gap-1"
            >
              Manage <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {platforms?.map((platform) => (
              <div key={platform.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-[--radius-lg] bg-[rgb(var(--muted))] flex items-center justify-center">
                    {platformIcons[platform.icon || 'mail'] || <Mail className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{platform.name}</p>
                    <p className="text-xs text-[rgb(var(--muted-fg))]">{platform.handle || 'Not connected'}</p>
                  </div>
                </div>
                <Badge variant={platform.api_enabled ? 'success' : 'default'}>
                  {platform.api_enabled ? 'Connected' : 'Manual'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Content Themes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Content Themes</CardTitle>
            <Link 
              href="/strategy" 
              className="text-sm text-[rgb(var(--accent))] hover:underline flex items-center gap-1"
            >
              Strategy <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {themes?.map((theme) => (
              <div key={theme.id} className="flex items-center gap-3">
                <div 
                  className="h-3 w-3 rounded-full shrink-0" 
                  style={{ backgroundColor: theme.color || '#666' }}
                />
                <div className="min-w-0">
                  <p className="font-medium text-sm">{theme.name}</p>
                  <p className="text-xs text-[rgb(var(--muted-fg))] truncate">{theme.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Posts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Posts</CardTitle>
          <Link 
            href="/posts" 
            className="text-sm text-[rgb(var(--accent))] hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </CardHeader>
        <div className="divide-y divide-[rgb(var(--border))]">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="px-6 py-4 flex items-start gap-4">
                <Badge variant={statusVariants[post.status] || 'default'}>
                  {post.status}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {post.title || post.content.slice(0, 60)}
                  </p>
                  <p className="text-xs text-[rgb(var(--muted-fg))] mt-1 line-clamp-2">
                    {post.content}
                  </p>
                </div>
                <span className="text-xs text-[rgb(var(--muted-fg))] shrink-0">
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center">
              <FileText className="h-8 w-8 mx-auto mb-3 text-[rgb(var(--muted-fg))] opacity-50" />
              <p className="text-[rgb(var(--muted-fg))] mb-2">No posts yet</p>
              <Link 
                href="/posts" 
                className="text-sm text-[rgb(var(--accent))] hover:underline"
              >
                Create your first post →
              </Link>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
