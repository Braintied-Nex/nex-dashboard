-- =====================================================
-- NEX DASHBOARD: Research & Intelligence Tables
-- Proactive AI content intelligence foundation
-- =====================================================

-- =====================================================
-- RESEARCH: Thought Leaders
-- People to study, learn from, and engage with
-- =====================================================
CREATE TABLE IF NOT EXISTS nex_thought_leaders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  handle TEXT NOT NULL,
  platform TEXT NOT NULL, -- twitter, linkedin, substack, etc.
  company TEXT,
  role TEXT,
  bio TEXT,
  avatar_url TEXT,
  website TEXT,
  
  -- Categorization
  category TEXT NOT NULL DEFAULT 'builder', -- founder, investor, builder, commentator, journalist
  relevance_score INTEGER DEFAULT 50, -- 0-100, how relevant to our mission
  
  -- Tracking
  follower_count INTEGER,
  following BOOLEAN DEFAULT false, -- are WE following them
  engaged_with BOOLEAN DEFAULT false, -- have we engaged
  last_content_check TIMESTAMPTZ,
  
  -- Notes
  notes TEXT,
  content_style TEXT, -- what makes their content good
  topics JSONB DEFAULT '[]'::jsonb, -- topics they cover
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- RESEARCH: Competitors
-- Companies and products to track
-- =====================================================
CREATE TABLE IF NOT EXISTS nex_competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  website TEXT,
  description TEXT,
  
  -- Categorization
  category TEXT NOT NULL DEFAULT 'direct', -- direct, adjacent, aspirational
  threat_level TEXT DEFAULT 'medium', -- low, medium, high
  
  -- Social presence
  twitter_handle TEXT,
  linkedin_url TEXT,
  
  -- Analysis
  positioning TEXT, -- how they position themselves
  strengths JSONB DEFAULT '[]'::jsonb,
  weaknesses JSONB DEFAULT '[]'::jsonb,
  pricing_model TEXT,
  target_audience TEXT,
  
  -- Content analysis
  content_frequency TEXT,
  content_themes JSONB DEFAULT '[]'::jsonb,
  last_analyzed TIMESTAMPTZ,
  
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- RESEARCH: Content Patterns
-- What works, what doesn't - learnings
-- =====================================================
CREATE TABLE IF NOT EXISTS nex_content_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  
  -- Pattern details
  pattern_type TEXT NOT NULL, -- format, hook, structure, topic, timing
  platform TEXT, -- null = all platforms
  
  -- Effectiveness
  effectiveness_score INTEGER DEFAULT 50, -- 0-100
  confidence TEXT DEFAULT 'medium', -- low, medium, high
  sample_size INTEGER DEFAULT 0,
  
  -- Evidence
  examples JSONB DEFAULT '[]'::jsonb, -- links to posts that demonstrate this
  source TEXT, -- where we learned this (research, testing, observation)
  
  -- Application
  when_to_use TEXT,
  when_to_avoid TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- RESEARCH: Research Log
-- Research sessions and findings
-- =====================================================
CREATE TABLE IF NOT EXISTS nex_research_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Session info
  topic TEXT NOT NULL,
  source TEXT NOT NULL, -- twitter, linkedin, article, competitor, etc.
  source_url TEXT,
  
  -- Findings
  summary TEXT,
  key_insights JSONB DEFAULT '[]'::jsonb,
  action_items JSONB DEFAULT '[]'::jsonb,
  
  -- Connections
  thought_leader_id UUID REFERENCES nex_thought_leaders(id) ON DELETE SET NULL,
  competitor_id UUID REFERENCES nex_competitors(id) ON DELETE SET NULL,
  
  -- Meta
  research_type TEXT DEFAULT 'manual', -- manual, automated, scheduled
  time_spent_minutes INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TRENDS: Trending Topics
-- Topics to potentially cover
-- =====================================================
CREATE TABLE IF NOT EXISTS nex_trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  topic TEXT NOT NULL,
  description TEXT,
  
  -- Source & timing
  source TEXT NOT NULL, -- twitter, linkedin, news, research
  first_seen TIMESTAMPTZ DEFAULT NOW(),
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  
  -- Assessment
  relevance_score INTEGER DEFAULT 50, -- 0-100, how relevant to us
  momentum TEXT DEFAULT 'stable', -- rising, stable, falling
  time_sensitivity TEXT DEFAULT 'low', -- low, medium, high, urgent
  
  -- Our response
  status TEXT DEFAULT 'watching', -- watching, planning, creating, published, skipped
  post_id UUID REFERENCES nex_posts(id) ON DELETE SET NULL,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ENGAGEMENT: Queue
