'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Post, Platform, Theme } from '@/lib/supabase/types'
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Button, Badge, Input, Textarea, Select } from '@/components/ui'
import { 
  Plus, 
  Search,
  MoreHorizontal,
  X,
  Send,
  FileText,
  Edit3,
  Trash2,
  Calendar,
  Clock,
  Check,
  Filter,
  Twitter,
  Linkedin,
  MessageSquare,
  Github,
  BookOpen
} from 'lucide-react'

type PostWithRelations = Post & { platform?: Platform | null; theme?: Theme | null }

const statusVariants: Record<string, 'success' | 'warning' | 'info' | 'error' | 'default'> = {
  published: 'success',
  scheduled: 'info',
  draft: 'warning',
  idea: 'default',
  archived: 'default',
}

const platformIcons: Record<string, React.ReactNode> = {
  'X/Twitter': <Twitter className="h-4 w-4" />,
  'LinkedIn': <Linkedin className="h-4 w-4" />,
  'Reddit': <MessageSquare className="h-4 w-4" />,
  'GitHub': <Github className="h-4 w-4" />,
  'Substack': <BookOpen className="h-4 w-4" />,
}

type PostFormData = {
  content: string
  platform_id: string
  theme_id: string
  status: 'idea' | 'draft' | 'scheduled' | 'published' | 'archived'
  scheduled_for: string
}

