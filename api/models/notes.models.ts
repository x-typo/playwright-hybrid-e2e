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

export interface CreateNewNoteApiResponse {
  success: boolean;
  status: number;
  message: string;
  data: Note;
}

export interface GetAllNotesApiResponse {
  success: boolean;
  status: number;
  message: string;
  data: Note[][];
}

export interface DeleteNoteApiResponse {
  success: boolean;
  status: number;
  message: string;
}
