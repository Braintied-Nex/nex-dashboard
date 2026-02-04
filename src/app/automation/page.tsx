import {
  Bot,
  Clock,
  CheckCircle,
  AlertCircle,
  Pause,
  Play,
  Zap,
  Timer,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

// Cron architecture - hardcoded from our setup (these are the actual cron jobs)
const cronJobs = [
  {
    name: 'Reply Check',
    description: 'Checks for replies to our tweets and responds',
    schedule: 'Every 5 min',
    model: 'Haiku',
    timeout: '60s',
    session: 'isolated',
    status: 'active',
    category: 'engagement',
  },
  {
    name: 'Outbound Engagement',
    description: 'Finds and replies to high-value tweets from targets',
    schedule: 'Every 15 min',
    model: 'Haiku',
    timeout: '90s',
    session: 'isolated',
    status: 'active',
    category: 'engagement',
  },
  {
    name: 'Hourly Content',
    description: 'Posts original content or curated news (7am-11pm)',
    schedule: 'Hourly (7-23)',
    model: 'Sonnet',
    timeout: '120s',
    session: 'isolated',
    status: 'active',
    category: 'content',
  },
  {
    name: 'Post Log Update',
    description: 'Pulls metrics from X API, updates Supabase, regenerates log',
    schedule: 'Every 6h',
    model: 'Haiku',
    timeout: '90s',
    session: 'isolated',
    status: 'active',
    category: 'maintenance',
  },
  {
    name: 'Token Refresh',
    description: 'Refreshes X OAuth 2.0 access token',
    schedule: 'Every 90 min',
    model: 'Haiku',
    timeout: '30s',
    session: 'isolated',
    status: 'active',
    category: 'maintenance',
  },
  {
    name: 'Daily Intel',
    description: 'Gathers AI news, identifies content angles for the day',
    schedule: '7:00 AM daily',
    model: 'Sonnet',
    timeout: '180s',
    session: 'isolated',
    status: 'active',
    category: 'content',
  },
  {
    name: 'Weekly Review',
    description: 'Comprehensive performance review and strategy adjustments',
    schedule: 'Sunday 10 AM',
    model: 'Main session',
    timeout: '—',
    session: 'main',
    status: 'active',
    category: 'strategy',
  },
]

const categoryColors: Record<string, string> = {
  engagement: 'bg-purple-500/15 text-purple-400',
  content: 'bg-blue-500/15 text-blue-400',
  maintenance: 'bg-amber-500/15 text-amber-400',
  strategy: 'bg-green-500/15 text-green-400',
}

const modelColors: Record<string, string> = {
  'Haiku': 'text-cyan-400',
  'Sonnet': 'text-violet-400',
  'Opus': 'text-amber-400',
  'Main session': 'text-green-400',
}

export default function AutomationPage() {
  return (
    <div className="min-h-screen p-6 lg:p-8 animate-in">
      <div className="max-w-5xl mx-auto space-y-6">

        <header>
          <div className="flex items-center gap-1.5 text-3 text-xs mb-2">
            <Bot className="w-3.5 h-3.5" />
            Automation
          </div>
          <h1 className="text-[28px] font-semibold tracking-tight text-1">
            Cron Jobs
          </h1>
          <p className="text-2 text-sm mt-1">
            {cronJobs.length} jobs running · Model tiering: Haiku (high-freq) → Sonnet (creative) → Opus (direct chat)
          </p>
        </header>

        {/* Model Cost Overview */}
        <div className="grid grid-cols-3 gap-3">
          <div className="glass-panel p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-1">Haiku</span>
            </div>
            <p className="text-[11px] text-3">High-frequency automation</p>
            <p className="text-[10px] text-4 mt-1">Reply checks, metrics, token refresh</p>
          </div>
          <div className="glass-panel p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-medium text-1">Sonnet</span>
            </div>
            <p className="text-[11px] text-3">Creative content generation</p>
            <p className="text-[10px] text-4 mt-1">Hourly posts, daily intel, memes</p>
          </div>
          <div className="glass-panel p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-1">Opus</span>
            </div>
            <p className="text-[11px] text-3">Direct conversation only</p>
            <p className="text-[10px] text-4 mt-1">Reserved for Galen chats</p>
          </div>
        </div>

        {/* Jobs List */}
        <div className="glass-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgb(var(--glass-border))]">
                  <th className="text-left text-[10px] text-4 font-medium uppercase tracking-wider px-6 py-3">Job</th>
                  <th className="text-left text-[10px] text-4 font-medium uppercase tracking-wider px-3 py-3 w-28">Schedule</th>
                  <th className="text-center text-[10px] text-4 font-medium uppercase tracking-wider px-3 py-3 w-24">Model</th>
                  <th className="text-center text-[10px] text-4 font-medium uppercase tracking-wider px-3 py-3 w-24">Category</th>
                  <th className="text-center text-[10px] text-4 font-medium uppercase tracking-wider px-3 py-3 w-20">Timeout</th>
                  <th className="text-center text-[10px] text-4 font-medium uppercase tracking-wider px-3 py-3 w-20">Session</th>
                  <th className="text-center text-[10px] text-4 font-medium uppercase tracking-wider px-6 py-3 w-20">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgb(var(--glass-border))]">
                {cronJobs.map((job) => (
                  <tr key={job.name} className="hover:bg-[rgb(var(--glass-inset))] transition-colors">
                    <td className="px-6 py-3">
                      <div className="text-[13px] font-medium text-1">{job.name}</div>
                      <div className="text-[11px] text-4 mt-0.5">{job.description}</div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-4" />
                        <span className="text-[11px] text-2">{job.schedule}</span>
                      </div>
                    </td>
                    <td className="text-center px-3 py-3">
                      <span className={`text-[11px] font-medium ${modelColors[job.model] || 'text-3'}`}>
                        {job.model}
                      </span>
                    </td>
                    <td className="text-center px-3 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${categoryColors[job.category]}`}>
                        {job.category}
                      </span>
                    </td>
                    <td className="text-center px-3 py-3">
                      <span className="text-[11px] text-3 tabular-nums">{job.timeout}</span>
                    </td>
                    <td className="text-center px-3 py-3">
                      <span className="text-[10px] text-4">{job.session}</span>
                    </td>
                    <td className="text-center px-6 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="text-[10px] text-green-400">Active</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
