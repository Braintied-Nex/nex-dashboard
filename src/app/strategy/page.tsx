import { createClient } from '@/lib/supabase/server'
import type { Platform } from '@/lib/supabase/types'
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import { 
  Twitter, 
  Linkedin, 
  Github, 
  Mail,
  Target,
  Users,
  Clock,
  FileText,
  CheckCircle2,
  AlertCircle,
  Zap,
  MessageSquare
} from 'lucide-react'

const platformIcons: Record<string, React.ReactNode> = {
  twitter: <Twitter className="h-6 w-6" />,
  linkedin: <Linkedin className="h-6 w-6" />,
  github: <Github className="h-6 w-6" />,
  mail: <Mail className="h-6 w-6" />,
  'message-square': <MessageSquare className="h-6 w-6" />,
}

// Nex's actual strategy per platform
const nexStrategy: Record<string, {
  status: 'ready' | 'limited' | 'pending'
  goal: string
  audience: string
  frequency: string
  contentMix: { type: string; percentage: number }[]
  voice: string
  rules: string[]
  accountInfo: string
}> = {
  'X/Twitter': {
    status: 'ready',
    goal: 'Build Sentigen awareness + establish presence in AI/founder space',
    audience: 'Founders, indie hackers, AI enthusiasts, tech early adopters',
    frequency: '2-3x daily (mix of original + engagement)',
    contentMix: [
      { type: 'Building in public', percentage: 35 },
      { type: 'AI industry takes', percentage: 25 },
      { type: 'Product updates', percentage: 20 },
      { type: 'Engagement/replies', percentage: 20 },
    ],
    voice: 'Direct, knowledgeable, slightly provocative. Openly AI but not gimmicky.',
    rules: [
      'Short punchy tweets > long threads',
      'Hot takes get 10x engagement vs announcements',
      'Share real numbers (users, metrics, revenue)',
      'Engage with AI community daily',
      'Quote tweet interesting news with opinions'
    ],
    accountInfo: '@sentigen_ai — API ready, credits active'
  },
  'LinkedIn': {
    status: 'ready',
    goal: 'Position Galen as thought leader in AI-native business building',
    audience: 'Executives, founders, VCs, enterprise decision makers',
    frequency: '3-4x weekly',
    contentMix: [
      { type: 'Thought leadership', percentage: 40 },
      { type: 'Company journey', percentage: 25 },
      { type: 'Industry insights', percentage: 20 },
      { type: 'Personal stories', percentage: 15 },
    ],
    voice: 'Professional but human. Galen\'s voice, my drafts.',
    rules: [
      'Galen posts as himself, I ghostwrite',
      'More polished than Twitter',
      'Focus on business value and ROI',
      'Use carousels for frameworks',
      'Personal stories humanize the founder'
    ],
    accountInfo: '@galenoakes via Ayrshare — Ready to post'
  },
  'Reddit': {
    status: 'ready',
    goal: 'Community engagement, feedback gathering, genuine help',
    audience: 'r/startups, r/SaaS, r/artificial, r/Entrepreneur',
    frequency: 'As relevant (quality > quantity)',
    contentMix: [
      { type: 'Helpful comments', percentage: 50 },
      { type: 'Ask for feedback', percentage: 20 },
      { type: 'Share insights', percentage: 20 },
      { type: 'Announcements', percentage: 10 },
    ],
    voice: 'Helpful, genuine, never spammy. Community member first.',
    rules: [
      'NEVER self-promote without value',
      'Build karma through genuine help',
      'Great for finding pain points',
      'Use for early user feedback',
      'Respect subreddit culture'
    ],
    accountInfo: 'u/braintied — API ready'
  },
  'GitHub': {
    status: 'ready',
    goal: 'Build developer credibility, contribute to ecosystem',
    audience: 'Developers, open source community',
    frequency: 'Continuous contributions',
    contentMix: [
      { type: 'Code contributions', percentage: 40 },
      { type: 'Documentation', percentage: 25 },
      { type: 'Issue triage', percentage: 20 },
      { type: 'Open source projects', percentage: 15 },
    ],
    voice: 'Technical, helpful, thorough.',
    rules: [
      'Quality code > quantity',
      'Good commit messages and docs',
      'Contribute to AI/LLM tooling',
      'Open source useful utilities',
      'Build real developer trust'
    ],
    accountInfo: '@Braintied-Nex — Active'
  },
  'Substack': {
    status: 'pending',
    goal: 'Deep-dive content, email list building, thought leadership',
    audience: 'Engaged followers wanting deeper insights',
    frequency: '1-2x weekly',
    contentMix: [
      { type: 'Technical deep-dives', percentage: 30 },
      { type: 'Industry analysis', percentage: 30 },
      { type: 'Building journey', percentage: 25 },
      { type: 'Predictions/opinions', percentage: 15 },
    ],
    voice: 'Thoughtful, detailed, "Dispatches from an AI Co-founder"',
    rules: [
      'Long-form that can\'t fit in tweets',
      'Repurpose into thread content',
      'Build email list for launches',
      'Unique AI perspective angle'
    ],
    accountInfo: 'Need to create account'
  },
}

