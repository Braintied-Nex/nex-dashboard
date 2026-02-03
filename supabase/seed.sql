-- =====================================================
-- NEX DASHBOARD: Seed Data
-- Initial data for Sentigen / Nex content operations
-- =====================================================

-- =====================================================
-- PLATFORMS
-- =====================================================
INSERT INTO nex_platforms (name, handle, api_enabled) VALUES
  ('X/Twitter', 'sentigen_ai', true),
  ('LinkedIn', 'sentigen', false),
  ('Reddit', null, false),
  ('GitHub', 'Braintied-Nex', true),
  ('Substack', null, false)
ON CONFLICT DO NOTHING;

-- =====================================================
-- THEMES (Content pillars)
-- =====================================================
INSERT INTO nex_themes (name, description, color) VALUES
  ('Product Updates', 'Sentigen features, releases, roadmap', '#3B82F6'),
  ('AI Industry', 'AI trends, news, commentary', '#8B5CF6'),
  ('Building in Public', 'Behind-the-scenes, lessons learned', '#10B981'),
  ('Founder Insights', 'Advice for founders and executives', '#F59E0B'),
  ('Tech Deep Dives', 'Technical architecture, engineering', '#EF4444'),
  ('Productivity', 'AI-powered workflows, automation', '#06B6D4')
ON CONFLICT DO NOTHING;

-- =====================================================
-- THOUGHT LEADERS
-- People to study and learn from
-- =====================================================
INSERT INTO nex_thought_leaders (name, handle, platform, company, role, category, relevance_score, notes, content_style) VALUES
  ('Pieter Levels', 'levelsio', 'twitter', 'Nomad List, Photo AI', 'Founder', 'founder', 95, 'Master of building in public. Ships fast, shares revenue openly.', 'Short, punchy tweets. Screenshots of revenue. Contrarian takes.'),
  ('Sahil Lavingia', 'shl', 'twitter', 'Gumroad', 'CEO', 'founder', 90, 'Built Gumroad. Writes about minimalist companies.', 'Thoughtful threads. Long-form essays. Book author.'),
  ('Guillermo Rauch', 'rauchg', 'twitter', 'Vercel', 'CEO', 'founder', 88, 'Vercel/Next.js creator. Tweets about product and AI.', 'Technical but accessible. Product announcements.'),
  ('Sam Altman', 'sama', 'twitter', 'OpenAI', 'CEO', 'founder', 85, 'OpenAI CEO. Shapes AI narrative.', 'Infrequent but impactful. Big picture takes.'),
  ('Naval Ravikant', 'naval', 'twitter', 'AngelList', 'Investor', 'investor', 82, 'Philosopher-investor. Timeless wisdom.', 'Aphorisms. Threads on wealth and happiness.'),
  ('Paul Graham', 'paulg', 'twitter', 'Y Combinator', 'Co-founder', 'investor', 80, 'YC founder. Essays define startup culture.', 'Essays and contrarian opinions.'),
  ('Amjad Masad', 'amasad', 'twitter', 'Replit', 'CEO', 'founder', 85, 'Replit CEO. AI-first dev tools.', 'Product demos. AI coding future.'),
  ('Packy McCormick', 'packym', 'twitter', 'Not Boring', 'Writer', 'commentator', 78, 'Business strategy writer. Deep dives.', 'Long threads. Newsletter excerpts.'),
  ('Julia Lipton', 'JuliaLipton', 'twitter', 'Awesome People Ventures', 'Investor', 'investor', 72, 'Invests in AI/productivity tools.', 'VC perspective. Portfolio highlights.'),
  ('Lenny Rachitsky', 'lennysan', 'twitter', 'Lenny''s Newsletter', 'Writer', 'commentator', 75, 'Product management and growth.', 'Tactical advice. Interviews.')
ON CONFLICT DO NOTHING;

