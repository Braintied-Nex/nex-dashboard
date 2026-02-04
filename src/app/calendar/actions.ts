'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function setFeedback(postId: string, isScheduled: boolean, feedback: 'approved' | 'rejected' | null) {
  const sb = createAdminClient()

  if (isScheduled) {
    const { error } = await sb.from('nex_posts').update({ feedback }).eq('id', postId)
    if (error) throw new Error(error.message)
  } else {
    const { error } = await sb.from('nex_x_post_metrics').update({ feedback }).eq('tweet_id', postId)
    if (error) throw new Error(error.message)
  }

  revalidatePath('/calendar')
}

export async function setFeedbackNote(postId: string, isScheduled: boolean, note: string) {
  const sb = createAdminClient()

  if (isScheduled) {
    const { error } = await sb.from('nex_posts').update({ feedback_note: note }).eq('id', postId)
    if (error) throw new Error(error.message)
  } else {
    const { error } = await sb.from('nex_x_post_metrics').update({ feedback_note: note }).eq('tweet_id', postId)
    if (error) throw new Error(error.message)
  }

  revalidatePath('/calendar')
}

export async function updateScheduledContent(postId: string, content: string) {
  const sb = createAdminClient()
  const { error } = await sb.from('nex_posts').update({ content }).eq('id', postId)
  if (error) throw new Error(error.message)
  revalidatePath('/calendar')
}
