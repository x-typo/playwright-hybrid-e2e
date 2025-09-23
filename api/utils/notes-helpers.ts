import { Note } from "../models/notes.models";

export function getNoteIdByTitle(notes: Note[], title: string): string | null {
  const foundNote = notes.find((n) => n.title === title);
  return foundNote ? foundNote.id : null;
}
