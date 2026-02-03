export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// =====================================================
// DATABASE SCHEMA
// =====================================================
export interface Database {
  public: {
    Tables: {
      // ----- CORE TABLES -----
      nex_platforms: {
        Row: Platform
        Insert: Omit<Platform, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Platform>
      }
      nex_themes: {
        Row: Theme
        Insert: Omit<Theme, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Theme>
      }
      nex_posts: {
        Row: Post
        Insert: Omit<Post, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string }
        Update: Partial<Post>
      }
      nex_calendar: {
        Row: CalendarEntry
        Insert: Omit<CalendarEntry, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<CalendarEntry>
      }
      nex_metrics: {
        Row: Metric
        Insert: Omit<Metric, 'id' | 'recorded_at'> & { id?: string; recorded_at?: string }
        Update: Partial<Metric>
      }
      nex_strategy: {
        Row: Strategy
        Insert: Omit<Strategy, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string }
        Update: Partial<Strategy>
      }
      
      // ----- RESEARCH TABLES -----
      nex_thought_leaders: {
        Row: ThoughtLeader
        Insert: Omit<ThoughtLeader, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string }
        Update: Partial<ThoughtLeader>
      }
      nex_competitors: {
        Row: Competitor
        Insert: Omit<Competitor, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string }
        Update: Partial<Competitor>
      }
      nex_content_patterns: {
        Row: ContentPattern
        Insert: Omit<ContentPattern, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string }
        Update: Partial<ContentPattern>
      }
      nex_research_log: {
        Row: ResearchLog
        Insert: Omit<ResearchLog, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<ResearchLog>
      }
      
      // ----- TRENDS & ENGAGEMENT -----
      nex_trends: {
        Row: Trend
        Insert: Omit<Trend, 'id' | 'created_at' | 'updated_at' | 'first_seen' | 'last_seen'> & { id?: string; created_at?: string; updated_at?: string; first_seen?: string; last_seen?: string }
        Update: Partial<Trend>
      }
      nex_engagement_queue: {
        Row: EngagementItem
        Insert: Omit<EngagementItem, 'id' | 'created_at' | 'updated_at' | 'discovered_at'> & { id?: string; created_at?: string; updated_at?: string; discovered_at?: string }
        Update: Partial<EngagementItem>
      }
      
      // ----- CONTENT PIPELINE -----
      nex_content_ideas: {
        Row: ContentIdea
        Insert: Omit<ContentIdea, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string }
        Update: Partial<ContentIdea>
      }
      nex_scheduled_actions: {
        Row: ScheduledAction
        Insert: Omit<ScheduledAction, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string }
        Update: Partial<ScheduledAction>
      }
      
      // ----- ANALYTICS -----
      nex_benchmarks: {
        Row: Benchmark
        Insert: Omit<Benchmark, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Benchmark>
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}

// =====================================================
// CORE TYPES
// =====================================================
export interface Platform {
  id: string
  name: string
  handle: string | null
  icon: string | null
  api_enabled: boolean
  created_at: string
}

export interface Theme {
  id: string
  name: string
  description: string | null
  color: string | null
  created_at: string
}

export type PostStatus = 'idea' | 'draft' | 'scheduled' | 'published' | 'archived'

export interface Post {
  id: string
  platform_id: string | null
  theme_id: string | null
  title: string | null
  content: string
  status: PostStatus
  scheduled_for: string | null
  published_at: string | null
  external_id: string | null
  external_url: string | null
  metadata: Json
  created_at: string
  updated_at: string
}

export interface CalendarEntry {
  id: string
  date: string
  platform_id: string | null
  theme_id: string | null
  post_id: string | null
  notes: string | null
  created_at: string
}

export interface Metric {
  id: string
  post_id: string | null
  platform_id: string | null
  impressions: number
  engagements: number
  likes: number
  comments: number
  shares: number
  clicks: number
  recorded_at: string
}

export interface Strategy {
  id: string
  platform_id: string | null
  goal: string | null
  target_audience: string | null
  posting_frequency: string | null
  content_mix: Json
  notes: string | null
  created_at: string
  updated_at: string
}

// =====================================================
// RESEARCH TYPES
// =====================================================
export type LeaderCategory = 'founder' | 'investor' | 'builder' | 'commentator' | 'journalist'

export interface ThoughtLeader {
  id: string
  name: string
  handle: string
  platform: string
  company: string | null
  role: string | null
  bio: string | null
  avatar_url: string | null
  website: string | null
  category: LeaderCategory
  relevance_score: number
  follower_count: number | null
  following: boolean
  engaged_with: boolean
  last_content_check: string | null
  notes: string | null
  content_style: string | null
  topics: string[]
  created_at: string
  updated_at: string
}

export type CompetitorCategory = 'direct' | 'adjacent' | 'aspirational'
export type ThreatLevel = 'low' | 'medium' | 'high'

