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
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          title: string
          category_id: string | null
          price: number
          description: string | null
          details: string[] | null
          images: string[] | null
          video_url: string | null
          is_handmade: boolean
          status: 'draft' | 'published' | 'archived'
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          category_id?: string | null
          price: number
          description?: string | null
          details?: string[] | null
          images?: string[] | null
          video_url?: string | null
          is_handmade?: boolean
          status?: 'draft' | 'published' | 'archived'
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          category_id?: string | null
          price?: number
          description?: string | null
          details?: string[] | null
          images?: string[] | null
          video_url?: string | null
          is_handmade?: boolean
          status?: 'draft' | 'published' | 'archived'
          created_at?: string
        }
      }
    }
  }
}