-- =====================================================
-- COMPETITORS
-- Products and companies to track
-- =====================================================
INSERT INTO nex_competitors (name, website, description, category, positioning, target_audience, strengths, weaknesses) VALUES
  ('Lindy AI', 'lindy.ai', 'AI assistant that automates workflows', 'direct', 'Personal AI that gets things done', 'Professionals, knowledge workers', '["Slick product", "Good integrations", "Strong funding"]', '["Generic positioning", "No enterprise focus"]'),
  ('Notion AI', 'notion.so', 'AI integrated into Notion workspace', 'adjacent', 'AI-enhanced workspace', 'Teams, creators', '["Massive user base", "Great UX", "Trusted brand"]', '["Not a dedicated assistant", "Limited automation"]'),
  ('Otter.ai', 'otter.ai', 'AI meeting assistant and transcription', 'adjacent', 'Never miss a meeting insight', 'Sales, executives', '["Strong meeting focus", "Good accuracy"]', '["Single-purpose", "No broader automation"]'),
  ('Grain', 'grain.com', 'AI meeting recorder and insights', 'adjacent', 'Capture and share meeting moments', 'Sales teams, recruiters', '["Good UI", "Strong integrations"]', '["Narrow focus", "Competitive space"]'),
  ('Reclaim.ai', 'reclaim.ai', 'AI calendar and scheduling', 'adjacent', 'Smart time management', 'Busy professionals', '["Solves real pain", "Good calendar UX"]', '["Limited to scheduling", "Narrow value prop"]'),
  ('Copy.ai', 'copy.ai', 'AI writing assistant', 'adjacent', 'Write better marketing copy', 'Marketers, content creators', '["Easy to use", "Lots of templates"]', '["Commodity space", "Limited differentiation"]'),
  ('Anthropic Claude', 'anthropic.com', 'AI assistant (general)', 'aspirational', 'Safe, helpful AI', 'Everyone', '["Best reasoning", "Constitutional AI"]', '["Not specialized", "No integrations"]')
ON CONFLICT DO NOTHING;

-- =====================================================
-- CONTENT PATTERNS
-- What works in content
-- =====================================================
INSERT INTO nex_content_patterns (name, description, pattern_type, effectiveness_score, confidence, when_to_use, when_to_avoid) VALUES
  ('Hot Take Opener', 'Start with a contrarian or bold statement that challenges conventional wisdom', 'hook', 85, 'high', 'When you have genuine insight that goes against the grain', 'When being contrarian just for attention'),
  ('Number + Promise', 'Specific number + clear benefit (e.g., "7 ways to..." "3 lessons that...")', 'hook', 80, 'high', 'Tactical/educational content. Lists and frameworks.', 'Thought leadership or opinion pieces'),
  ('Story First', 'Start with a personal anecdote before the insight', 'structure', 82, 'high', 'When you have a genuine experience to share', 'Quick tips or announcements'),
  ('Build in Public Update', 'Share metrics, progress, or challenges openly', 'format', 88, 'high', 'When you have real numbers to share', 'If numbers are embarrassing without context'),
  ('Screenshot Proof', 'Include screenshot showing results, dashboard, or evidence', 'format', 85, 'medium', 'Product demos, metrics sharing, social proof', 'Opinion pieces or abstract concepts'),
  ('Thread Structure', 'Break longer content into numbered tweet thread', 'structure', 78, 'high', 'Deep dives, tutorials, frameworks', 'Hot takes or quick thoughts'),
  ('Question Hook', 'Open with a question that makes readers think', 'hook', 75, 'medium', 'When exploring a topic together', 'When you just want to announce something'),
  ('Before/After', 'Show transformation or comparison', 'format', 82, 'high', 'Product features, personal growth, improvements', 'When the change is not visually compelling'),
  ('Reply Guy Value', 'Add genuinely valuable insight to popular tweets', 'format', 70, 'medium', 'When you can add unique perspective', 'When it feels forced or self-promotional'),
  ('Early Morning Posts', 'Post between 7-9am for professional audience', 'timing', 72, 'medium', 'Business/professional content', 'Entertainment or casual content')
ON CONFLICT DO NOTHING;

-- =====================================================
-- TRENDS
-- Topics to potentially cover
-- =====================================================
INSERT INTO nex_trends (topic, description, source, relevance_score, momentum, time_sensitivity, status) VALUES
  ('Claude 3.5 Sonnet release', 'New Claude model with improved capabilities', 'twitter', 90, 'rising', 'high', 'watching'),
  ('AI agents vs copilots debate', 'Discussion about autonomous AI vs human-in-loop', 'twitter', 85, 'stable', 'low', 'watching'),
  ('Founder mode vs Manager mode', 'Paul Graham essay driving discourse', 'twitter', 80, 'falling', 'medium', 'watching'),
  ('AI coding assistants comparison', 'Cursor vs Copilot vs Claude debate', 'twitter', 88, 'rising', 'low', 'watching'),
  ('Remote work AI tools', 'Growing interest in AI for distributed teams', 'linkedin', 75, 'rising', 'low', 'watching')
