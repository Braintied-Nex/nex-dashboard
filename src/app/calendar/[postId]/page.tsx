import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import { PostDetailClient } from './detail-client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface Props {
  params: Promise<{ postId: string }>
}

export default async function PostDetailPage({ params }: Props) {
  const { postId } = await params
  const sb = createAdminClient()

  // Try X post first (tweet_id is numeric)
  const { data: xPost } = await sb
    .from('nex_x_post_metrics')
    .select('*')
    .eq('tweet_id', postId)
    .single()

  if (xPost) {
    return (
      <PostDetailClient post={{
        id: xPost.tweet_id,
        platform: 'x',
        status: 'posted',
        text: xPost.tweet_text || '',
        time: xPost.created_at,
        impressions: xPost.impressions,
        likes: xPost.likes,
        retweets: xPost.retweets,
        repliesCount: xPost.replies,
        engagementRate: xPost.engagement_rate,
        bookmarks: xPost.bookmarks,
        feedback: xPost.feedback,
        feedbackNote: xPost.feedback_note,
        externalUrl: `https://x.com/sentigen_ai/status/${xPost.tweet_id}`,
      }} />
    )
  }

  // Try scheduled post (UUID)
  const { data: scheduledPost } = await sb
    .from('nex_posts')
    .select('*')
    .eq('id', postId)
    .single()

  if (scheduledPost) {
    return (
      <PostDetailClient post={{
        id: scheduledPost.id,
        platform: scheduledPost.platform || 'x',
        status: 'scheduled',
        text: scheduledPost.content || scheduledPost.title || '',
        time: scheduledPost.scheduled_for || scheduledPost.created_at,
        feedback: scheduledPost.feedback,
        feedbackNote: scheduledPost.feedback_note,
      }} />
    )
  }

  notFound()
}
