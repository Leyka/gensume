import { readFile } from "node:fs/promises";
import { checkIfFileExists } from "./file-utils";

export type ReadJsonFromFileFn<T extends object> = typeof readJsonFromFile<T>;

export async function readJsonFromFile<T>(filePath: string): Promise<T> {
  if (!filePath.endsWith(".json")) {
    throw new Error(`File '${filePath}' is not a JSON file.`);
  }

  const fileExists = await checkIfFileExists(filePath);
  if (!fileExists) {
    throw new Error(`File '${filePath}' does not exist.`);
  }

  try {
    const fileData = await readFile(filePath, "utf-8");
    return JSON.parse(fileData);
  } catch {
    throw new Error(`Error reading file '${filePath}'. Check if the file has valid JSON content.`);
  }
}
