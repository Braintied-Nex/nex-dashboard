import { createClient } from '@/lib/supabase/server'
import type { EngagementItem } from '@/lib/supabase/types'
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@/components/ui'
import { 
  MessageCircle,
  AtSign,
  Reply,
  Quote,
  Mail,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  ThumbsUp,
  HelpCircle,
  Minus,
  ExternalLink,
  Zap,
  Send,
  X
} from 'lucide-react'

// Platform icons
const PlatformIcon = ({ name, className = "h-4 w-4" }: { name: string; className?: string }) => {
  const icons: Record<string, React.ReactNode> = {
    'twitter': (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    'linkedin': (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    'reddit': (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0z"/>
      </svg>
    ),
  }
  return <>{icons[name.toLowerCase()] || <MessageCircle className={className} />}</>
}

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

  const sentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <ThumbsUp className="h-3.5 w-3.5 text-green-400" />
      case 'negative': return <AlertCircle className="h-3.5 w-3.5 text-red-400" />
      case 'question': return <HelpCircle className="h-3.5 w-3.5 text-blue-400" />
      default: return <Minus className="h-3.5 w-3.5 text-4" />
    }
  }

  const priorityColors: Record<string, string> = {
    urgent: 'bg-red-500/15 text-red-400',
    high: 'bg-orange-500/15 text-orange-400',
    normal: 'bg-blue-500/15 text-blue-400',
    low: 'bg-[rgb(var(--glass-inset))] text-4',
  }

  const hasItems = (allItems?.length || 0) > 0

  return (
    <div className="min-h-screen p-8 animate-in">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 text-3 mb-2">
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Response Management</span>
          </div>
          <h1 className="text-[28px] font-semibold text-1 tracking-tight">Engagement</h1>
          <p className="text-sm text-3 mt-1">
            {stats.pending > 0 
              ? `${stats.pending} item${stats.pending > 1 ? 's' : ''} need${stats.pending === 1 ? 's' : ''} attention`
              : 'All caught up'
            }
          </p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard 
            icon={Clock} 
            value={stats.pending} 
            label="Pending" 
            color="text-amber-400"
          />
          <StatCard 
            icon={Zap} 
            value={stats.drafting} 
            label="Drafting" 
            color="text-blue-400"
          />
          <StatCard 
            icon={CheckCircle2} 
            value={stats.responded} 
            label="Responded" 
            color="text-green-400"
          />
          <StatCard 
            icon={AlertCircle} 
            value={stats.urgent} 
            label="Urgent" 
            color={stats.urgent > 0 ? 'text-red-400' : 'text-4'}
          />
          <StatCard 
            icon={Zap} 
            value={stats.high} 
            label="High Pri" 
            color={stats.high > 0 ? 'text-orange-400' : 'text-4'}
          />
        </div>

        {!hasItems ? (
          /* Empty State */
          <Card>
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 rounded-2xl glass-inset flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-3" />
              </div>
              <h2 className="text-lg font-semibold mb-2">Engagement Queue Empty</h2>
              <p className="text-sm text-3 max-w-md mx-auto mb-8">
                When people mention, reply to, or comment on your content, I'll track them here 
                and help you respond thoughtfully.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
                {[
                  { icon: AtSign, label: 'Mentions', color: 'text-blue-400' },
                  { icon: MessageCircle, label: 'Comments', color: 'text-green-400' },
                  { icon: Quote, label: 'Quotes', color: 'text-purple-400' },
                  { icon: Mail, label: 'DMs', color: 'text-amber-400' },
                ].map(({ icon: Icon, label, color }) => (
                  <div key={label} className="p-4 glass-inset rounded-xl text-center">
                    <Icon className={`h-5 w-5 ${color} mx-auto mb-2`} />
                    <span className="text-xs text-2">{label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pending Queue */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Pending
                  </CardTitle>
                  {stats.pending > 0 && (
                    <Badge className="bg-amber-500/15 text-amber-400">
                      {stats.pending}
                    </Badge>
                  )}
                </CardHeader>
                <div className="divide-y divide-[rgb(var(--glass-border))]">
                  {pendingItems && pendingItems.length > 0 ? (
                    pendingItems.map((item) => (
                      <div key={item.id} className="p-5 hover:bg-[rgb(var(--glass-inset))] transition-colors">
                        <div className="flex items-start gap-4">
                          {/* Avatar */}
                          <div className="h-10 w-10 rounded-full glass-inset flex items-center justify-center flex-shrink-0">
                            <PlatformIcon name={item.platform} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            {/* Header */}
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm text-1">
                                    {item.author_name || item.author_handle}
                                  </span>
                                  {item.author_handle && item.author_name && (
                                    <span className="text-xs text-4">@{item.author_handle}</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-1 text-4">
                                  {sourceIcon(item.source_type)}
                                  <span className="text-xs capitalize">{item.source_type}</span>
                                  <span className="text-xs">·</span>
                                  <span className="text-xs">{item.platform}</span>
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
                            <p className="text-sm text-2 mb-3">{item.content}</p>
                            
                            {/* Context */}
                            {item.context && (
                              <div className="text-xs text-4 glass-inset p-2.5 rounded-lg mb-3">
                                <span className="opacity-75">Replying to: </span>
                                {item.context}
                              </div>
                            )}
                            
                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              <Button size="sm" className="gap-1.5">
                                <Send className="h-3 w-3" />
                                Draft Response
                              </Button>
                              <Button variant="ghost" size="sm" className="gap-1.5">
                                <X className="h-3 w-3" />
                                Skip
                              </Button>
                              {item.source_url && (
                                <a 
                                  href={item.source_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ml-auto flex items-center gap-1 text-xs text-4 hover:text-2 transition-colors"
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
                    <div className="p-8 text-center">
                      <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-400 opacity-50" />
                      <p className="text-sm text-3">All caught up! No pending responses.</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Response Rate */}
              <Card>
                <CardHeader>
                  <CardTitle>Response Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <p className="text-4xl font-bold text-1">
                      {allItems && allItems.length > 0 
                        ? Math.round((stats.responded / allItems.length) * 100)
                        : 0}%
                    </p>
                    <p className="text-xs text-4 mt-1">
                      {stats.responded} of {allItems?.length || 0} responded
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Responses */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Recent Responses
                  </CardTitle>
                </CardHeader>
                <div className="divide-y divide-[rgb(var(--glass-border))] max-h-[300px] overflow-y-auto">
                  {allItems?.filter(i => i.status === 'responded').slice(0, 5).map((item) => (
                    <div key={item.id} className="px-6 py-3">
                      <div className="flex items-center gap-2 mb-1">
                        <PlatformIcon name={item.platform} className="h-3.5 w-3.5 text-3" />
                        <span className="text-sm font-medium text-1 truncate">
                          {item.author_name || item.author_handle}
                        </span>
                      </div>
                      <p className="text-xs text-4 truncate">{item.content}</p>
                    </div>
                  )) || (
                    <div className="px-6 py-4 text-center text-sm text-4">
                      No responses yet
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ 
  icon: Icon, 
  value, 
  label, 
  color 
}: { 
  icon: any
  value: number
  label: string
  color: string
}) {
  return (
    <div className="glass-panel p-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl glass-inset flex items-center justify-center">
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
        <div>
          <p className="text-xl font-bold text-1">{value}</p>
          <p className="text-[10px] text-4 uppercase tracking-wide">{label}</p>
        </div>
      </div>
    </div>
  )
}
