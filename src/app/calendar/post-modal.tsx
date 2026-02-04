'use client'

import { useState, useTransition, useEffect, useCallback } from 'react'
import { setFeedback, setFeedbackNote, updateScheduledContent } from './actions'
import { ArrowLeft, ExternalLink, Eye, Heart, MessageCircle, Repeat2, ThumbsUp, ThumbsDown, Pencil, Save, Check, X, Bookmark } from 'lucide-react'

const XIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const LinkedInIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const SubstackIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
  </svg>
)

export interface PostData {
  id: string
  platform: string
  status: 'posted' | 'scheduled' | 'draft'
  text: string
  time: string
  impressions?: number
  likes?: number
  retweets?: number
  repliesCount?: number
  engagementRate?: number
  bookmarks?: number
  feedback?: string | null
  feedbackNote?: string | null
  externalUrl?: string
}

const platformConfig: Record<string, { icon: typeof XIcon; color: string; label: string }> = {
  x: { icon: XIcon, color: 'text-zinc-400', label: 'X' },
  linkedin: { icon: LinkedInIcon, color: 'text-[#0A66C2]', label: 'LinkedIn' },
  substack: { icon: SubstackIcon, color: 'text-[#FF6719]', label: 'Substack' },
}

interface PostModalProps {
  post: PostData
  onClose: () => void
}

