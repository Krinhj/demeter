export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
          carbs_target: number
          created_at: string
          daily_calories: number
          dietary_preferences: string[] | null
          exclusions: string[] | null
          fat_target: number
          id: string
          meals_per_day: number
          protein_max: number
          protein_min: number
          updated_at: string
          user_id: string
        }
        Insert: {
          carbs_target?: number
          created_at?: string
          daily_calories?: number
          dietary_preferences?: string[] | null
          exclusions?: string[] | null
          fat_target?: number
          id?: string
          meals_per_day?: number
          protein_max?: number
          protein_min?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          carbs_target?: number
          created_at?: string
          daily_calories?: number
          dietary_preferences?: string[] | null
          exclusions?: string[] | null
          fat_target?: number
          id?: string
          meals_per_day?: number
          protein_max?: number
          protein_min?: number
          updated_at?: string
          user_id?: string
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
          name: string
          prep_time_minutes: number | null
          protein: number | null
          servings: number
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
          name: string
          prep_time_minutes?: number | null
          protein?: number | null
          servings?: number
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
          name?: string
          prep_time_minutes?: number | null
          protein?: number | null
          servings?: number
          source_text?: string | null
          source_url?: string | null
          steps?: Json
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
