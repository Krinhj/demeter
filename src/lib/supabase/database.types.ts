export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      chat_messages: {
        Row: {
          content: string
          created_at: string | null
          embedding: string | null
          id: string
          role: string
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          role: string
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          role?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string | null
          ended_at: string | null
          id: string
          last_message_at: string | null
          message_count: number | null
          started_at: string | null
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          ended_at?: string | null
          id?: string
          last_message_at?: string | null
          message_count?: number | null
          started_at?: string | null
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          ended_at?: string | null
          id?: string
          last_message_at?: string | null
          message_count?: number | null
          started_at?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      grocery_list_items: {
        Row: {
          category: string
          checked_at: string | null
          created_at: string
          grocery_list_id: string
          id: string
          is_checked: boolean
          name: string
          notes: string | null
          quantity: number | null
          recipe_ids: string[] | null
          sort_order: number
          unit: string | null
          updated_at: string
        }
        Insert: {
          category?: string
          checked_at?: string | null
          created_at?: string
          grocery_list_id: string
          id?: string
          is_checked?: boolean
          name: string
          notes?: string | null
          quantity?: number | null
          recipe_ids?: string[] | null
          sort_order?: number
          unit?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          checked_at?: string | null
          created_at?: string
          grocery_list_id?: string
          id?: string
          is_checked?: boolean
          name?: string
          notes?: string | null
          quantity?: number | null
          recipe_ids?: string[] | null
          sort_order?: number
          unit?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "grocery_list_items_grocery_list_id_fkey"
            columns: ["grocery_list_id"]
            isOneToOne: false
            referencedRelation: "grocery_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      grocery_lists: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          meal_plan_id: string | null
          name: string
          notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          meal_plan_id?: string | null
          name: string
          notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          meal_plan_id?: string | null
          name?: string
          notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "grocery_lists_meal_plan_id_fkey"
            columns: ["meal_plan_id"]
            isOneToOne: false
            referencedRelation: "meal_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_plan_entries: {
        Row: {
          calories: number | null
          carbs: number | null
          created_at: string
          custom_meal_name: string | null
          day_of_week: number
          fat: number | null
          id: string
          meal_plan_id: string
          meal_type: string
          notes: string | null
          protein: number | null
          recipe_id: string | null
          servings: number
          updated_at: string
        }
        Insert: {
          calories?: number | null
          carbs?: number | null
          created_at?: string
          custom_meal_name?: string | null
          day_of_week: number
          fat?: number | null
          id?: string
          meal_plan_id: string
          meal_type: string
          notes?: string | null
          protein?: number | null
          recipe_id?: string | null
          servings?: number
          updated_at?: string
        }
        Update: {
          calories?: number | null
          carbs?: number | null
          created_at?: string
          custom_meal_name?: string | null
          day_of_week?: number
          fat?: number | null
          id?: string
          meal_plan_id?: string
          meal_type?: string
          notes?: string | null
          protein?: number | null
          recipe_id?: string | null
          servings?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_plan_entries_meal_plan_id_fkey"
            columns: ["meal_plan_id"]
            isOneToOne: false
            referencedRelation: "meal_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_plan_entries_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_plans: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          notes: string | null
          total_calories: number | null
          total_carbs: number | null
          total_fat: number | null
          total_protein: number | null
          updated_at: string
          user_id: string
          week_end: string
          week_start: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          notes?: string | null
          total_calories?: number | null
          total_carbs?: number | null
          total_fat?: number | null
          total_protein?: number | null
          updated_at?: string
          user_id: string
          week_end: string
          week_start: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          notes?: string | null
          total_calories?: number | null
          total_carbs?: number | null
          total_fat?: number | null
          total_protein?: number | null
          updated_at?: string
          user_id?: string
          week_end?: string
          week_start?: string
        }
        Relationships: []
      }
      nutrition_goals: {
        Row: {
          auto_generate_weekly: boolean | null
          carbs_target: number
          created_at: string
          daily_calories: number
          dietary_preferences: string[] | null
          exclusions: string[] | null
          fat_target: number
          id: string
          meal_repetition_tolerance: string | null
          meals_per_day: number
          protein_max: number
          protein_min: number
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_generate_weekly?: boolean | null
          carbs_target?: number
          created_at?: string
          daily_calories?: number
          dietary_preferences?: string[] | null
          exclusions?: string[] | null
          fat_target?: number
          id?: string
          meal_repetition_tolerance?: string | null
          meals_per_day?: number
          protein_max?: number
          protein_min?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_generate_weekly?: boolean | null
          carbs_target?: number
          created_at?: string
          daily_calories?: number
          dietary_preferences?: string[] | null
          exclusions?: string[] | null
          fat_target?: number
          id?: string
          meal_repetition_tolerance?: string | null
          meals_per_day?: number
          protein_max?: number
          protein_min?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      public_recipes: {
        Row: {
          calories: number | null
          carbs: number | null
          cook_time_minutes: number | null
          created_at: string
          cuisine: string | null
          description: string | null
          dietary_flags: string[] | null
          difficulty: string | null
          equipment: Json | null
          fat: number | null
          fiber: number | null
          id: string
          image_url: string | null
          ingredients: Json
          name: string
          prep_time_minutes: number | null
          protein: number | null
          review_notes: string | null
          reviewed_by: string | null
          servings: number
          source_attribution: string | null
          source_url: string | null
          status: string
          steps: Json
          submitted_by: string | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          calories?: number | null
          carbs?: number | null
          cook_time_minutes?: number | null
          created_at?: string
          cuisine?: string | null
          description?: string | null
          dietary_flags?: string[] | null
          difficulty?: string | null
          equipment?: Json | null
          fat?: number | null
          fiber?: number | null
          id?: string
          image_url?: string | null
          ingredients?: Json
          name: string
          prep_time_minutes?: number | null
          protein?: number | null
          review_notes?: string | null
          reviewed_by?: string | null
          servings?: number
          source_attribution?: string | null
          source_url?: string | null
          status?: string
          steps?: Json
          submitted_by?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          calories?: number | null
          carbs?: number | null
          cook_time_minutes?: number | null
          created_at?: string
          cuisine?: string | null
          description?: string | null
          dietary_flags?: string[] | null
          difficulty?: string | null
          equipment?: Json | null
          fat?: number | null
          fiber?: number | null
          id?: string
          image_url?: string | null
          ingredients?: Json
          name?: string
          prep_time_minutes?: number | null
          protein?: number | null
          review_notes?: string | null
          reviewed_by?: string | null
          servings?: number
          source_attribution?: string | null
          source_url?: string | null
          status?: string
          steps?: Json
          submitted_by?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      recipes: {
        Row: {
          calories: number | null
          carbs: number | null
          cook_time_minutes: number | null
          created_at: string
          description: string | null
          equipment: Json | null
          fat: number | null
          fiber: number | null
          id: string
          image_url: string | null
          ingredients: Json
          is_favorite: boolean
          is_modified: boolean | null
          name: string
          prep_time_minutes: number | null
          protein: number | null
          servings: number
          source_public_recipe_id: string | null
          source_text: string | null
          source_url: string | null
          steps: Json
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          calories?: number | null
          carbs?: number | null
          cook_time_minutes?: number | null
          created_at?: string
          description?: string | null
          equipment?: Json | null
          fat?: number | null
          fiber?: number | null
          id?: string
          image_url?: string | null
          ingredients?: Json
          is_favorite?: boolean
          is_modified?: boolean | null
          name: string
          prep_time_minutes?: number | null
          protein?: number | null
          servings?: number
          source_public_recipe_id?: string | null
          source_text?: string | null
          source_url?: string | null
          steps?: Json
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          calories?: number | null
          carbs?: number | null
          cook_time_minutes?: number | null
          created_at?: string
          description?: string | null
          equipment?: Json | null
          fat?: number | null
          fiber?: number | null
          id?: string
          image_url?: string | null
          ingredients?: Json
          is_favorite?: boolean
          is_modified?: boolean | null
          name?: string
          prep_time_minutes?: number | null
          protein?: number | null
          servings?: number
          source_public_recipe_id?: string | null
          source_text?: string | null
          source_url?: string | null
          steps?: Json
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipes_source_public_recipe_id_fkey"
            columns: ["source_public_recipe_id"]
            isOneToOne: false
            referencedRelation: "public_recipes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
