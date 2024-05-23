import { access } from "node:fs/promises";
import { basename } from "node:path";

export async function checkIfFileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export function extractFileNameFromPath(filePath: string): string {
  return basename(filePath);
}

export function ensureEndsWith(input: string, ending: string): string {
  return input.endsWith(ending) ? input : input + ending;
}