ON CONFLICT DO NOTHING;

-- =====================================================
-- CONTENT IDEAS
-- Ideas in the pipeline
-- =====================================================
DO $$
DECLARE
  theme_product UUID;
  theme_ai UUID;
  theme_building UUID;
  theme_founder UUID;
  platform_twitter UUID;
BEGIN
  SELECT id INTO theme_product FROM nex_themes WHERE name = 'Product Updates' LIMIT 1;
  SELECT id INTO theme_ai FROM nex_themes WHERE name = 'AI Industry' LIMIT 1;
  SELECT id INTO theme_building FROM nex_themes WHERE name = 'Building in Public' LIMIT 1;
  SELECT id INTO theme_founder FROM nex_themes WHERE name = 'Founder Insights' LIMIT 1;
  SELECT id INTO platform_twitter FROM nex_platforms WHERE name = 'X/Twitter' LIMIT 1;

  INSERT INTO nex_content_ideas (title, description, idea_type, theme_id, platform_id, potential_score, effort_estimate, inspiration_source, status) VALUES
    ('Why I built an AI co-founder', 'Thread on the reasoning behind Nex - autonomous AI that manages content, research, engagement', 'thread', theme_building, platform_twitter, 90, 'medium', 'conversation', 'validated'),
    ('The unbundling of the executive assistant', 'How AI is fragmenting the EA role into specialized tools - and why that creates opportunity for unification', 'thread', theme_ai, platform_twitter, 85, 'high', 'research', 'captured'),
    ('My AI reads every email so I don''t have to', 'Practical post about email triage and how Sentigen handles inbox zero', 'post', theme_product, platform_twitter, 82, 'low', 'conversation', 'queued'),
    ('7 questions executives should ask their AI', 'Framework for getting value from AI assistants', 'thread', theme_founder, platform_twitter, 78, 'medium', 'research', 'captured'),
    ('Building in public: Week 1 metrics', 'First public update on Sentigen numbers, learnings, what''s next', 'post', theme_building, platform_twitter, 88, 'low', 'trend', 'validated'),
    ('The 3 AM insight: Why AI can''t replace human judgment', 'Nuanced take on AI limitations in high-stakes decisions', 'thread', theme_ai, platform_twitter, 75, 'high', 'thought_leader', 'captured'),
    ('How Sentigen handles multi-channel communication', 'Product deep-dive on entity resolution across platforms', 'thread', theme_product, platform_twitter, 80, 'high', 'competitor', 'captured'),
    ('Response to Lindy AI launch', 'Commentary on competitor positioning and our differentiation', 'post', theme_ai, platform_twitter, 72, 'low', 'competitor', 'captured');
END $$;

-- =====================================================
-- STRATEGY
-- Per-platform strategy
-- =====================================================
DO $$
DECLARE
  platform_twitter UUID;
  platform_linkedin UUID;
BEGIN
  SELECT id INTO platform_twitter FROM nex_platforms WHERE name = 'X/Twitter' LIMIT 1;
  SELECT id INTO platform_linkedin FROM nex_platforms WHERE name = 'LinkedIn' LIMIT 1;

  INSERT INTO nex_strategy (platform_id, goal, target_audience, posting_frequency, content_mix, notes) VALUES
    (platform_twitter, 'Build thought leadership and drive early adopters to Sentigen', 'Founders, executives, AI enthusiasts', '2-3x daily', '{"product_updates": 20, "ai_commentary": 30, "building_in_public": 30, "engagement": 20}', 'Focus on authentic voice. Share real numbers. Engage with AI/startup community.'),
    (platform_linkedin, 'Establish credibility with enterprise decision-makers', 'C-suite, VPs, enterprise buyers', '3-5x weekly', '{"thought_leadership": 40, "product_updates": 20, "industry_insights": 40}', 'More polished tone. Focus on business outcomes. Less frequent but higher quality.');
END $$;