export default function PostsPage() {
  const [posts, setPosts] = useState<PostWithRelations[]>([])
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [themes, setThemes] = useState<Theme[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingPost, setEditingPost] = useState<PostWithRelations | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [platformFilter, setPlatformFilter] = useState<string>('all')
  const [showMenu, setShowMenu] = useState<string | null>(null)
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

  function openNewPost() {
    setEditingPost(null)
    setFormData({
      content: '',
      platform_id: '',
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
    setShowMenu(null)
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
      await supabase
        .from('nex_posts')
        .update(postData)
        .eq('id', editingPost.id)
    } else {
      await supabase
        .from('nex_posts')
        .insert(postData)
    }

    setShowModal(false)
    loadData()
  }

  async function deletePost(id: string) {
    if (!confirm('Delete this post?')) return
    await supabase.from('nex_posts').delete().eq('id', id)
    setShowMenu(null)
    loadData()
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('nex_posts').update({ status }).eq('id', id)
    setShowMenu(null)
    loadData()
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.title?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter
    const matchesPlatform = platformFilter === 'all' || post.platform_id === platformFilter
    return matchesSearch && matchesStatus && matchesPlatform
  })

  const statusCounts = {
    all: posts.length,
    scheduled: posts.filter(p => p.status === 'scheduled').length,
    draft: posts.filter(p => p.status === 'draft').length,
    idea: posts.filter(p => p.status === 'idea').length,
    published: posts.filter(p => p.status === 'published').length,
  }

  const threadGroups = filteredPosts.reduce((acc, post) => {
    if (post.thread_id) {
      if (!acc[post.thread_id]) acc[post.thread_id] = []
      acc[post.thread_id].push(post)
    }
    return acc
  }, {} as Record<string, PostWithRelations[]>)

  // Sort thread posts by position
  Object.values(threadGroups).forEach(group => {
    group.sort((a, b) => (a.thread_position || 0) - (b.thread_position || 0))
  })

  const standaloneAndThreadHeads = filteredPosts.filter(post => 
    !post.thread_id || post.thread_position === 1
  )

  return (
    <div className="p-8 max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Posts</h1>
          <p className="text-[rgb(var(--muted-fg))]">
            {posts.length} posts · {Object.keys(threadGroups).length} threads
          </p>
        </div>
        <Button onClick={openNewPost}>
          <Plus className="h-4 w-4" />
          New Post
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgb(var(--muted-fg))]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts..."
            className="pl-10"
          />
        </div>
        <Select 
          value={platformFilter} 
          onChange={(e) => setPlatformFilter(e.target.value)}
          className="w-40"
        >
          <option value="all">All Platforms</option>
          {platforms.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </Select>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'scheduled', 'draft', 'idea', 'published'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              statusFilter === status 
                ? 'glass-elevated text-[rgb(var(--fg))]' 
                : 'text-[rgb(var(--muted-fg))] hover:text-[rgb(var(--fg))]'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            <span className="ml-2 text-xs opacity-60">
              {statusCounts[status as keyof typeof statusCounts]}
            </span>
          </button>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
          <Card className="w-full max-w-2xl animate-scale-in max-h-[90vh] overflow-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{editingPost ? 'Edit Post' : 'Create New Post'}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm text-[rgb(var(--muted-fg))] mb-2">Content</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="What's on your mind?"
                  rows={6}
                />
                <p className="text-xs text-[rgb(var(--muted-fg))] mt-1">
                  {formData.content.length} characters
                  {formData.platform_id && platforms.find(p => p.id === formData.platform_id)?.name === 'X/Twitter' && (
                    <span className={formData.content.length > 280 ? ' text-red-400' : ''}>
                      {' '}/ 280 for X
                    </span>
                  )}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[rgb(var(--muted-fg))] mb-2">Platform</label>
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
                  <label className="block text-sm text-[rgb(var(--muted-fg))] mb-2">Theme</label>
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[rgb(var(--muted-fg))] mb-2">Status</label>
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
                <div>
                  <label className="block text-sm text-[rgb(var(--muted-fg))] mb-2">Schedule For</label>
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
              <Button onClick={savePost} disabled={!formData.content.trim()}>
                <Check className="h-4 w-4" />
                {editingPost ? 'Save Changes' : 'Create Post'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Posts List */}
      <Card>
        {loading ? (
          <div className="p-12 text-center text-[rgb(var(--muted-fg))]">
            Loading...
          </div>
        ) : standaloneAndThreadHeads.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="h-8 w-8 mx-auto mb-3 text-[rgb(var(--muted-fg))] opacity-50" />
            <p className="text-[rgb(var(--muted-fg))] mb-4">
              {searchQuery || statusFilter !== 'all' ? 'No posts match your filters' : 'No posts yet'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Button onClick={openNewPost}>
                Create your first post
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-[rgb(var(--border))]">
            {standaloneAndThreadHeads.map((post) => {
              const threadPosts = post.thread_id ? threadGroups[post.thread_id] : [post]
              const isThread = threadPosts.length > 1
              
              return (
                <div key={post.id} className="p-6">
                  {/* Thread indicator */}
                  {isThread && (
                    <div className="flex items-center gap-2 mb-3 text-xs text-[rgb(var(--muted-fg))]">
                      <div className="h-px flex-1 bg-[rgb(var(--border))]" />
                      <span>🧵 Thread ({threadPosts.length} posts)</span>
                      <div className="h-px flex-1 bg-[rgb(var(--border))]" />
                    </div>
                  )}
                  
                  {threadPosts.map((threadPost, idx) => (
                    <div 
                      key={threadPost.id}
                      className={`${idx > 0 ? 'mt-4 pt-4 border-t border-[rgb(var(--border)/0.5)] ml-4' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Badge variant={statusVariants[threadPost.status] || 'default'}>
                              {threadPost.status}
                            </Badge>
                            {threadPost.platform && (
                              <span className="flex items-center gap-1 text-xs text-[rgb(var(--muted-fg))]">
                                {platformIcons[threadPost.platform.name]}
                                {threadPost.platform.name}
                              </span>
                            )}
                            {threadPost.theme && (
                              <span 
                                className="text-xs px-2 py-0.5 rounded-md"
                                style={{ 
                                  backgroundColor: `${threadPost.theme.color || '#666'}20`, 
                                  color: threadPost.theme.color || '#a1a1aa' 
                                }}
                              >
                                {threadPost.theme.name}
                              </span>
                            )}
                            {isThread && (
                              <span className="text-xs text-[rgb(var(--muted-fg))]">
                                {threadPost.thread_position}/{threadPosts.length}
                              </span>
                            )}
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{threadPost.content}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-[rgb(var(--muted-fg))]">
                            <span>Created {new Date(threadPost.created_at).toLocaleDateString()}</span>
                            {threadPost.scheduled_for && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(threadPost.scheduled_for).toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="relative">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setShowMenu(showMenu === threadPost.id ? null : threadPost.id)}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                          {showMenu === threadPost.id && (
                            <div className="absolute right-0 top-full mt-1 glass-elevated rounded-lg py-1 min-w-[140px] z-10">
                              <button 
                                onClick={() => openEditPost(threadPost)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-[rgb(var(--muted))] flex items-center gap-2"
                              >
                                <Edit3 className="h-4 w-4" /> Edit
                              </button>
                              {threadPost.status === 'draft' && (
                                <button 
                                  onClick={() => updateStatus(threadPost.id, 'scheduled')}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-[rgb(var(--muted))] flex items-center gap-2"
                                >
                                  <Calendar className="h-4 w-4" /> Schedule
                                </button>
                              )}
                              {threadPost.status === 'scheduled' && (
                                <button 
                                  onClick={() => updateStatus(threadPost.id, 'draft')}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-[rgb(var(--muted))] flex items-center gap-2"
                                >
                                  <FileText className="h-4 w-4" /> Back to Draft
                                </button>
                              )}
                              <button 
                                onClick={() => deletePost(threadPost.id)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-[rgb(var(--muted))] flex items-center gap-2 text-red-400"
                              >
                                <Trash2 className="h-4 w-4" /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}
