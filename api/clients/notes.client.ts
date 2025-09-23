import { APIRequestContext } from "@playwright/test";
import { BaseApiClient } from "./base.api-client";
import { NOTES_ENDPOINTS } from "../endpoints/notes-endpoints";
import {
  CreateNewNoteApiResponse,
  GetAllNotesApiResponse,
  DeleteNoteApiResponse,
  Note as NoteModel,
} from "../models/notes.models";

export class NotesClient extends BaseApiClient {
  constructor(apiContext: APIRequestContext) {
    super(apiContext);
  }

  async getAllNotes(): Promise<GetAllNotesApiResponse> {
    const response = await this.get(NOTES_ENDPOINTS.GET_ALL);
    return this.handleResponse<GetAllNotesApiResponse>(response);
  }

  async createNote(
    note: Omit<NoteModel, "id" | "created_at" | "updated_at">
  ): Promise<CreateNewNoteApiResponse> {
    const response = await this.post(NOTES_ENDPOINTS.CREATE, { data: note });
    return this.handleResponse<CreateNewNoteApiResponse>(response);
  }

  async deleteNote(noteId: string): Promise<DeleteNoteApiResponse> {
    const response = await this.delete(NOTES_ENDPOINTS.DELETE(noteId));
    return this.handleResponse<DeleteNoteApiResponse>(response);
  }
}
