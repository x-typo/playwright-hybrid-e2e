import { BaseApiClient } from "./base.api-client";
import { NOTES_ENDPOINTS as API_ENDPOINTS } from "../endpoints/notes-endpoints";

export type Note = {
  id: string;
  title: string;
  description: string;
  category: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
};

export class NotesClient extends BaseApiClient {
  async getAllNotes(): Promise<Note[]> {
    const res = await this.get(API_ENDPOINTS.GET_ALL);
    const body = await this.handleResponse<{ data: Note[] | Note[][] }>(res);
    const data = Array.isArray(body.data) ? body.data.flat() : [];
    return data as Note[];
  }

  async deleteNoteById(noteId: string) {
    const res = await this.delete(API_ENDPOINTS.DELETE(noteId));
    return this.handleResponse(res);
  }

  async deleteNotesByTitleAndCategory(title: string, category: string) {
    const notes = await this.getAllNotes();
    const matches = notes.filter(
      (note) => note.title === title && note.category === category
    );

    for (const note of matches) {
      await this.deleteNoteById(note.id);
    }

    return {
      deletedCount: matches.length,
      deletedIds: matches.map((n) => n.id),
    };
  }
}
