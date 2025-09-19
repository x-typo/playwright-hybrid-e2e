import { APIRequestContext } from "@playwright/test";
import { NOTES_ENDPOINTS as API_ENDPOINTS } from "../endpoints/notes-endpoints";

export class NotesClient {
  constructor(private request: APIRequestContext) {}

  // async deleteNoteById(noteId: string) {
  //   const endpointPath = API_ENDPOINTS.notes.deleteById(noteId);
  //   const response = await this.request.delete(endpointPath);
  //   return response;
  // }
}
