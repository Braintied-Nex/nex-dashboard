import { createAdminClient } from '@/lib/supabase/admin'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Zap,
} from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function CostsPage() {
  const sb = createAdminClient()

  const { data: costs } = await sb
    .from('nex_daily_costs')
    .select('*')
    .order('date', { ascending: false })
    .limit(30)

  const allCosts = costs || []
  const totalCost = allCosts.reduce((s, c: any) => s + (c.total_cost_usd || 0), 0)
  const totalTweets = allCosts.reduce((s, c: any) => s + (c.tweets_posted || 0), 0)
  const totalImages = allCosts.reduce((s, c: any) => s + (c.images_generated || 0), 0)
  const totalApiReqs = allCosts.reduce((s, c: any) => s + (c.x_api_requests || 0), 0)
  const avgDaily = allCosts.length > 0 ? totalCost / allCosts.length : 0

  return (
    <div className="min-h-screen p-6 lg:p-8 animate-in">
      <div className="max-w-5xl mx-auto space-y-6">

        <header>
          <div className="flex items-center gap-1.5 text-3 text-xs mb-2">
            <DollarSign className="w-3.5 h-3.5" />
            Costs
          </div>
          <h1 className="text-[28px] font-semibold tracking-tight text-1">
            Cost Tracking
          </h1>
          <p className="text-2 text-sm mt-1">
            {allCosts.length} days tracked · ${totalCost.toFixed(2)} total
          </p>
        </header>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <StatCard label="Total Spend" value={`$${totalCost.toFixed(2)}`} sublabel={`${allCosts.length} days`} />
          <StatCard label="Daily Avg" value={`$${avgDaily.toFixed(4)}`} sublabel="per day" />
          <StatCard label="Tweets" value={totalTweets.toString()} sublabel="posted" />
          <StatCard label="Images" value={totalImages.toString()} sublabel="generated" />
          <StatCard label="API Calls" value={totalApiReqs.toString()} sublabel="X API" />
        </div>

        {/* Daily Breakdown */}
        <div className="glass-panel overflow-hidden">
          <div className="px-6 py-4 border-b border-[rgb(var(--glass-border))]">
            <h2 className="text-[15px] font-medium text-1">Daily Breakdown</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgb(var(--glass-border))]">
                  <th className="text-left text-[10px] text-4 font-medium uppercase tracking-wider px-6 py-3">Date</th>
                  <th className="text-right text-[10px] text-4 font-medium uppercase tracking-wider px-3 py-3 w-24">Total</th>
                  <th className="text-right text-[10px] text-4 font-medium uppercase tracking-wider px-3 py-3 w-24">X API</th>
                  <th className="text-right text-[10px] text-4 font-medium uppercase tracking-wider px-3 py-3 w-28">OpenAI</th>
                  <th className="text-right text-[10px] text-4 font-medium uppercase tracking-wider px-3 py-3 w-24">Gemini</th>
                  <th className="text-right text-[10px] text-4 font-medium uppercase tracking-wider px-3 py-3 w-20">Tweets</th>
                  <th className="text-right text-[10px] text-4 font-medium uppercase tracking-wider px-6 py-3 w-20">Images</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgb(var(--glass-border))]">
                {allCosts.map((cost: any) => (
                  <tr key={cost.id} className="hover:bg-[rgb(var(--glass-inset))] transition-colors">
                    <td className="px-6 py-3 text-[13px] text-1 tabular-nums">
                      {formatDate(cost.date)}
                    </td>
                    <td className="text-right px-3 py-3 text-[12px] font-medium text-1 tabular-nums">
                      ${(cost.total_cost_usd || 0).toFixed(4)}
                    </td>
                    <td className="text-right px-3 py-3 text-[12px] text-2 tabular-nums">
                      {cost.x_api_requests || 0} reqs
                    </td>
                    <td className="text-right px-3 py-3 text-[12px] tabular-nums">
                      <span className="text-2">{((cost.openai_tokens || 0) / 1000).toFixed(1)}k</span>
                      {cost.openai_cost_usd > 0 && (
                        <span className="text-4 ml-1">(${cost.openai_cost_usd.toFixed(4)})</span>
                      )}
                    </td>
                    <td className="text-right px-3 py-3 text-[12px] tabular-nums">
                      <span className="text-2">{cost.gemini_requests || 0}</span>
                      {cost.gemini_cost_usd > 0 && (
                        <span className="text-4 ml-1">(${cost.gemini_cost_usd.toFixed(4)})</span>
                      )}
                    </td>
                    <td className="text-right px-3 py-3 text-[12px] text-2 tabular-nums">
                      {cost.tweets_posted || 0}
                    </td>
                    <td className="text-right px-6 py-3 text-[12px] text-2 tabular-nums">
                      {cost.images_generated || 0}
                    </td>
                  </tr>
                ))}
                {allCosts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-sm text-4">
                      No cost data recorded yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}

function StatCard({ label, value, sublabel }: { label: string; value: string; sublabel: string }) {
  return (
    <div className="glass-panel p-4">
      <div className="text-[11px] text-3 mb-2">{label}</div>
      <div className="text-[20px] font-semibold text-1 tracking-tight tabular-nums">{value}</div>
      <div className="text-[10px] text-4 mt-0.5">{sublabel}</div>
    </div>
  )
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })
}
