export interface CreateNewNoteApiResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    created_at: string;
    updated_at: string;
    category: string;
    user_id: string;
  };
}