-- Comments, mentions, opportunities to respond
-- =====================================================
CREATE TABLE IF NOT EXISTS nex_engagement_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Source
  platform TEXT NOT NULL,
  source_type TEXT NOT NULL, -- mention, comment, reply, dm, quote
  source_url TEXT,
  source_id TEXT, -- platform's ID for the item
  
  -- Content
  author_handle TEXT,
  author_name TEXT,
  content TEXT NOT NULL,
  context TEXT, -- what they're responding to
  
  -- Assessment
  priority TEXT DEFAULT 'normal', -- low, normal, high, urgent
  sentiment TEXT DEFAULT 'neutral', -- positive, neutral, negative, question
  requires_response BOOLEAN DEFAULT true,
  
  -- Response
  status TEXT DEFAULT 'pending', -- pending, drafting, responded, skipped
  response_draft TEXT,
  responded_at TIMESTAMPTZ,
  response_url TEXT,
  
  -- Meta
  discovered_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ, -- some opportunities are time-sensitive
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CONTENT: Ideas Backlog
-- Raw ideas before they become posts
-- =====================================================
CREATE TABLE IF NOT EXISTS nex_content_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- The idea
  title TEXT,
  description TEXT NOT NULL,
  
  -- Classification
  idea_type TEXT DEFAULT 'post', -- post, thread, article, reply, series
  platform_id UUID REFERENCES nex_platforms(id) ON DELETE SET NULL,
  theme_id UUID REFERENCES nex_themes(id) ON DELETE SET NULL,
  
  -- Source of inspiration
  inspiration_source TEXT, -- conversation, research, trend, competitor, thought_leader
  inspiration_url TEXT,
  inspiration_notes TEXT,
  
  -- Assessment
  potential_score INTEGER DEFAULT 50, -- 0-100
  effort_estimate TEXT DEFAULT 'medium', -- low, medium, high
  time_sensitivity TEXT DEFAULT 'none', -- none, low, medium, high
  
  -- Status
  status TEXT DEFAULT 'captured', -- captured, validated, queued, in_progress, completed, archived
  post_id UUID REFERENCES nex_posts(id) ON DELETE SET NULL,
  
  -- Meta
  tags JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CONTENT: Scheduled Actions
-- Proactive tasks for the AI to execute
-- =====================================================
CREATE TABLE IF NOT EXISTS nex_scheduled_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Action details
  action_type TEXT NOT NULL, -- research, draft, publish, engage, analyze, report
  description TEXT NOT NULL,
  
  -- Scheduling
  scheduled_for TIMESTAMPTZ NOT NULL,
  recurring TEXT, -- null, daily, weekly, monthly
  last_run TIMESTAMPTZ,
  next_run TIMESTAMPTZ,
  
  -- Configuration
  config JSONB DEFAULT '{}'::jsonb, -- action-specific config
  
  -- Status
  status TEXT DEFAULT 'active', -- active, paused, completed, failed
  last_result JSONB,
  failure_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ANALYTICS: Performance Benchmarks
-- Track performance over time
-- =====================================================
CREATE TABLE IF NOT EXISTS nex_benchmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Scope
  platform_id UUID REFERENCES nex_platforms(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  period_type TEXT NOT NULL, -- daily, weekly, monthly
  
  -- Metrics
  posts_published INTEGER DEFAULT 0,
  total_impressions INTEGER DEFAULT 0,
  total_engagements INTEGER DEFAULT 0,
  total_followers_gained INTEGER DEFAULT 0,
  avg_engagement_rate DECIMAL(5,2),
  
  -- Top content
  top_post_id UUID REFERENCES nex_posts(id) ON DELETE SET NULL,
  
  -- Goals vs actuals
  posts_goal INTEGER,
  impressions_goal INTEGER,
  engagement_goal DECIMAL(5,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES for performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_thought_leaders_platform ON nex_thought_leaders(platform);
CREATE INDEX IF NOT EXISTS idx_thought_leaders_category ON nex_thought_leaders(category);
CREATE INDEX IF NOT EXISTS idx_thought_leaders_relevance ON nex_thought_leaders(relevance_score DESC);

CREATE INDEX IF NOT EXISTS idx_competitors_category ON nex_competitors(category);

CREATE INDEX IF NOT EXISTS idx_patterns_type ON nex_content_patterns(pattern_type);
CREATE INDEX IF NOT EXISTS idx_patterns_platform ON nex_content_patterns(platform);
CREATE INDEX IF NOT EXISTS idx_patterns_effectiveness ON nex_content_patterns(effectiveness_score DESC);

CREATE INDEX IF NOT EXISTS idx_research_log_topic ON nex_research_log(topic);
CREATE INDEX IF NOT EXISTS idx_research_log_created ON nex_research_log(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_trends_status ON nex_trends(status);
CREATE INDEX IF NOT EXISTS idx_trends_relevance ON nex_trends(relevance_score DESC);
CREATE INDEX IF NOT EXISTS idx_trends_momentum ON nex_trends(momentum);

CREATE INDEX IF NOT EXISTS idx_engagement_status ON nex_engagement_queue(status);
CREATE INDEX IF NOT EXISTS idx_engagement_priority ON nex_engagement_queue(priority);
CREATE INDEX IF NOT EXISTS idx_engagement_platform ON nex_engagement_queue(platform);

CREATE INDEX IF NOT EXISTS idx_ideas_status ON nex_content_ideas(status);
CREATE INDEX IF NOT EXISTS idx_ideas_potential ON nex_content_ideas(potential_score DESC);

CREATE INDEX IF NOT EXISTS idx_actions_scheduled ON nex_scheduled_actions(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_actions_status ON nex_scheduled_actions(status);

CREATE INDEX IF NOT EXISTS idx_benchmarks_platform ON nex_benchmarks(platform_id);
CREATE INDEX IF NOT EXISTS idx_benchmarks_period ON nex_benchmarks(period_start, period_end);

-- =====================================================
-- TRIGGERS for updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN 
    SELECT unnest(ARRAY[
      'nex_thought_leaders',
      'nex_competitors', 
      'nex_content_patterns',
      'nex_trends',
      'nex_engagement_queue',
      'nex_content_ideas',
      'nex_scheduled_actions'
    ])
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS %I ON %I;
      CREATE TRIGGER %I
        BEFORE UPDATE ON %I
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at();
    ', 'update_' || t || '_updated_at', t, 'update_' || t || '_updated_at', t);
  END LOOP;
END;
$$;