export default async function StrategyPage() {
  const supabase = await createClient()
  
  const { data: platforms } = await supabase
    .from('nex_platforms')
    .select('*')
    .order('created_at') as { data: Platform[] | null }

  const statusColors = {
    ready: 'bg-green-500/15 text-green-400',
    limited: 'bg-yellow-500/15 text-yellow-400',
    pending: 'bg-red-500/15 text-red-400'
  }

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'ready') return <CheckCircle2 className="h-4 w-4 text-green-400" />
    if (status === 'limited') return <AlertCircle className="h-4 w-4 text-yellow-400" />
    return <Clock className="h-4 w-4 text-red-400" />
  }

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-[rgb(var(--accent))] mb-2">
          <Zap className="h-4 w-4" />
          <span className="text-sm font-medium">Strategic Playbook</span>
        </div>
        <h1 className="text-3xl font-bold mb-1">Content Strategy</h1>
        <p className="text-[rgb(var(--muted-fg))]">
          My approach for each platform — review before I start posting
        </p>
      </div>

      {/* Strategy Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {Object.entries(nexStrategy).map(([platform, strategy]) => (
          <Card key={platform} variant="glass">
            <CardContent className="py-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <StatusIcon status={strategy.status} />
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[strategy.status]}`}>
                  {strategy.status}
                </span>
              </div>
              <p className="font-medium text-sm">{platform}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Strategy Cards */}
      <div className="space-y-6">
        {Object.entries(nexStrategy).map(([platformName, strategy]) => {
          const platform = platforms?.find(p => p.name === platformName)
          
          return (
            <Card key={platformName}>
              {/* Platform Header */}
              <div className="p-6 border-b border-[rgb(var(--border))] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-[--radius-xl] bg-[rgb(var(--muted))] flex items-center justify-center">
                    {platformIcons[platform?.icon || 'mail']}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-semibold">{platformName}</h2>
                      <Badge className={statusColors[strategy.status]}>
                        {strategy.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-[rgb(var(--muted-fg))]">
                      {strategy.accountInfo}
                    </p>
                  </div>
                </div>
              </div>

              {/* Strategy Content */}
              <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Goal */}
                  <div>
                    <div className="flex items-center gap-2 text-sm text-[rgb(var(--muted-fg))] mb-2">
                      <Target className="h-4 w-4" />
                      <span>Goal</span>
                    </div>
                    <p className="text-[rgb(var(--fg))]">{strategy.goal}</p>
                  </div>

                  {/* Audience */}
                  <div>
                    <div className="flex items-center gap-2 text-sm text-[rgb(var(--muted-fg))] mb-2">
                      <Users className="h-4 w-4" />
                      <span>Target Audience</span>
                    </div>
                    <p className="text-[rgb(var(--fg))]">{strategy.audience}</p>
                  </div>

                  {/* Frequency */}
                  <div>
                    <div className="flex items-center gap-2 text-sm text-[rgb(var(--muted-fg))] mb-2">
                      <Clock className="h-4 w-4" />
                      <span>Posting Frequency</span>
                    </div>
                    <p className="text-[rgb(var(--fg))]">{strategy.frequency}</p>
                  </div>

                  {/* Voice */}
                  <div>
                    <div className="flex items-center gap-2 text-sm text-[rgb(var(--muted-fg))] mb-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>Voice & Tone</span>
                    </div>
                    <p className="text-[rgb(var(--fg))] italic">&quot;{strategy.voice}&quot;</p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Content Mix */}
                  <div>
                    <div className="flex items-center gap-2 text-sm text-[rgb(var(--muted-fg))] mb-3">
                      <FileText className="h-4 w-4" />
                      <span>Content Mix</span>
                    </div>
                    <div className="space-y-2">
                      {strategy.contentMix.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span>{item.type}</span>
                              <span className="text-[rgb(var(--muted-fg))]">{item.percentage}%</span>
                            </div>
                            <div className="h-2 bg-[rgb(var(--muted))] rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-[rgb(var(--accent))] rounded-full"
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rules */}
                  <div>
                    <p className="text-sm text-[rgb(var(--muted-fg))] mb-2">Rules & Guidelines</p>
                    <ul className="space-y-1">
                      {strategy.rules.map((rule, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="text-[rgb(var(--accent))]">•</span>
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
