import { createClient } from '@/lib/supabase/server'
import type { Post, Platform, Theme } from '@/lib/supabase/types'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type PostWithRelations = Post & { platform: Platform | null; theme: Theme | null }

export default async function CalendarPage() {
  const supabase = await createClient()
  
  const { data: posts } = await supabase
    .from('nex_posts')
    .select('*, platform:nex_platforms(*), theme:nex_themes(*)')
    .in('status', ['scheduled', 'published'])
    .order('scheduled_for', { ascending: true }) as { data: PostWithRelations[] | null }

  // Generate calendar days for current month
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startPad = firstDay.getDay()
  
  const days: (number | null)[] = []
  for (let i = 0; i < startPad; i++) days.push(null)
  for (let i = 1; i <= lastDay.getDate(); i++) days.push(i)

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Content Calendar</h1>
        <p className="text-zinc-400 mt-1">Plan and schedule your content</p>
      </div>

      {/* Calendar */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        {/* Month Navigation */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold">
            {monthNames[month]} {year}
          </h2>
          <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-zinc-800">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-4 text-center text-sm font-medium text-zinc-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {days.map((day, i) => {
            const isToday = day === today.getDate()
            const dateStr = day ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : ''
            const dayPosts = posts?.filter(p => 
              p.scheduled_for?.startsWith(dateStr) || p.published_at?.startsWith(dateStr)
            ) || []

            return (
              <div
                key={i}
                className={`min-h-[120px] p-2 border-b border-r border-zinc-800 ${
                  day ? 'hover:bg-zinc-800/50' : 'bg-zinc-950'
                }`}
              >
                {day && (
                  <>
                    <span className={`inline-flex items-center justify-center w-7 h-7 text-sm rounded-full ${
                      isToday ? 'bg-yellow-500 text-black font-bold' : ''
                    }`}>
                      {day}
                    </span>
                    <div className="mt-1 space-y-1">
                      {dayPosts.slice(0, 3).map((post) => (
                        <div
                          key={post.id}
                          className="text-xs p-1 rounded truncate"
                          style={{ 
                            backgroundColor: post.theme?.color ? `${post.theme.color}20` : '#27272a',
                            color: post.theme?.color || '#a1a1aa'
                          }}
                          title={post.content}
                        >
                          {post.platform?.name}: {post.content.slice(0, 20)}...
                        </div>
                      ))}
                      {dayPosts.length > 3 && (
                        <div className="text-xs text-zinc-500">
                          +{dayPosts.length - 3} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Upcoming */}
      <div className="mt-8 bg-zinc-900 rounded-xl border border-zinc-800">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-lg font-semibold">Upcoming Scheduled</h2>
        </div>
        <div className="divide-y divide-zinc-800">
          {posts && posts.filter(p => p.status === 'scheduled').length > 0 ? (
            posts.filter(p => p.status === 'scheduled').slice(0, 5).map((post) => (
              <div key={post.id} className="p-4 flex items-center gap-4">
                <div className="text-center min-w-[60px]">
                  <div className="text-2xl font-bold">
                    {post.scheduled_for ? new Date(post.scheduled_for).getDate() : '—'}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {post.scheduled_for ? new Date(post.scheduled_for).toLocaleDateString('en', { month: 'short' }) : ''}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{post.content}</p>
                  <p className="text-xs text-zinc-500 mt-1">{post.platform?.name}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-zinc-500">
              No scheduled posts yet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
