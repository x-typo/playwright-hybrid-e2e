import { APIRequestContext } from "@playwright/test";
import { BaseApiClient } from "./base.api-client";
import { NOTES_ENDPOINTS } from "../endpoints/notes-endpoints";
import {
  CreateNewNoteApiResponse,
  GetAllNotesApiResponse,
  DeleteNoteApiResponse,
  UpdateNoteApiResponse,
  Note as NoteModel,
} from "../models/notes.models";

export class NotesClient extends BaseApiClient {
  constructor(apiContext: APIRequestContext) {
    super(apiContext);
  }

  async getAllNotes() {
    const response = await this.get(NOTES_ENDPOINTS.BASE);
    return this.handleResponse<GetAllNotesApiResponse>(response);
  }

  async createNote(note: Omit<NoteModel, "id" | "created_at" | "updated_at">) {
    const response = await this.post(NOTES_ENDPOINTS.BASE, { data: note });
    return this.handleResponse<CreateNewNoteApiResponse>(response);
  }

  async updateNote(
    noteId: string,
    updatedFields: Partial<Omit<NoteModel, "id" | "created_at" | "updated_at">>
  ): Promise<UpdateNoteApiResponse> {
    const response = await this.put(NOTES_ENDPOINTS.BY_ID(noteId), {
      data: updatedFields,
    });
    return this.handleResponse<UpdateNoteApiResponse>(response);
  }

  async deleteNote(noteId: string): Promise<DeleteNoteApiResponse> {
    const response = await this.delete(NOTES_ENDPOINTS.BY_ID(noteId));
    return this.handleResponse<DeleteNoteApiResponse>(response);
  }
}
