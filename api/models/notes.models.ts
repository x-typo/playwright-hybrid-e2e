export interface Note {
  id: string;
  title: string;
  description: string;
  category: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data?: T;
}

export type CreateNoteApiResponse = ApiResponse<Note>;
export type GetAllNotesApiResponse = ApiResponse<Note[]>;
export type UpdateNoteApiResponse = ApiResponse<Note>;
export type DeleteNoteApiResponse = ApiResponse<undefined>;
