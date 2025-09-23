import { Note } from "../models/notes.models";

export function getNoteIdByTitle(
  notes: Note[][],
  title: string
): string | null {
  const allNotes = notes.flat();
  const foundNote = allNotes.find((n) => n.title === title);
  return foundNote ? foundNote.id : null;
}
