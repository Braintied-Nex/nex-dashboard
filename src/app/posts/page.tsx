'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Post, Platform, Theme } from '@/lib/supabase/types'
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Button, Badge, Input, Textarea, Select } from '@/components/ui'
import { 
  Plus, 
  Search,
  X,
  Check,
  Clock,
  Calendar,
  Edit3,
  Trash2,
  Send,
  FileText,
  Layers,
  ChevronRight,
  MoreHorizontal,
  ArrowUp,
  Sparkles
} from 'lucide-react'

// Platform icons as simple components
const PlatformIcon = ({ name, className = "h-4 w-4" }: { name: string; className?: string }) => {
  const icons: Record<string, React.ReactNode> = {
    'X/Twitter': (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    'LinkedIn': (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    'Reddit': (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
      </svg>
    ),
    'GitHub': (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
      </svg>
    ),
    'Substack': (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
      </svg>
    ),
  }
  return <>{icons[name] || <FileText className={className} />}</>
}

type PostWithRelations = Post & { platform?: Platform | null; theme?: Theme | null }

type PostFormData = {
  content: string
  platform_id: string
  theme_id: string
  status: 'idea' | 'draft' | 'scheduled' | 'published' | 'archived'
  scheduled_for: string
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  idea: { label: 'Idea', color: 'bg-purple-500/15 text-purple-400', icon: <Sparkles className="h-3 w-3" /> },
  draft: { label: 'Draft', color: 'bg-amber-500/15 text-amber-400', icon: <Edit3 className="h-3 w-3" /> },
  scheduled: { label: 'Scheduled', color: 'bg-blue-500/15 text-blue-400', icon: <Clock className="h-3 w-3" /> },
  published: { label: 'Published', color: 'bg-green-500/15 text-green-400', icon: <Check className="h-3 w-3" /> },
  archived: { label: 'Archived', color: 'bg-zinc-500/15 text-zinc-400', icon: <FileText className="h-3 w-3" /> },
}

export default function PostsPage() {
  const [posts, setPosts] = useState<PostWithRelations[]>([])
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [themes, setThemes] = useState<Theme[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingPost, setEditingPost] = useState<PostWithRelations | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [platformFilter, setPlatformFilter] = useState<string>('all')
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [formData, setFormData] = useState<PostFormData>({
    content: '',
    platform_id: '',
    theme_id: '',
    status: 'draft',
    scheduled_for: ''
  })

  const supabase = createClient()

  useEffect(() => {
    loadData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadData() {
    const [postsRes, platformsRes, themesRes] = await Promise.all([
      supabase
        .from('nex_posts')
        .select('*, platform:nex_platforms(*), theme:nex_themes(*)')
        .order('scheduled_for', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false }),
      supabase.from('nex_platforms').select('*'),
      supabase.from('nex_themes').select('*')
    ])
    
    setPosts((postsRes.data || []) as PostWithRelations[])
    setPlatforms((platformsRes.data || []) as Platform[])
    setThemes((themesRes.data || []) as Theme[])
    setLoading(false)
  }

  // Filter posts by platform
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.title?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPlatform = platformFilter === 'all' || post.platform_id === platformFilter
      return matchesSearch && matchesPlatform
    })
  }, [posts, searchQuery, platformFilter])

  // Group posts by time period
  const groupedPosts = useMemo(() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

    const groups: Record<string, PostWithRelations[]> = {
      overdue: [],
      today: [],
      tomorrow: [],
      thisWeek: [],
      later: [],
      drafts: [],
      published: [],
    }

    filteredPosts.forEach(post => {
      if (post.status === 'published') {
        groups.published.push(post)
      } else if (post.status === 'draft' || post.status === 'idea') {
        groups.drafts.push(post)
      } else if (post.scheduled_for) {
        const scheduledDate = new Date(post.scheduled_for)
        if (scheduledDate < today) {
          groups.overdue.push(post)
        } else if (scheduledDate < tomorrow) {
          groups.today.push(post)
        } else if (scheduledDate < new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000)) {
          groups.tomorrow.push(post)
        } else if (scheduledDate < nextWeek) {
          groups.thisWeek.push(post)
        } else {
          groups.later.push(post)
        }
      } else {
        groups.drafts.push(post)
      }
    })

    return groups
  }, [filteredPosts])

  // Platform counts for tabs
  const platformCounts = useMemo(() => {
    const counts: Record<string, number> = { all: posts.length }
    platforms.forEach(p => {
      counts[p.id] = posts.filter(post => post.platform_id === p.id).length
    })
    return counts
  }, [posts, platforms])

  function openNewPost() {
    setEditingPost(null)
    setFormData({
      content: '',
      platform_id: platformFilter !== 'all' ? platformFilter : '',
      theme_id: '',
      status: 'draft',
      scheduled_for: ''
    })
    setShowModal(true)
  }

  function openEditPost(post: PostWithRelations) {
    setEditingPost(post)
    setFormData({
      content: post.content,
      platform_id: post.platform_id || '',
      theme_id: post.theme_id || '',
      status: post.status as PostFormData['status'],
      scheduled_for: post.scheduled_for ? new Date(post.scheduled_for).toISOString().slice(0, 16) : ''
    })
    setShowModal(true)
    setActiveMenu(null)
  }

  async function savePost() {
    if (!formData.content.trim()) return
    
    const postData = {
      content: formData.content,
      platform_id: formData.platform_id || null,
      theme_id: formData.theme_id || null,
      status: formData.status,
      scheduled_for: formData.scheduled_for ? new Date(formData.scheduled_for).toISOString() : null
    }

    if (editingPost) {
      await (supabase
        .from('nex_posts') as any)
        .update(postData)
        .eq('id', editingPost.id)
    } else {
      await (supabase
        .from('nex_posts') as any)
        .insert(postData)
    }

    setShowModal(false)
    loadData()
  }

  async function deletePost(id: string) {
    if (!confirm('Delete this post?')) return
    await (supabase.from('nex_posts') as any).delete().eq('id', id)
    setActiveMenu(null)
    loadData()
  }

  async function quickPublish(post: PostWithRelations) {
    await (supabase.from('nex_posts') as any).update({ 
      status: 'published',
      published_at: new Date().toISOString()
    }).eq('id', post.id)
    setActiveMenu(null)
    loadData()
  }

  async function quickSchedule(post: PostWithRelations) {
    // Schedule for next available slot (tomorrow at 10am)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(10, 0, 0, 0)
    
    await (supabase.from('nex_posts') as any).update({ 
      status: 'scheduled',
      scheduled_for: tomorrow.toISOString()
    }).eq('id', post.id)
    setActiveMenu(null)
    loadData()
  }

  // Render a single post card
  const PostCard = ({ post, showTimeline = false }: { post: PostWithRelations; showTimeline?: boolean }) => {
    const status = statusConfig[post.status] || statusConfig.draft
    const charCount = post.content.length
    const isOverLimit = post.platform?.name === 'X/Twitter' && charCount > 280

    return (
      <div className="group relative flex gap-4">
        {/* Timeline dot */}
        {showTimeline && (
          <div className="flex flex-col items-center pt-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${
              post.status === 'published' ? 'bg-green-400' :
              post.status === 'scheduled' ? 'bg-blue-400' :
              'bg-zinc-500'
            }`} />
            <div className="w-px flex-1 bg-[rgb(var(--glass-border))] mt-2" />
          </div>
        )}
        
        {/* Post content */}
        <div className="flex-1 pb-6">
          <div className="glass-inset p-4 rounded-2xl hover:bg-[rgb(var(--glass-inset-hover))] transition-all">
            {/* Header row */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                {post.platform && (
                  <span className="flex items-center gap-1.5 text-xs text-3">
                    <PlatformIcon name={post.platform.name} className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{post.platform.name}</span>
                  </span>
                )}
                <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${status.color}`}>
                  {status.icon}
                  {status.label}
                </span>
                {post.theme && (
                  <span 
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ 
                      backgroundColor: `${post.theme.color || '#666'}15`, 
                      color: post.theme.color || '#a1a1aa' 
                    }}
                  >
                    {post.theme.name}
                  </span>
                )}
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEditPost(post)}
                  className="p-1.5 rounded-lg hover:bg-[rgb(var(--glass-inset))] text-3 hover:text-1 transition-colors"
                  title="Edit"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
                {(post.status === 'draft' || post.status === 'scheduled') && (
                  <button
                    onClick={() => quickPublish(post)}
                    className="p-1.5 rounded-lg hover:bg-green-500/20 text-3 hover:text-green-400 transition-colors"
                    title="Publish now"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setActiveMenu(activeMenu === post.id ? null : post.id)}
                  className="p-1.5 rounded-lg hover:bg-[rgb(var(--glass-inset))] text-3 hover:text-1 transition-colors"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </button>
                
                {/* Dropdown menu */}
                {activeMenu === post.id && (
                  <div className="absolute right-0 top-8 glass-panel py-1 min-w-[140px] z-20 shadow-xl">
                    {post.status === 'draft' && (
                      <button 
                        onClick={() => quickSchedule(post)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-[rgb(var(--glass-inset))] flex items-center gap-2 text-2"
                      >
                        <Calendar className="h-3.5 w-3.5" /> Schedule
                      </button>
                    )}
                    <button 
                      onClick={() => deletePost(post.id)}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-red-500/10 flex items-center gap-2 text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Content */}
            <p className="text-sm text-1 whitespace-pre-wrap leading-relaxed">
              {post.content}
            </p>
            
            {/* Footer */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[rgb(var(--glass-border))]">
              <div className="flex items-center gap-3 text-xs text-4">
                {post.scheduled_for && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(post.scheduled_for).toLocaleDateString('en', { 
                      weekday: 'short',
                      month: 'short', 
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </span>
                )}
              </div>
              <span className={`text-xs ${isOverLimit ? 'text-red-400' : 'text-4'}`}>
                {charCount}{post.platform?.name === 'X/Twitter' && '/280'}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render a timeline section
  const TimelineSection = ({ 
    title, 
    posts, 
    icon,
    emptyText,
    variant = 'default'
  }: { 
    title: string
    posts: PostWithRelations[]
    icon: React.ReactNode
    emptyText?: string
    variant?: 'default' | 'warning' | 'success'
  }) => {
    if (posts.length === 0 && !emptyText) return null

    const headerColors = {
      default: 'text-2',
      warning: 'text-amber-400',
      success: 'text-green-400',
    }

    return (
      <div className="mb-8">
        <div className={`flex items-center gap-2 mb-4 ${headerColors[variant]}`}>
          {icon}
          <h3 className="text-sm font-medium">{title}</h3>
          <span className="text-xs text-4">({posts.length})</span>
        </div>
        {posts.length > 0 ? (
          <div className="space-y-0">
            {posts.map((post, idx) => (
              <PostCard key={post.id} post={post} showTimeline={idx < posts.length - 1} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-4 pl-6">{emptyText}</p>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 animate-in">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-[28px] font-semibold text-1 tracking-tight">Posts</h1>
              <p className="text-sm text-3 mt-1">
                {posts.length} posts · {posts.filter(p => p.status === 'scheduled').length} scheduled
              </p>
            </div>
            <Button onClick={openNewPost} className="gap-2">
              <Plus className="h-4 w-4" />
              New Post
            </Button>
          </div>

          {/* Platform Tabs */}
          <div className="flex items-center gap-1 p-1 glass-panel rounded-2xl overflow-x-auto">
            <button
              onClick={() => setPlatformFilter('all')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                platformFilter === 'all' 
                  ? 'glass-inset text-1' 
                  : 'text-3 hover:text-2'
              }`}
            >
              <Layers className="h-4 w-4" />
              All
              <span className="text-xs text-4">{platformCounts.all}</span>
            </button>
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => setPlatformFilter(platform.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  platformFilter === platform.id 
                    ? 'glass-inset text-1' 
                    : 'text-3 hover:text-2'
                }`}
              >
                <PlatformIcon name={platform.name} className="h-4 w-4" />
                <span className="hidden sm:inline">{platform.name}</span>
                <span className="text-xs text-4">{platformCounts[platform.id] || 0}</span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="mt-4 relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-4" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts..."
              className="pl-10 bg-transparent"
            />
          </div>
        </header>

        {/* Content */}
        {loading ? (
          <div className="text-center py-16 text-3">Loading...</div>
        ) : filteredPosts.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 rounded-2xl glass-inset flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-3" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                {searchQuery ? 'No posts match your search' : 'No posts yet'}
              </h3>
              <p className="text-sm text-3 mb-6 max-w-sm mx-auto">
                {searchQuery 
                  ? 'Try a different search term or clear the filter'
                  : 'Create your first post to get started with your content strategy'
                }
              </p>
              {!searchQuery && (
                <Button onClick={openNewPost} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create your first post
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div>
            {/* Timeline sections */}
            <TimelineSection
              title="Overdue"
              posts={groupedPosts.overdue}
              icon={<Clock className="h-4 w-4" />}
              variant="warning"
            />
            <TimelineSection
              title="Today"
              posts={groupedPosts.today}
              icon={<ArrowUp className="h-4 w-4" />}
              emptyText="Nothing scheduled for today"
            />
            <TimelineSection
              title="Tomorrow"
              posts={groupedPosts.tomorrow}
              icon={<ChevronRight className="h-4 w-4" />}
            />
            <TimelineSection
              title="This Week"
              posts={groupedPosts.thisWeek}
              icon={<Calendar className="h-4 w-4" />}
            />
            <TimelineSection
              title="Later"
              posts={groupedPosts.later}
              icon={<Clock className="h-4 w-4" />}
            />
            <TimelineSection
              title="Drafts & Ideas"
              posts={groupedPosts.drafts}
              icon={<Edit3 className="h-4 w-4" />}
            />
            <TimelineSection
              title="Published"
              posts={groupedPosts.published}
              icon={<Check className="h-4 w-4" />}
              variant="success"
            />
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <Card className="w-full max-w-xl animate-in max-h-[90vh] overflow-auto">
              <CardHeader>
                <CardTitle className="text-base">
                  {editingPost ? 'Edit Post' : 'Create Post'}
                </CardTitle>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-lg hover:bg-[rgb(var(--glass-inset))] text-3"
                >
                  <X className="h-4 w-4" />
                </button>
              </CardHeader>
              
              <CardContent className="space-y-5">
                {/* Platform & Status row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-3 mb-2">Platform</label>
                    <Select
                      value={formData.platform_id}
                      onChange={(e) => setFormData({ ...formData, platform_id: e.target.value })}
                    >
                      <option value="">Select platform</option>
                      {platforms.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <label className="block text-xs text-3 mb-2">Status</label>
                    <Select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as PostFormData['status'] })}
                    >
                      <option value="idea">💡 Idea</option>
                      <option value="draft">📝 Draft</option>
                      <option value="scheduled">📅 Scheduled</option>
                      <option value="published">✅ Published</option>
                    </Select>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-xs text-3 mb-2">Content</label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="What's on your mind?"
                    rows={6}
                    className="resize-none"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-4">
                      {formData.platform_id && platforms.find(p => p.id === formData.platform_id)?.name === 'X/Twitter' && (
                        <span className={formData.content.length > 280 ? 'text-red-400' : ''}>
                          {280 - formData.content.length} characters remaining
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-4">{formData.content.length}</span>
                  </div>
                </div>

                {/* Theme & Schedule row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-3 mb-2">Theme</label>
                    <Select
                      value={formData.theme_id}
                      onChange={(e) => setFormData({ ...formData, theme_id: e.target.value })}
                    >
                      <option value="">Select theme</option>
                      {themes.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <label className="block text-xs text-3 mb-2">Schedule For</label>
                    <Input
                      type="datetime-local"
                      value={formData.scheduled_for}
                      onChange={(e) => setFormData({ ...formData, scheduled_for: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button onClick={savePost} disabled={!formData.content.trim()} className="gap-2">
                  <Check className="h-4 w-4" />
                  {editingPost ? 'Save' : 'Create'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
