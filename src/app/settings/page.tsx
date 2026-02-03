import { createClient } from '@/lib/supabase/server'
import type { Platform } from '@/lib/supabase/types'
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import { 
  User, 
  Key, 
  Bell, 
  Zap,
  Database,
  Shield,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Twitter,
  Linkedin,
  MessageSquare,
  Github,
  Mail
} from 'lucide-react'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: platforms } = await supabase.from('nex_platforms').select('*') as { data: Platform[] | null }

  const connectedCount = platforms?.filter(p => p.api_enabled).length || 0
  const totalPlatforms = platforms?.length || 0

  const platformIcons: Record<string, React.ReactNode> = {
    'X/Twitter': <Twitter className="h-5 w-5" />,
    'LinkedIn': <Linkedin className="h-5 w-5" />,
    'Reddit': <MessageSquare className="h-5 w-5" />,
    'GitHub': <Github className="h-5 w-5" />,
    'Substack': <Mail className="h-5 w-5" />,
  }

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-[rgb(var(--muted-fg))] mb-2">
          <Zap className="h-4 w-4" />
          <span className="text-sm font-medium">Configuration</span>
        </div>
        <h1 className="text-3xl font-bold mb-1">Settings</h1>
        <p className="text-[rgb(var(--muted-fg))]">Configure your dashboard and connections</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm text-[rgb(var(--muted-fg))] mb-2">Display Name</label>
                <input
                  type="text"
                  defaultValue="Nex"
                  className="w-full px-4 py-2 bg-[rgb(var(--muted))] border border-[rgb(var(--border))] rounded-[--radius] text-[rgb(var(--fg))] focus:outline-none focus:border-[rgb(var(--accent))] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-[rgb(var(--muted-fg))] mb-2">Role</label>
                <input
                  type="text"
                  defaultValue="AI Co-founder @ Braintied"
                  className="w-full px-4 py-2 bg-[rgb(var(--muted))] border border-[rgb(var(--border))] rounded-[--radius] text-[rgb(var(--fg))] focus:outline-none focus:border-[rgb(var(--accent))] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-[rgb(var(--muted-fg))] mb-2">Bio</label>
                <textarea
                  rows={3}
                  defaultValue="Building Sentigen - AI Chief of Staff for founders. Sharing insights on AI, startups, and building in public."
                  className="w-full px-4 py-2 bg-[rgb(var(--muted))] border border-[rgb(var(--border))] rounded-[--radius] text-[rgb(var(--fg))] focus:outline-none focus:border-[rgb(var(--accent))] transition-colors resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* API Connections */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Platform Connections
              </CardTitle>
            </CardHeader>
            <div className="divide-y divide-[rgb(var(--border))]">
              {platforms?.map((platform) => (
                <div key={platform.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-[--radius] bg-[rgb(var(--muted))] flex items-center justify-center">
                      {platformIcons[platform.name] || <Zap className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-medium">{platform.name}</p>
                      <p className="text-sm text-[rgb(var(--muted-fg))]">
                        {platform.handle ? `@${platform.handle}` : 'Not connected'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {platform.api_enabled ? (
                      <Badge className="bg-green-500/15 text-green-400">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                    ) : (
                      <button className="px-4 py-2 bg-[rgb(var(--muted))] hover:bg-[rgb(var(--border))] text-[rgb(var(--fg))] rounded-[--radius] text-sm font-medium transition-colors">
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {(!platforms || platforms.length === 0) && (
                <div className="px-6 py-8 text-center text-[rgb(var(--muted-fg))]">
                  No platforms configured
                </div>
              )}
            </div>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Post published', desc: 'Get notified when a post goes live', enabled: true },
                { label: 'Engagement alerts', desc: 'High engagement on your content', enabled: true },
                { label: 'Schedule reminders', desc: 'Upcoming scheduled posts', enabled: false },
                { label: 'Research insights', desc: 'New research findings ready', enabled: false },
                { label: 'Trend alerts', desc: 'Relevant trends detected', enabled: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-[rgb(var(--muted-fg))]">{item.desc}</p>
                  </div>
                  <button className={`w-12 h-6 rounded-full relative transition-colors ${
                    item.enabled 
                      ? 'bg-[rgb(var(--accent))]' 
                      : 'bg-[rgb(var(--muted))]'
                  }`}>
                    <span className={`absolute top-1 w-4 h-4 rounded-full transition-all ${
                      item.enabled 
                        ? 'right-1 bg-white' 
                        : 'left-1 bg-[rgb(var(--muted-fg))]'
                    }`} />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Proactive Intelligence Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Proactive Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-[rgb(var(--muted))] rounded-[--radius-lg]">
                <p className="text-sm font-medium mb-2">Automated Tasks</p>
                <ul className="text-sm text-[rgb(var(--muted-fg))] space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    Research thought leaders daily
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    Monitor competitor activity
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    Track trending topics
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-[rgb(var(--muted-fg))]" />
                    Auto-draft content (coming soon)
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-[rgb(var(--muted-fg))]" />
                    Auto-respond to comments (coming soon)
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Connection Status */}
          <Card variant="glass">
            <CardContent className="py-6">
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-[rgb(var(--accent))]/20 flex items-center justify-center mx-auto mb-4">
                  <Database className="h-8 w-8 text-[rgb(var(--accent))]" />
                </div>
                <h3 className="font-semibold mb-1">Connection Status</h3>
                <p className="text-3xl font-bold text-[rgb(var(--accent))]">
                  {connectedCount}/{totalPlatforms}
                </p>
                <p className="text-sm text-[rgb(var(--muted-fg))]">platforms connected</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[rgb(var(--muted-fg))]">Database</span>
                <Badge className="bg-green-500/15 text-green-400">Connected</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[rgb(var(--muted-fg))]">API Status</span>
                <Badge className="bg-green-500/15 text-green-400">Healthy</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[rgb(var(--muted-fg))]">Last Sync</span>
                <span className="text-sm">Just now</span>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-900/50">
            <CardContent className="py-6">
              <div className="flex items-center gap-2 text-red-400 mb-4">
                <Shield className="h-5 w-5" />
                <h3 className="font-semibold">Danger Zone</h3>
              </div>
              <p className="text-sm text-[rgb(var(--muted-fg))] mb-4">
                Irreversible actions that affect your data
              </p>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 bg-red-500/10 text-red-400 rounded-[--radius] text-sm hover:bg-red-500/20 transition-colors border border-red-500/20">
                  Clear All Metrics
                </button>
                <button className="w-full px-4 py-2 bg-red-500/10 text-red-400 rounded-[--radius] text-sm hover:bg-red-500/20 transition-colors border border-red-500/20">
                  Reset All Data
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
