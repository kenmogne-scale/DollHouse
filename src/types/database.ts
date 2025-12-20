export type ClothingCategory = "tops" | "bottoms" | "shoes" | "accessories";

// Minimal DB typing for MVP (passt zum SQL aus der README).
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; name: string | null; created_at: string };
        Insert: { id: string; name?: string | null; created_at?: string };
        Update: { name?: string | null };
        Relationships: [];
      };
      clothing_items: {
        Row: {
          id: string;
          user_id: string;
          image_url: string; // MVP: wir speichern den Storage-Pfad; fürs UI wird eine signed URL generiert
          category: ClothingCategory;
          color: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          image_url: string;
          category: ClothingCategory;
          color?: string | null;
          created_at?: string;
        };
        Update: {
          image_url?: string;
          category?: ClothingCategory;
          color?: string | null;
        };
        Relationships: [];
      };
      outfits: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          thumbnail_url: string | null; // MVP: Storage-Pfad oder null
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          thumbnail_url?: string | null;
          created_at?: string;
        };
        Update: {
          name?: string;
          thumbnail_url?: string | null;
        };
        Relationships: [];
      };
      outfit_items: {
        Row: {
          id: string;
          outfit_id: string;
          clothing_item_id: string;
          x: number;
          y: number;
          scale: number;
          rotation: number;
          z_index: number;
        };
        Insert: {
          id?: string;
          outfit_id: string;
          clothing_item_id: string;
          x: number;
          y: number;
          scale?: number;
          rotation?: number;
          z_index?: number;
        };
        Update: {
          x?: number;
          y?: number;
          scale?: number;
          rotation?: number;
          z_index?: number;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};