export function PostModal({ post, onClose }: PostModalProps) {
  const [isPending, startTransition] = useTransition()
  const [currentFeedback, setCurrentFeedback] = useState(post.feedback)
  const [note, setNote] = useState(post.feedbackNote || '')
  const [noteSaved, setNoteSaved] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(post.text)
  const [editSaved, setEditSaved] = useState(false)

  const platform = platformConfig[post.platform] || platformConfig.x
  const PlatformIcon = platform.icon
  const isScheduled = post.status !== 'posted'

  const time = new Date(post.time).toLocaleString('en', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

  const handleClose = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    document.addEventListener('keydown', handleClose)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleClose)
      document.body.style.overflow = ''
    }
  }, [handleClose])

  function handleFeedback(fb: 'approved' | 'rejected') {
    const newFb = currentFeedback === fb ? null : fb
    setCurrentFeedback(newFb)
    startTransition(() => setFeedback(post.id, isScheduled, newFb))
  }

  function handleSaveNote() {
    startTransition(async () => {
      await setFeedbackNote(post.id, isScheduled, note)
      setNoteSaved(true)
      setTimeout(() => setNoteSaved(false), 2000)
    })
  }

  function handleSaveEdit() {
    startTransition(async () => {
      await updateScheduledContent(post.id, editText)
      setEditSaved(true)
      setEditing(false)
      setTimeout(() => setEditSaved(false), 2000)
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto scrollbar-hide glass-elevated rounded-2xl p-6 space-y-5"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg glass-inset hover:bg-[rgb(var(--glass-inset-hover))] text-3 hover:text-1"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pr-8">
          <div className="w-9 h-9 rounded-xl glass-inset flex items-center justify-center">
            <PlatformIcon className={`w-4 h-4 ${platform.color}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                post.status === 'posted'
                  ? 'bg-green-500/15 text-green-400'
                  : post.status === 'scheduled'
                    ? 'bg-amber-500/15 text-amber-400'
                    : 'bg-zinc-500/15 text-zinc-400'
              }`}>
                {post.status === 'posted' ? 'Published' : post.status === 'scheduled' ? 'Scheduled' : 'Draft'}
              </span>
              <span className="text-xs text-4">{platform.label}</span>
            </div>
            <p className="text-xs text-3 mt-0.5">{time}</p>
          </div>
        </div>

        {/* Content */}
        <div>
          {editing ? (
            <div className="space-y-3">
              <textarea
                value={editText}
                onChange={e => setEditText(e.target.value)}
                className="w-full bg-[rgb(var(--glass-inset))] border border-[rgb(var(--glass-border))] rounded-xl p-4 text-[15px] text-1 leading-relaxed resize-none min-h-[150px] focus:outline-none focus:border-[rgb(var(--fg)/0.2)]"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-4">{editText.length} chars</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditing(false); setEditText(post.text) }}
                    className="px-3 py-1.5 rounded-lg text-xs text-3 hover:text-1 glass-inset"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={isPending}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 flex items-center gap-1.5"
                  >
                    <Save className="w-3 h-3" />
                    Save
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-[15px] text-1 leading-relaxed whitespace-pre-wrap">
              {post.text}
            </p>
          )}
          {editSaved && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-green-400">
              <Check className="w-3 h-3" /> Saved
            </div>
          )}
        </div>

        {/* Metrics */}
        {post.status === 'posted' && (post.impressions || post.likes || post.retweets || post.repliesCount) && (
          <div className="flex items-center gap-4 py-3 border-t border-b border-[rgb(var(--glass-border))]">
            {(post.impressions ?? 0) > 0 && (
              <div className="flex items-center gap-1.5 text-sm">
                <Eye className="w-4 h-4 text-3" />
                <span className="text-1 tabular-nums">{post.impressions!.toLocaleString()}</span>
              </div>
            )}
            {(post.likes ?? 0) > 0 && (
              <div className="flex items-center gap-1.5 text-sm">
                <Heart className="w-4 h-4 text-rose-400" />
                <span className="text-1 tabular-nums">{post.likes}</span>
              </div>
            )}
            {(post.retweets ?? 0) > 0 && (
              <div className="flex items-center gap-1.5 text-sm">
                <Repeat2 className="w-4 h-4 text-green-400" />
                <span className="text-1 tabular-nums">{post.retweets}</span>
              </div>
            )}
            {(post.repliesCount ?? 0) > 0 && (
              <div className="flex items-center gap-1.5 text-sm">
                <MessageCircle className="w-4 h-4 text-blue-400" />
                <span className="text-1 tabular-nums">{post.repliesCount}</span>
              </div>
            )}
            {(post.engagementRate ?? 0) > 0 && (
              <div className={`ml-auto text-sm font-medium tabular-nums ${
                post.engagementRate! > 3 ? 'text-green-400' : post.engagementRate! > 1 ? 'text-blue-400' : 'text-3'
              }`}>
                {post.engagementRate}% ER
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleFeedback('approved')}
            disabled={isPending}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium ${
              currentFeedback === 'approved'
                ? 'bg-green-500/20 text-green-400 ring-1 ring-green-500/40'
                : 'glass-inset text-3 hover:text-green-400 hover:bg-green-500/10'
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            {currentFeedback === 'approved' ? 'Approved' : 'Approve'}
          </button>

          <button
            onClick={() => handleFeedback('rejected')}
            disabled={isPending}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium ${
              currentFeedback === 'rejected'
                ? 'bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/40'
                : 'glass-inset text-3 hover:text-rose-400 hover:bg-rose-500/10'
            }`}
          >
            <ThumbsDown className="w-4 h-4" />
            {currentFeedback === 'rejected' ? 'Rejected' : 'Reject'}
          </button>

          <div className="flex-1" />

          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm glass-inset text-3 hover:text-1"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
          )}

          {post.externalUrl && (
            <a
              href={post.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm glass-inset text-3 hover:text-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View
            </a>
          )}
        </div>

        {/* Notes */}
        <div className="space-y-2 pt-2 border-t border-[rgb(var(--glass-border))]">
          <h3 className="text-xs font-medium text-3">Notes</h3>
          <textarea
            value={note}
            onChange={e => { setNote(e.target.value); setNoteSaved(false) }}
            placeholder="What worked, what didn't, ideas for next time..."
            className="w-full bg-[rgb(var(--glass-inset))] border border-[rgb(var(--glass-border))] rounded-xl p-3 text-sm text-1 leading-relaxed resize-none min-h-[80px] placeholder:text-4 focus:outline-none focus:border-[rgb(var(--fg)/0.2)]"
          />
          <div className="flex items-center justify-end gap-2">
            {noteSaved && (
              <span className="text-xs text-green-400 flex items-center gap-1">
                <Check className="w-3 h-3" /> Saved
              </span>
            )}
            <button
              onClick={handleSaveNote}
              disabled={isPending || note === (post.feedbackNote || '')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <Save className="w-3 h-3" />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
