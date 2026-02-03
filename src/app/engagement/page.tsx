import { createClient } from '@/lib/supabase/server'
import type { EngagementItem } from '@/lib/supabase/types'
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import { 
  MessageCircle,
  AtSign,
  Reply,
  Quote,
  Mail,
  Twitter,
  Linkedin,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Sparkles,
  ThumbsUp,
  HelpCircle,
  Minus,
  ExternalLink,
  Zap
} from 'lucide-react'

export default async function EngagementPage() {
  const supabase = await createClient()
  
  const [
    { data: pendingItems },
    { data: allItems },
  ] = await Promise.all([
    supabase.from('nex_engagement_queue')
      .select('*')
      .eq('status', 'pending')
      .order('priority', { ascending: false })
      .order('discovered_at', { ascending: false }),
    supabase.from('nex_engagement_queue')
      .select('*')
      .order('discovered_at', { ascending: false })
      .limit(50)
  ]) as [
    { data: EngagementItem[] | null },
    { data: EngagementItem[] | null }
  ]

  const stats = {
    pending: allItems?.filter(i => i.status === 'pending').length || 0,
    drafting: allItems?.filter(i => i.status === 'drafting').length || 0,
    responded: allItems?.filter(i => i.status === 'responded').length || 0,
    skipped: allItems?.filter(i => i.status === 'skipped').length || 0,
    urgent: allItems?.filter(i => i.priority === 'urgent').length || 0,
    high: allItems?.filter(i => i.priority === 'high').length || 0,
  }

  const sourceIcon = (type: string) => {
    switch (type) {
      case 'mention': return <AtSign className="h-4 w-4" />
      case 'comment': return <MessageCircle className="h-4 w-4" />
      case 'reply': return <Reply className="h-4 w-4" />
      case 'quote': return <Quote className="h-4 w-4" />
      case 'dm': return <Mail className="h-4 w-4" />
      default: return <MessageCircle className="h-4 w-4" />
    }
  }

  const platformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitter': return <Twitter className="h-4 w-4" />
      case 'linkedin': return <Linkedin className="h-4 w-4" />
      case 'reddit': return <MessageSquare className="h-4 w-4" />
      default: return <MessageCircle className="h-4 w-4" />
    }
  }

  const sentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <ThumbsUp className="h-4 w-4 text-green-400" />
      case 'negative': return <AlertCircle className="h-4 w-4 text-red-400" />
      case 'question': return <HelpCircle className="h-4 w-4 text-blue-400" />
      default: return <Minus className="h-4 w-4 text-[rgb(var(--muted-fg))]" />
    }
  }

  const priorityColors: Record<string, string> = {
    urgent: 'bg-red-500/15 text-red-400 border-red-500/30',
    high: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    normal: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    low: 'bg-[rgb(var(--muted))] text-[rgb(var(--muted-fg))]',
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/15 text-yellow-400',
    drafting: 'bg-blue-500/15 text-blue-400',
    responded: 'bg-green-500/15 text-green-400',
    skipped: 'bg-[rgb(var(--muted))] text-[rgb(var(--muted-fg))]',
  }

  const hasItems = (allItems?.length || 0) > 0

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-[rgb(var(--muted-fg))] mb-2">
          <MessageCircle className="h-4 w-4" />
          <span className="text-sm font-medium">Response Management</span>
        </div>
        <h1 className="text-3xl font-bold mb-1">Engagement</h1>
        <p className="text-[rgb(var(--muted-fg))]">
          Manage comments, mentions, and engagement opportunities
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        <Card variant="glass">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-xs text-[rgb(var(--muted-fg))]">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Zap className="h-6 w-6 text-blue-400" />
              <div>
                <p className="text-2xl font-bold">{stats.drafting}</p>
                <p className="text-xs text-[rgb(var(--muted-fg))]">Drafting</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-400" />
              <div>
                <p className="text-2xl font-bold">{stats.responded}</p>
                <p className="text-xs text-[rgb(var(--muted-fg))]">Responded</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <XCircle className="h-6 w-6 text-[rgb(var(--muted-fg))]" />
              <div>
                <p className="text-2xl font-bold">{stats.skipped}</p>
                <p className="text-xs text-[rgb(var(--muted-fg))]">Skipped</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="glass" className={stats.urgent > 0 ? 'border-red-500/30' : ''}>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <AlertCircle className={`h-6 w-6 ${stats.urgent > 0 ? 'text-red-400' : 'text-[rgb(var(--muted-fg))]'}`} />
              <div>
                <p className="text-2xl font-bold">{stats.urgent}</p>
                <p className="text-xs text-[rgb(var(--muted-fg))]">Urgent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="glass" className={stats.high > 0 ? 'border-orange-500/30' : ''}>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Zap className={`h-6 w-6 ${stats.high > 0 ? 'text-orange-400' : 'text-[rgb(var(--muted-fg))]'}`} />
              <div>
                <p className="text-2xl font-bold">{stats.high}</p>
                <p className="text-xs text-[rgb(var(--muted-fg))]">High Pri</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {!hasItems ? (
        /* Empty State */
        <Card>
          <CardContent className="py-16 text-center">
            <Sparkles className="h-16 w-16 mx-auto mb-6 text-[rgb(var(--accent))] opacity-50" />
            <h2 className="text-2xl font-bold mb-3">Engagement Queue Empty</h2>
            <p className="text-[rgb(var(--muted-fg))] max-w-lg mx-auto mb-8">
              When people mention, reply to, or comment on your content, I&apos;ll track them here 
              and help you respond thoughtfully and consistently.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="p-4 bg-[rgb(var(--muted))] rounded-[--radius-lg] text-left">
                <AtSign className="h-6 w-6 text-blue-400 mb-2" />
                <h3 className="font-semibold text-sm mb-1">Mentions</h3>
                <p className="text-xs text-[rgb(var(--muted-fg))]">
                  When someone @mentions you
                </p>
              </div>
              <div className="p-4 bg-[rgb(var(--muted))] rounded-[--radius-lg] text-left">
                <MessageCircle className="h-6 w-6 text-green-400 mb-2" />
                <h3 className="font-semibold text-sm mb-1">Comments</h3>
                <p className="text-xs text-[rgb(var(--muted-fg))]">
                  Replies to your posts
                </p>
              </div>
              <div className="p-4 bg-[rgb(var(--muted))] rounded-[--radius-lg] text-left">
                <Quote className="h-6 w-6 text-purple-400 mb-2" />
                <h3 className="font-semibold text-sm mb-1">Quote Tweets</h3>
                <p className="text-xs text-[rgb(var(--muted-fg))]">
                  When your content is quoted
                </p>
              </div>
              <div className="p-4 bg-[rgb(var(--muted))] rounded-[--radius-lg] text-left">
                <Mail className="h-6 w-6 text-yellow-400 mb-2" />
                <h3 className="font-semibold text-sm mb-1">DMs</h3>
                <p className="text-xs text-[rgb(var(--muted-fg))]">
                  Direct messages (if enabled)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Queue - Main Focus */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Pending Responses
                  </span>
                  {stats.pending > 0 && (
                    <Badge className="bg-yellow-500/15 text-yellow-400">
                      {stats.pending} to review
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <div className="divide-y divide-[rgb(var(--border))]">
                {pendingItems && pendingItems.length > 0 ? (
                  pendingItems.map((item) => (
                    <div key={item.id} className="p-6 hover:bg-[rgb(var(--muted))]/50 transition-colors">
                      <div className="flex items-start gap-4">
                        {/* Platform/Source Icon */}
                        <div className="h-10 w-10 rounded-full bg-[rgb(var(--muted))] flex items-center justify-center flex-shrink-0">
                          {platformIcon(item.platform)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          {/* Header */}
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{item.author_name || item.author_handle}</span>
                                {item.author_handle && item.author_name && (
                                  <span className="text-sm text-[rgb(var(--muted-fg))]">@{item.author_handle}</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                {sourceIcon(item.source_type)}
                                <span className="text-xs text-[rgb(var(--muted-fg))] capitalize">{item.source_type}</span>
                                <span className="text-xs text-[rgb(var(--muted-fg))]">·</span>
                                <span className="text-xs text-[rgb(var(--muted-fg))]">{item.platform}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {sentimentIcon(item.sentiment)}
                              <Badge className={priorityColors[item.priority]}>
                                {item.priority}
                              </Badge>
                            </div>
                          </div>
                          
                          {/* Content */}
                          <p className="text-sm mb-3">{item.content}</p>
                          
                          {/* Context if exists */}
                          {item.context && (
                            <div className="text-xs text-[rgb(var(--muted-fg))] bg-[rgb(var(--muted))] p-2 rounded-[--radius] mb-3">
                              <span className="opacity-75">Replying to: </span>{item.context}
                            </div>
                          )}
                          
                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            <button className="px-3 py-1.5 bg-[rgb(var(--accent))] text-white rounded-[--radius] text-xs font-medium hover:opacity-90 transition-opacity">
                              Draft Response
                            </button>
                            <button className="px-3 py-1.5 bg-[rgb(var(--muted))] text-[rgb(var(--fg))] rounded-[--radius] text-xs font-medium hover:bg-[rgb(var(--border))] transition-colors">
                              Skip
                            </button>
                            {item.source_url && (
                              <a 
                                href={item.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 text-[rgb(var(--muted-fg))] rounded-[--radius] text-xs font-medium hover:text-[rgb(var(--fg))] transition-colors flex items-center gap-1"
                              >
                                <ExternalLink className="h-3 w-3" />
                                View
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-[rgb(var(--muted-fg))]">
                    <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>All caught up! No pending responses.</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar - Recent Activity */}
          <div className="space-y-6">
            {/* Response Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Response Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <p className="text-4xl font-bold text-[rgb(var(--accent))]">
                    {allItems && allItems.length > 0 
                      ? Math.round((stats.responded / allItems.length) * 100)
                      : 0}%
                  </p>
                  <p className="text-sm text-[rgb(var(--muted-fg))]">
                    {stats.responded} of {allItems?.length || 0} responded
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Responses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Recent Responses
                </CardTitle>
              </CardHeader>
              <div className="divide-y divide-[rgb(var(--border))] max-h-[300px] overflow-y-auto">
                {allItems?.filter(i => i.status === 'responded').slice(0, 5).map((item) => (
                  <div key={item.id} className="px-6 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      {platformIcon(item.platform)}
                      <span className="text-sm font-medium truncate">
                        {item.author_name || item.author_handle}
                      </span>
                    </div>
                    <p className="text-xs text-[rgb(var(--muted-fg))] truncate">
                      {item.content}
                    </p>
                  </div>
                )) || (
                  <div className="px-6 py-4 text-center text-[rgb(var(--muted-fg))] text-sm">
                    No responses yet
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
