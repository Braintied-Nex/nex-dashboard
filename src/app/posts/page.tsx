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
  FileText
} from 'lucide-react'

type PostWithRelations = Post & { platform?: Platform | null; theme?: Theme | null }

const statusVariants: Record<string, 'success' | 'warning' | 'info' | 'error' | 'default'> = {
  published: 'success',
  scheduled: 'info',
  draft: 'warning',
  idea: 'default',
  archived: 'default',
}

export default function PostsPage() {
  const [posts, setPosts] = useState<PostWithRelations[]>([])
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [themes, setThemes] = useState<Theme[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewPost, setShowNewPost] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [newPost, setNewPost] = useState({
    content: '',
    platform_id: '',
    theme_id: '',
    status: 'draft' as const
  })

  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      const [postsRes, platformsRes, themesRes] = await Promise.all([
        supabase
          .from('nex_posts')
          .select('*, platform:nex_platforms(*), theme:nex_themes(*)')
          .order('created_at', { ascending: false }),
        supabase.from('nex_platforms').select('*'),
        supabase.from('nex_themes').select('*')
      ])
      
      setPosts((postsRes.data || []) as PostWithRelations[])
      setPlatforms((platformsRes.data || []) as Platform[])
      setThemes((themesRes.data || []) as Theme[])
      setLoading(false)
    }
    loadData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function createPost() {
    if (!newPost.content.trim()) return
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from('nex_posts')
      .insert({
        content: newPost.content,
        platform_id: newPost.platform_id || null,
        theme_id: newPost.theme_id || null,
        status: newPost.status
      })
      .select('*, platform:nex_platforms(*), theme:nex_themes(*)')
      .single()

    if (data) {
      setPosts([data as PostWithRelations, ...posts])
      setNewPost({ content: '', platform_id: '', theme_id: '', status: 'draft' })
      setShowNewPost(false)
    }
  }

  const filteredPosts = posts.filter(post => 
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.title?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Posts</h1>
          <p className="text-[rgb(var(--muted-fg))]">Manage content across all platforms</p>
        </div>
        <Button onClick={() => setShowNewPost(true)}>
          <Plus className="h-4 w-4" />
          New Post
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgb(var(--muted-fg))]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts..."
            className="pl-10"
          />
        </div>
      </div>

      {/* New Post Modal */}
      {showNewPost && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <Card className="w-full max-w-2xl mx-4 animate-scale-in">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Create New Post</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowNewPost(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm text-[rgb(var(--muted-fg))] mb-2">Content</label>
                <Textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="What's on your mind?"
                  rows={4}
                />
                <p className="text-xs text-[rgb(var(--muted-fg))] mt-1">
                  {newPost.content.length} characters
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[rgb(var(--muted-fg))] mb-2">Platform</label>
                  <Select
                    value={newPost.platform_id}
                    onChange={(e) => setNewPost({ ...newPost, platform_id: e.target.value })}
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
                    value={newPost.theme_id}
                    onChange={(e) => setNewPost({ ...newPost, theme_id: e.target.value })}
                  >
                    <option value="">Select theme</option>
                    {themes.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowNewPost(false)}>
                Cancel
              </Button>
              <Button onClick={createPost} disabled={!newPost.content.trim()}>
                <Send className="h-4 w-4" />
                Create Post
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
        ) : filteredPosts.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="h-8 w-8 mx-auto mb-3 text-[rgb(var(--muted-fg))] opacity-50" />
            <p className="text-[rgb(var(--muted-fg))] mb-4">
              {searchQuery ? 'No posts match your search' : 'No posts yet'}
            </p>
            {!searchQuery && (
              <Button onClick={() => setShowNewPost(true)}>
                Create your first post
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-[rgb(var(--border))]">
            {filteredPosts.map((post) => (
              <div 
                key={post.id} 
                className="p-6 hover:bg-[rgb(var(--muted)/0.3)] transition-colors duration-[--duration-fast]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant={statusVariants[post.status] || 'default'}>
                        {post.status}
                      </Badge>
                      {post.platform && (
                        <span className="text-xs text-[rgb(var(--muted-fg))]">
                          {post.platform.name}
                        </span>
                      )}
                      {post.theme && (
                        <span 
                          className="text-xs px-2 py-0.5 rounded-[--radius-md]"
                          style={{ 
                            backgroundColor: `${post.theme.color || '#666'}20`, 
                            color: post.theme.color || '#a1a1aa' 
                          }}
                        >
                          {post.theme.name}
                        </span>
                      )}
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{post.content}</p>
                    <p className="text-xs text-[rgb(var(--muted-fg))] mt-2">
                      Created {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
