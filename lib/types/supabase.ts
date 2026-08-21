export interface Database {
  public: {
    Tables: {
      documents: {
        Row: {
          id: string;
          owner_id: string;
          title: string;
          content: Record<string, unknown>;
          file_name: string | null;
          file_size: number | null;
          file_storage_path: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          title?: string;
          content?: Record<string, unknown>;
          file_name?: string | null;
          file_size?: number | null;
          file_storage_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          title?: string;
          content?: Record<string, unknown>;
          file_name?: string | null;
          file_size?: number | null;
          file_storage_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      document_shares: {
        Row: {
          id: string;
          document_id: string;
          shared_with_user_id: string;
          permission: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          document_id: string;
          shared_with_user_id: string;
          permission?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          document_id?: string;
          shared_with_user_id?: string;
          permission?: string;
          created_at?: string;
        };
      };
    };
  };
}

export type Document = Database["public"]["Tables"]["documents"]["Row"];
export type DocumentInsert =
  Database["public"]["Tables"]["documents"]["Insert"];
export type DocumentUpdate =
  Database["public"]["Tables"]["documents"]["Update"];
