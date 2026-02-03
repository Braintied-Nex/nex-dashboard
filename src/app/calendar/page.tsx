import { createClient } from '@/lib/supabase/server'
import type { Post, Platform, Theme } from '@/lib/supabase/types'
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import { ChevronLeft, ChevronRight, Calendar, Clock, ArrowRight, FileText } from 'lucide-react'
import Link from 'next/link'

type PostWithRelations = Post & { platform: Platform | null; theme: Theme | null }

// Platform icons as simple components  
const PlatformIcon = ({ name, className = "h-3.5 w-3.5" }: { name: string; className?: string }) => {
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
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701z"/>
      </svg>
    ),
  }
  return <>{icons[name] || <FileText className={className} />}</>
}

export default async function CalendarPage() {
  const supabase = await createClient()
  
  const { data: posts } = await supabase
    .from('nex_posts')
    .select('*, platform:nex_platforms(*), theme:nex_themes(*)')
    .in('status', ['scheduled', 'published', 'draft'])
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

  // Stats
  const scheduledPosts = posts?.filter(p => p.status === 'scheduled') || []
  const thisMonthPosts = scheduledPosts.filter(p => {
    if (!p.scheduled_for) return false
    const d = new Date(p.scheduled_for)
    return d.getMonth() === month && d.getFullYear() === year
  })

  // Get next 7 days of posts
  const next7Days = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    const dayPosts = posts?.filter(p => 
      p.scheduled_for?.startsWith(dateStr)
    ) || []
    next7Days.push({ date, posts: dayPosts })
  }

  return (
    <div className="min-h-screen p-8 animate-in">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 text-3 mb-2">
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-medium">Content Schedule</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[28px] font-semibold text-1 tracking-tight">Calendar</h1>
              <p className="text-sm text-3 mt-1">
                {thisMonthPosts.length} posts scheduled this month
              </p>
            </div>
            <Link 
              href="/posts"
              className="flex items-center gap-2 text-sm text-3 hover:text-2 transition-colors"
            >
              Manage Posts <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card>
              {/* Month Navigation */}
              <CardHeader className="flex-row items-center justify-between">
                <button className="p-2 rounded-xl hover:bg-[rgb(var(--glass-inset))] transition-colors text-3 hover:text-1">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <h2 className="text-lg font-semibold text-1">
                  {monthNames[month]} {year}
                </h2>
                <button className="p-2 rounded-xl hover:bg-[rgb(var(--glass-inset))] transition-colors text-3 hover:text-1">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </CardHeader>

              <CardContent className="p-4">
                {/* Day Headers */}
                <div className="grid grid-cols-7 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="py-2 text-center text-xs font-medium text-4">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, i) => {
                    const isToday = day === today.getDate()
                    const dateStr = day ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : ''
                    const dayPosts = posts?.filter(p => 
                      p.scheduled_for?.startsWith(dateStr) || p.published_at?.startsWith(dateStr)
                    ) || []
                    const hasPosts = dayPosts.length > 0

                    return (
                      <div
                        key={i}
                        className={`
                          min-h-[90px] p-2 rounded-xl transition-colors
                          ${day ? 'hover:bg-[rgb(var(--glass-inset))] cursor-pointer' : ''}
                          ${isToday ? 'glass-inset' : ''}
                        `}
                      >
                        {day && (
                          <>
                            <div className="flex items-center justify-between mb-1">
                              <span className={`
                                inline-flex items-center justify-center w-6 h-6 text-xs rounded-lg
                                ${isToday ? 'bg-[rgb(var(--fg))] text-[rgb(var(--bg))] font-bold' : 'text-2'}
                              `}>
                                {day}
                              </span>
                              {hasPosts && (
                                <span className="text-[10px] text-4">{dayPosts.length}</span>
                              )}
                            </div>
                            <div className="space-y-1">
                              {dayPosts.slice(0, 2).map((post) => (
                                <div
                                  key={post.id}
                                  className="flex items-center gap-1 text-[10px] px-1.5 py-1 rounded-md truncate"
                                  style={{ 
                                    backgroundColor: post.theme?.color ? `${post.theme.color}15` : 'rgb(var(--glass-inset))',
                                    color: post.theme?.color || 'rgb(var(--fg-3))'
                                  }}
                                  title={post.content}
                                >
                                  {post.platform && <PlatformIcon name={post.platform.name} className="h-2.5 w-2.5 flex-shrink-0" />}
                                  <span className="truncate">{post.content.slice(0, 15)}</span>
                                </div>
                              ))}
                              {dayPosts.length > 2 && (
                                <div className="text-[10px] text-4 px-1.5">
                                  +{dayPosts.length - 2} more
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Next 7 Days */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Next 7 Days
                </CardTitle>
              </CardHeader>
              <div className="divide-y divide-[rgb(var(--glass-border))]">
                {next7Days.map(({ date, posts: dayPosts }, idx) => {
                  const isToday = idx === 0
                  const dayName = isToday ? 'Today' : date.toLocaleDateString('en', { weekday: 'short' })
                  const dateNum = date.getDate()
                  
                  return (
                    <div key={idx} className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-10 h-10 rounded-xl flex flex-col items-center justify-center text-center
                          ${isToday ? 'bg-[rgb(var(--fg))] text-[rgb(var(--bg))]' : 'glass-inset text-2'}
                        `}>
                          <span className="text-[10px] uppercase">{dayName}</span>
                          <span className="text-sm font-semibold">{dateNum}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          {dayPosts.length > 0 ? (
                            <div className="space-y-1">
                              {dayPosts.slice(0, 2).map(post => (
                                <div key={post.id} className="flex items-center gap-2">
                                  {post.platform && (
                                    <PlatformIcon name={post.platform.name} className="h-3 w-3 text-3" />
                                  )}
                                  <span className="text-xs text-2 truncate">
                                    {post.content.slice(0, 30)}...
                                  </span>
                                </div>
                              ))}
                              {dayPosts.length > 2 && (
                                <span className="text-[10px] text-4">+{dayPosts.length - 2} more</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-4">No posts scheduled</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* Upcoming Scheduled */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming</CardTitle>
              </CardHeader>
              <div className="divide-y divide-[rgb(var(--glass-border))]">
                {scheduledPosts.length > 0 ? (
                  scheduledPosts.slice(0, 5).map((post) => (
                    <div key={post.id} className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl glass-inset flex flex-col items-center justify-center">
                          <div className="text-lg font-bold text-1">
                            {post.scheduled_for ? new Date(post.scheduled_for).getDate() : '—'}
                          </div>
                          <div className="text-[10px] text-4 uppercase">
                            {post.scheduled_for ? new Date(post.scheduled_for).toLocaleDateString('en', { month: 'short' }) : ''}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-1 line-clamp-2">{post.content}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            {post.platform && (
                              <span className="flex items-center gap-1 text-[10px] text-3">
                                <PlatformIcon name={post.platform.name} className="h-3 w-3" />
                                {post.platform.name}
                              </span>
                            )}
                            {post.scheduled_for && (
                              <span className="text-[10px] text-4">
                                {new Date(post.scheduled_for).toLocaleTimeString('en', { 
                                  hour: 'numeric', 
                                  minute: '2-digit' 
                                })}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-8 text-center">
                    <Calendar className="h-8 w-8 mx-auto mb-3 text-4 opacity-50" />
                    <p className="text-sm text-3">No scheduled posts</p>
                    <Link 
                      href="/posts"
                      className="inline-flex items-center gap-1 text-xs text-3 hover:text-2 mt-2"
                    >
                      Create a post <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
