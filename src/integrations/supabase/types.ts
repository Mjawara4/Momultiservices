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
      online_orders: {
        Row: {
          created_at: string
          id: string
          item_details: string
          name: string
          order_amount: number
          phone: string
          screenshot_url: string | null
          service_fee: number
          status: string
          type: string
          website_link: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_details: string
          name: string
          order_amount: number
          phone: string
          screenshot_url?: string | null
          service_fee: number
          status?: string
          type?: string
          website_link: string
        }
        Update: {
          created_at?: string
          id?: string
          item_details?: string
          name?: string
          order_amount?: number
          phone?: string
          screenshot_url?: string | null
          service_fee?: number
          status?: string
          type?: string
          website_link?: string
        }
        Relationships: []
      }
      scheduled_shipping_dates: {
        Row: {
          created_at: string | null
          from_location: string
          id: string
          shipping_date: string
          to_location: string
        }
        Insert: {
          created_at?: string | null
          from_location: string
          id?: string
          shipping_date: string
          to_location: string
        }
        Update: {
          created_at?: string | null
          from_location?: string
          id?: string
          shipping_date?: string
          to_location?: string
        }
        Relationships: []
      }
      ship_site_data: {
        Row: {
          country: string | null
          created_at: string
          estimated_price: number | null
          from_location: string | null
          id: string
          name: string
          package_type: string | null
          phone: string
          preferred_contact_method: string | null
          question: string | null
          subject: string | null
          to_location: string | null
          type: string
          weight: number | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          estimated_price?: number | null
          from_location?: string | null
          id?: string
          name: string
          package_type?: string | null
          phone: string
          preferred_contact_method?: string | null
          question?: string | null
          subject?: string | null
          to_location?: string | null
          type: string
          weight?: number | null
        }
        Update: {
          country?: string | null
          created_at?: string
          estimated_price?: number | null
          from_location?: string | null
          id?: string
          name?: string
          package_type?: string | null
          phone?: string
          preferred_contact_method?: string | null
          question?: string | null
          subject?: string | null
          to_location?: string | null
          type?: string
          weight?: number | null
        }
        Relationships: []
      }
      shipping_discount_codes: {
        Row: {
          code: string
          created_at: string | null
          discount_percentage: number
          expires_at: string | null
          id: string
          is_used: boolean | null
          used_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          discount_percentage: number
          expires_at?: string | null
          id?: string
          is_used?: boolean | null
          used_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          discount_percentage?: number
          expires_at?: string | null
          id?: string
          is_used?: boolean | null
          used_at?: string | null
        }
        Relationships: []
      }
      shipping_tracking: {
        Row: {
          created_at: string | null
          estimated_delivery: string | null
          id: string
          location: string | null
          notes: string | null
          shipping_id: string
          status: string
          tracking_number: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          estimated_delivery?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          shipping_id: string
          status?: string
          tracking_number: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          estimated_delivery?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          shipping_id?: string
          status?: string
          tracking_number?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipping_tracking_shipping_id_fkey"
            columns: ["shipping_id"]
            isOneToOne: false
            referencedRelation: "scheduled_shipping_dates"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_discount_code: {
        Args: {
          p_discount_percentage?: number
          p_days_valid?: number
        }
        Returns: {
          generated_code: string
          code_expires_at: string
        }[]
      }
      generate_discount_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
