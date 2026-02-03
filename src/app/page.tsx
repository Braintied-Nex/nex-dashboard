import { createClient } from '@/lib/supabase/server'
import type { Platform, Post, Theme, Strategy } from '@/lib/supabase/types'
import { 
  FileText, 
  Calendar, 
  TrendingUp, 
  Target,
  Twitter,
  Linkedin,
  Github,
  Mail
} from 'lucide-react'

const platformIcons: Record<string, React.ReactNode> = {
  twitter: <Twitter className="h-5 w-5" />,
  linkedin: <Linkedin className="h-5 w-5" />,
  github: <Github className="h-5 w-5" />,
  mail: <Mail className="h-5 w-5" />,
}

export default async function Dashboard() {
  const supabase = await createClient()
  
  const [
    { data: platforms },
    { data: posts },
    { data: themes },
    { data: strategies }
  ] = await Promise.all([
    supabase.from('nex_platforms').select('*'),
    supabase.from('nex_posts').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('nex_themes').select('*'),
    supabase.from('nex_strategy').select('*, nex_platforms(*)')
  ]) as [
    { data: Platform[] | null },
    { data: Post[] | null },
    { data: Theme[] | null },
    { data: Strategy[] | null }
  ]

  const stats = [
    { 
      name: 'Total Posts', 
      value: posts?.length || 0, 
      icon: FileText,
      change: '+12%',
      changeType: 'positive'
    },
    { 
      name: 'Scheduled', 
      value: posts?.filter(p => p.status === 'scheduled').length || 0, 
      icon: Calendar,
      change: '3 this week',
      changeType: 'neutral'
    },
    { 
      name: 'Platforms', 
      value: platforms?.length || 0, 
      icon: Target,
      change: 'All active',
      changeType: 'positive'
    },
    { 
      name: 'Engagement', 
      value: '—', 
      icon: TrendingUp,
      change: 'Coming soon',
      changeType: 'neutral'
    },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-zinc-400 mt-1">Welcome back, Galen. Here&apos;s what&apos;s happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <div className="flex items-center justify-between">
              <stat.icon className="h-5 w-5 text-zinc-500" />
              <span className={`text-xs ${
                stat.changeType === 'positive' ? 'text-green-500' : 'text-zinc-500'
              }`}>
                {stat.change}
              </span>
            </div>
            <p className="mt-4 text-3xl font-semibold">{stat.value}</p>
            <p className="text-sm text-zinc-500">{stat.name}</p>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Platform Status */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800">
          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-lg font-semibold">Platform Status</h2>
          </div>
          <div className="p-6 space-y-4">
            {platforms?.map((platform) => (
              <div key={platform.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                    {platformIcons[platform.icon || 'mail'] || <Mail className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-medium">{platform.name}</p>
                    <p className="text-sm text-zinc-500">{platform.handle || 'Not connected'}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  platform.api_enabled 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {platform.api_enabled ? 'Connected' : 'Manual'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content Themes */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800">
          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-lg font-semibold">Content Themes</h2>
          </div>
          <div className="p-6 space-y-3">
            {themes?.map((theme) => (
              <div key={theme.id} className="flex items-center gap-3">
                <div 
                  className="h-3 w-3 rounded-full" 
                  style={{ backgroundColor: theme.color || '#666' }}
                />
                <div className="flex-1">
                  <p className="font-medium">{theme.name}</p>
                  <p className="text-sm text-zinc-500">{theme.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="mt-8 bg-zinc-900 rounded-xl border border-zinc-800">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Posts</h2>
          <a href="/posts" className="text-sm text-yellow-500 hover:text-yellow-400">
            View all →
          </a>
        </div>
        <div className="divide-y divide-zinc-800">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="p-6 flex items-start gap-4">
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  post.status === 'published' ? 'bg-green-500/20 text-green-400' :
                  post.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400' :
                  post.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-zinc-800 text-zinc-400'
                }`}>
                  {post.status}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{post.title || post.content.slice(0, 60)}</p>
                  <p className="text-sm text-zinc-500 mt-1 line-clamp-2">{post.content}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-zinc-500">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No posts yet. Create your first post!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
