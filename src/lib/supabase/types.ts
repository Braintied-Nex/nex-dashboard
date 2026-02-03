export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      nex_platforms: {
        Row: {
          id: string
          name: string
          handle: string | null
          icon: string | null
          api_enabled: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          handle?: string | null
          icon?: string | null
          api_enabled?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          handle?: string | null
          icon?: string | null
          api_enabled?: boolean
          created_at?: string
        }
      }
      nex_themes: {
        Row: {
          id: string
          name: string
          description: string | null
          color: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          color?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          color?: string | null
          created_at?: string
        }
      }
      nex_posts: {
        Row: {
          id: string
          platform_id: string | null
          theme_id: string | null
          title: string | null
          content: string
          status: 'idea' | 'draft' | 'scheduled' | 'published' | 'archived'
          scheduled_for: string | null
          published_at: string | null
          external_id: string | null
          external_url: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          platform_id?: string | null
          theme_id?: string | null
          title?: string | null
          content: string
          status?: 'idea' | 'draft' | 'scheduled' | 'published' | 'archived'
          scheduled_for?: string | null
          published_at?: string | null
          external_id?: string | null
          external_url?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          platform_id?: string | null
          theme_id?: string | null
          title?: string | null
          content?: string
          status?: 'idea' | 'draft' | 'scheduled' | 'published' | 'archived'
          scheduled_for?: string | null
          published_at?: string | null
          external_id?: string | null
          external_url?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      nex_calendar: {
        Row: {
          id: string
          date: string
          platform_id: string | null
          theme_id: string | null
          post_id: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          date: string
          platform_id?: string | null
          theme_id?: string | null
          post_id?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          platform_id?: string | null
          theme_id?: string | null
          post_id?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      nex_metrics: {
        Row: {
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
        Insert: {
          id?: string
          post_id?: string | null
          platform_id?: string | null
          impressions?: number
          engagements?: number
          likes?: number
          comments?: number
          shares?: number
          clicks?: number
          recorded_at?: string
        }
        Update: {
          id?: string
          post_id?: string | null
          platform_id?: string | null
          impressions?: number
          engagements?: number
          likes?: number
          comments?: number
          shares?: number
          clicks?: number
          recorded_at?: string
        }
      }
      nex_strategy: {
        Row: {
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
        Insert: {
          id?: string
          platform_id?: string | null
          goal?: string | null
          target_audience?: string | null
          posting_frequency?: string | null
          content_mix?: Json
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          platform_id?: string | null
          goal?: string | null
          target_audience?: string | null
          posting_frequency?: string | null
          content_mix?: Json
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}

export type Platform = Database['public']['Tables']['nex_platforms']['Row']
export type Theme = Database['public']['Tables']['nex_themes']['Row']
export type Post = Database['public']['Tables']['nex_posts']['Row']
export type CalendarEntry = Database['public']['Tables']['nex_calendar']['Row']
export type Metric = Database['public']['Tables']['nex_metrics']['Row']
export type Strategy = Database['public']['Tables']['nex_strategy']['Row']
