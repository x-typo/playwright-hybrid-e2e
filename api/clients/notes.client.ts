import { APIRequestContext } from "@playwright/test";
import { API_ENDPOINTS } from "../routes/endpoints";

export class NotesClient {
  constructor(private request: APIRequestContext) {}

  async deleteNoteById(noteId: string) {
    const endpointPath = API_ENDPOINTS.notes.deleteById(noteId);
    const response = await this.request.delete(endpointPath);
    return response;
  }
}
