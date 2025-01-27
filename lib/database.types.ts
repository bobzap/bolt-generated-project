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
      teams: {
        Row: {
          id: string
          name: string
          color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          color: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          color?: string
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          team_id: string
          duration: number
          start_date: string
          end_date: string
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          team_id: string
          duration: number
          start_date: string
          end_date: string
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          team_id?: string
          duration?: number
          start_date?: string
          end_date?: string
          location?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      work_types: {
        Row: {
          id: string
          name: string
          team_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          team_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          team_id?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