export interface Competitor {
  id: string
  name: string
  website: string | null
  description: string | null
  category: CompetitorCategory
  threat_level: ThreatLevel
  twitter_handle: string | null
  linkedin_url: string | null
  positioning: string | null
  strengths: string[]
  weaknesses: string[]
  pricing_model: string | null
  target_audience: string | null
  content_frequency: string | null
  content_themes: string[]
  last_analyzed: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type PatternType = 'format' | 'hook' | 'structure' | 'topic' | 'timing'
export type ConfidenceLevel = 'low' | 'medium' | 'high'

export interface ContentPattern {
  id: string
  name: string
  description: string | null
  pattern_type: PatternType
  platform: string | null
  effectiveness_score: number
  confidence: ConfidenceLevel
  sample_size: number
  examples: Json[]
  source: string | null
  when_to_use: string | null
  when_to_avoid: string | null
  created_at: string
  updated_at: string
}

export type ResearchType = 'manual' | 'automated' | 'scheduled'

export interface ResearchLog {
  id: string
  topic: string
  source: string
  source_url: string | null
  summary: string | null
  key_insights: string[]
  action_items: string[]
  thought_leader_id: string | null
  competitor_id: string | null
  research_type: ResearchType
  time_spent_minutes: number | null
  created_at: string
}

// =====================================================
// TRENDS & ENGAGEMENT TYPES
// =====================================================
export type Momentum = 'rising' | 'stable' | 'falling'
export type TimeSensitivity = 'none' | 'low' | 'medium' | 'high' | 'urgent'
export type TrendStatus = 'watching' | 'planning' | 'creating' | 'published' | 'skipped'

export interface Trend {
  id: string
  topic: string
  description: string | null
  source: string
  first_seen: string
  last_seen: string
  relevance_score: number
  momentum: Momentum
  time_sensitivity: TimeSensitivity
  status: TrendStatus
  post_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type EngagementSourceType = 'mention' | 'comment' | 'reply' | 'dm' | 'quote'
export type Priority = 'low' | 'normal' | 'high' | 'urgent'
export type Sentiment = 'positive' | 'neutral' | 'negative' | 'question'
export type EngagementStatus = 'pending' | 'drafting' | 'responded' | 'skipped'

export interface EngagementItem {
  id: string
  platform: string
  source_type: EngagementSourceType
  source_url: string | null
  source_id: string | null
  author_handle: string | null
  author_name: string | null
  content: string
  context: string | null
  priority: Priority
  sentiment: Sentiment
  requires_response: boolean
  status: EngagementStatus
  response_draft: string | null
  responded_at: string | null
  response_url: string | null
  discovered_at: string
  expires_at: string | null
  created_at: string
  updated_at: string
}

// =====================================================
// CONTENT PIPELINE TYPES
// =====================================================
export type IdeaType = 'post' | 'thread' | 'article' | 'reply' | 'series'
export type EffortEstimate = 'low' | 'medium' | 'high'
export type IdeaStatus = 'captured' | 'validated' | 'queued' | 'in_progress' | 'completed' | 'archived'

export interface ContentIdea {
  id: string
  title: string | null
  description: string
  idea_type: IdeaType
  platform_id: string | null
  theme_id: string | null
  inspiration_source: string | null
  inspiration_url: string | null
  inspiration_notes: string | null
  potential_score: number
  effort_estimate: EffortEstimate
  time_sensitivity: TimeSensitivity
  status: IdeaStatus
  post_id: string | null
  tags: string[]
  notes: string | null
  created_at: string
  updated_at: string
}

export type ActionType = 'research' | 'draft' | 'publish' | 'engage' | 'analyze' | 'report'
export type RecurringSchedule = 'daily' | 'weekly' | 'monthly' | null
export type ActionStatus = 'active' | 'paused' | 'completed' | 'failed'

export interface ScheduledAction {
  id: string
  action_type: ActionType
  description: string
  scheduled_for: string
  recurring: RecurringSchedule
  last_run: string | null
  next_run: string | null
  config: Json
  status: ActionStatus
  last_result: Json | null
  failure_count: number
  created_at: string
  updated_at: string
}

// =====================================================
// ANALYTICS TYPES
// =====================================================
export type PeriodType = 'daily' | 'weekly' | 'monthly'

export interface Benchmark {
  id: string
  platform_id: string | null
  period_start: string
  period_end: string
  period_type: PeriodType
  posts_published: number
  total_impressions: number
  total_engagements: number
  total_followers_gained: number
  avg_engagement_rate: number | null
  top_post_id: string | null
  posts_goal: number | null
  impressions_goal: number | null
  engagement_goal: number | null
  created_at: string
}

// =====================================================
// UTILITY TYPES
// =====================================================
export type Tables = Database['public']['Tables']
export type TableName = keyof Tables
