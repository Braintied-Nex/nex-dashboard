'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Post, Platform, Theme } from '@/lib/supabase/types'
import { 
  Plus, 
  Filter, 
  Search,
  MoreHorizontal,
  Calendar,
  Send
} from 'lucide-react'

export default function PostsPage() {
  const [posts, setPosts] = useState<(Post & { platform?: Platform; theme?: Theme })[]>([])
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [themes, setThemes] = useState<Theme[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewPost, setShowNewPost] = useState(false)
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
      
      setPosts((postsRes.data || []) as any)
      setPlatforms((platformsRes.data || []) as any)
      setThemes((themesRes.data || []) as any)
      setLoading(false)
    }
    loadData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function createPost() {
    if (!newPost.content.trim()) return
    
    const { data, error } = await supabase
      .from('nex_posts')
      .insert({
        content: newPost.content,
        platform_id: newPost.platform_id || null,
        theme_id: newPost.theme_id || null,
        status: newPost.status
      } as any)
      .select('*, platform:nex_platforms(*), theme:nex_themes(*)')
      .single()

    if (data) {
      setPosts([data as any, ...posts])
      setNewPost({ content: '', platform_id: '', theme_id: '', status: 'draft' })
      setShowNewPost(false)
    }
  }

  const statusColors: Record<string, string> = {
    idea: 'bg-purple-500/20 text-purple-400',
    draft: 'bg-yellow-500/20 text-yellow-400',
    scheduled: 'bg-blue-500/20 text-blue-400',
    published: 'bg-green-500/20 text-green-400',
    archived: 'bg-zinc-700 text-zinc-400'
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Posts</h1>
          <p className="text-zinc-400 mt-1">Manage your content across all platforms</p>
        </div>
        <button
          onClick={() => setShowNewPost(true)}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-400 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Post
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search posts..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors">
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>

      {/* New Post Modal */}
      {showNewPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 w-full max-w-2xl mx-4">
            <div className="p-6 border-b border-zinc-800">
              <h2 className="text-xl font-semibold">Create New Post</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Content</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="What's on your mind?"
                  rows={4}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 resize-none"
                />
                <p className="text-xs text-zinc-500 mt-1">{newPost.content.length} characters</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Platform</label>
                  <select
                    value={newPost.platform_id}
                    onChange={(e) => setNewPost({ ...newPost, platform_id: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-600"
                  >
                    <option value="">Select platform</option>
                    {platforms.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Theme</label>
                  <select
                    value={newPost.theme_id}
                    onChange={(e) => setNewPost({ ...newPost, theme_id: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-600"
                  >
                    <option value="">Select theme</option>
                    {themes.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-zinc-800 flex justify-end gap-3">
              <button
                onClick={() => setShowNewPost(false)}
                className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createPost}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-400 transition-colors"
              >
                <Send className="h-4 w-4" />
                Create Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Posts List */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-zinc-500">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            <p className="mb-4">No posts yet</p>
            <button
              onClick={() => setShowNewPost(true)}
              className="text-yellow-500 hover:text-yellow-400"
            >
              Create your first post →
            </button>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {posts.map((post) => (
              <div key={post.id} className="p-6 hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[post.status]}`}>
                        {post.status}
                      </span>
                      {post.platform && (
                        <span className="text-xs text-zinc-500">{post.platform.name}</span>
                      )}
                      {post.theme && (
                        <span 
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${post.theme.color || '#666'}20`, color: post.theme.color || '#a1a1aa' }}
                        >
                          {post.theme.name}
                        </span>
                      )}
                    </div>
                    <p className="text-white whitespace-pre-wrap">{post.content}</p>
                    <p className="text-xs text-zinc-500 mt-2">
                      Created {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button className="p-2 text-zinc-500 hover:text-white transition-colors">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
