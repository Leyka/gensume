import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { config } from "./config";
import { generateResume } from "./generator";

const { dataDir } = config.resume;

async function main(): Promise<void> {
  try {
    const resumes = await readdir(dataDir);
    resumes.forEach(processResume);
  } catch (error) {
    console.error(`❌ ${error}`);
  }
}

async function processResume(resumeJsonFileName: string): Promise<void> {
  const resumeJsonFilePath = join(dataDir, resumeJsonFileName);

  try {
    const { validationErrors, resumePdfPath } = await generateResume(resumeJsonFilePath);

    if (validationErrors) {
      console.error(
        `❌ Resume '${resumeJsonFileName}' is invalid. The following errors were found:`,
      );
      console.error(validationErrors);
      return;
    }

    console.log(
      `✅ Resume '${resumeJsonFileName}' was successfully exported as PDF to '${resumePdfPath}'.`,
    );
  } catch (error) {
    console.error(`❌ ${error}`);
    return;
  }
}

main();
