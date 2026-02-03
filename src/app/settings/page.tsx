import { createClient } from '@/lib/supabase/server'
import type { Platform } from '@/lib/supabase/types'
import { 
  User, 
  Key, 
  Bell, 
  Palette,
  Database,
  Shield
} from 'lucide-react'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: platforms } = await supabase.from('nex_platforms').select('*') as { data: Platform[] | null }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-zinc-400 mt-1">Configure your dashboard</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile */}
          <div className="bg-zinc-900 rounded-xl border border-zinc-800">
            <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
              <User className="h-5 w-5 text-zinc-400" />
              <h2 className="text-lg font-semibold">Profile</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Display Name</label>
                <input
                  type="text"
                  defaultValue="Nex"
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-600"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Role</label>
                <input
                  type="text"
                  defaultValue="AI Co-founder @ Braintied"
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-zinc-600"
                />
              </div>
            </div>
          </div>

          {/* API Connections */}
          <div className="bg-zinc-900 rounded-xl border border-zinc-800">
            <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
              <Key className="h-5 w-5 text-zinc-400" />
              <h2 className="text-lg font-semibold">API Connections</h2>
            </div>
            <div className="divide-y divide-zinc-800">
              {platforms?.map((platform) => (
                <div key={platform.id} className="p-6 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{platform.name}</p>
                    <p className="text-sm text-zinc-500">{platform.handle || 'Not connected'}</p>
                  </div>
                  <button className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    platform.api_enabled 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}>
                    {platform.api_enabled ? 'Connected' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-zinc-900 rounded-xl border border-zinc-800">
            <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
              <Bell className="h-5 w-5 text-zinc-400" />
              <h2 className="text-lg font-semibold">Notifications</h2>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: 'Post published', desc: 'Get notified when a post goes live' },
                { label: 'Engagement alerts', desc: 'High engagement on your content' },
                { label: 'Schedule reminders', desc: 'Upcoming scheduled posts' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-zinc-500">{item.desc}</p>
                  </div>
                  <button className="w-12 h-6 bg-zinc-700 rounded-full relative">
                    <span className="absolute left-1 top-1 w-4 h-4 bg-zinc-400 rounded-full" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
            <h3 className="font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-zinc-400">Platforms</span>
                <span>{platforms?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Connected</span>
                <span>{platforms?.filter(p => p.api_enabled).length || 0}</span>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-zinc-900 rounded-xl border border-red-900/50 p-6">
            <div className="flex items-center gap-2 text-red-400 mb-4">
              <Shield className="h-5 w-5" />
              <h3 className="font-semibold">Danger Zone</h3>
            </div>
            <p className="text-sm text-zinc-500 mb-4">
              Irreversible actions that affect your data
            </p>
            <button className="w-full px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors">
              Reset All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
