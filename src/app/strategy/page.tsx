import { createClient } from '@/lib/supabase/server'
import type { Platform } from '@/lib/supabase/types'
import { 
  Twitter, 
  Linkedin, 
  Github, 
  Mail,
  Target,
  Users,
  Clock,
  FileText
} from 'lucide-react'

const platformIcons: Record<string, React.ReactNode> = {
  twitter: <Twitter className="h-6 w-6" />,
  linkedin: <Linkedin className="h-6 w-6" />,
  github: <Github className="h-6 w-6" />,
  mail: <Mail className="h-6 w-6" />,
  'message-square': <Mail className="h-6 w-6" />,
}

// Default strategies for each platform
const defaultStrategies: Record<string, {
  goal: string
  audience: string
  frequency: string
  contentMix: { type: string; percentage: number }[]
  notes: string
}> = {
  'X/Twitter': {
    goal: 'Build Sentigen brand awareness + establish Nex as a credible AI entity in the founder/AI space',
    audience: 'Founders, indie hackers, AI enthusiasts, tech early adopters',
    frequency: '2-3x daily (mix of original + engagement)',
    contentMix: [
      { type: 'Product updates', percentage: 20 },
      { type: 'AI industry takes', percentage: 25 },
      { type: 'Building in public', percentage: 30 },
      { type: 'Engagement/replies', percentage: 25 },
    ],
    notes: `• Lead with value, not promotion
• Quote tweet interesting AI news with hot takes
• Share behind-the-scenes of building Sentigen
• Engage authentically with the founder community
• Use threads for deeper content`
  },
  'LinkedIn': {
    goal: 'Position Galen as thought leader in AI-native business building',
    audience: 'Executives, founders, VCs, enterprise decision makers',
    frequency: '3-4x weekly',
    contentMix: [
      { type: 'Thought leadership', percentage: 40 },
      { type: 'Company updates', percentage: 20 },
      { type: 'Industry insights', percentage: 25 },
      { type: 'Personal stories', percentage: 15 },
    ],
    notes: `• More polished, professional tone
• Focus on business value and ROI
• Share learnings from building Braintied portfolio
• Leverage carousel posts for frameworks
• I ghostwrite, Galen's voice`
  },
  'Substack': {
    goal: 'Deep-dive content that establishes expertise and builds email list',
    audience: 'Engaged followers wanting deeper insights',
    frequency: '1-2x weekly',
    contentMix: [
      { type: 'Technical deep-dives', percentage: 30 },
      { type: 'Industry analysis', percentage: 30 },
      { type: 'Building journey', percentage: 25 },
      { type: 'Predictions/opinions', percentage: 15 },
    ],
    notes: `• Long-form content that can't fit in tweets
• Repurpose into thread content
• Build email list for product launches
• Consider "Dispatches from an AI" angle`
  },
  'Reddit': {
    goal: 'Community engagement and feedback gathering',
    audience: 'r/startups, r/SaaS, r/artificial, r/Entrepreneur',
    frequency: 'As relevant (not spammy)',
    contentMix: [
      { type: 'Helpful comments', percentage: 50 },
      { type: 'Ask for feedback', percentage: 20 },
      { type: 'Share insights', percentage: 20 },
      { type: 'Announcements', percentage: 10 },
    ],
    notes: `• Never self-promote without value
• Build karma through genuine help
• Use for early user feedback
• Great for finding pain points`
  },
  'GitHub': {
    goal: 'Build developer credibility and contribute to ecosystem',
    audience: 'Developers, open source community',
    frequency: 'Continuous contributions',
    contentMix: [
      { type: 'Code contributions', percentage: 40 },
      { type: 'Documentation', percentage: 25 },
      { type: 'Issue triage', percentage: 20 },
      { type: 'Open source projects', percentage: 15 },
    ],
    notes: `• Contribute to AI/LLM tooling
• Open source useful utilities
• Good commit messages and docs
• Build real developer trust`
  },
}

export default async function StrategyPage() {
  const supabase = await createClient()
  
  const { data: platforms } = await supabase
    .from('nex_platforms')
    .select('*')
    .order('created_at') as { data: Platform[] | null }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Content Strategy</h1>
        <p className="text-zinc-400 mt-1">My approach for each platform</p>
      </div>

      {/* Strategy Cards */}
      <div className="space-y-6">
        {platforms?.map((platform) => {
          const strategy = defaultStrategies[platform.name]
          if (!strategy) return null

          return (
            <div key={platform.id} className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
              {/* Platform Header */}
              <div className="p-6 border-b border-zinc-800 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-zinc-800 flex items-center justify-center">
                  {platformIcons[platform.icon || 'mail']}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{platform.name}</h2>
                  <p className="text-sm text-zinc-500">{platform.handle || 'Setup pending'}</p>
                </div>
              </div>

              {/* Strategy Content */}
              <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Goal */}
                  <div>
                    <div className="flex items-center gap-2 text-sm text-zinc-400 mb-2">
                      <Target className="h-4 w-4" />
                      <span>Goal</span>
                    </div>
                    <p className="text-white">{strategy.goal}</p>
                  </div>

                  {/* Audience */}
                  <div>
                    <div className="flex items-center gap-2 text-sm text-zinc-400 mb-2">
                      <Users className="h-4 w-4" />
                      <span>Target Audience</span>
                    </div>
                    <p className="text-white">{strategy.audience}</p>
                  </div>

                  {/* Frequency */}
                  <div>
                    <div className="flex items-center gap-2 text-sm text-zinc-400 mb-2">
                      <Clock className="h-4 w-4" />
                      <span>Posting Frequency</span>
                    </div>
                    <p className="text-white">{strategy.frequency}</p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Content Mix */}
                  <div>
                    <div className="flex items-center gap-2 text-sm text-zinc-400 mb-3">
                      <FileText className="h-4 w-4" />
                      <span>Content Mix</span>
                    </div>
                    <div className="space-y-2">
                      {strategy.contentMix.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span>{item.type}</span>
                              <span className="text-zinc-500">{item.percentage}%</span>
                            </div>
                            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-yellow-500 rounded-full"
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <p className="text-sm text-zinc-400 mb-2">Notes</p>
                    <pre className="text-sm text-zinc-300 whitespace-pre-wrap font-sans">
                      {strategy.notes}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
