import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { config } from "./config";
import { processResume } from "./resume/resume-processor";

const { dataDir } = config.resume;

async function main(): Promise<void> {
  try {
    const resumes = await readdir(dataDir);
    resumes.forEach(processLocalizedResume);
  } catch (error) {
    console.error(`❌ ${error}`);
    return;
  }
}

async function processLocalizedResume(resumeFileName: string): Promise<void> {
  const resumeFilePath = join(dataDir, resumeFileName);

  try {
    const { validationErrors, resumePdfPath } = await processResume(resumeFilePath);

    if (validationErrors) {
      console.error(`❌ Resume '${resumeFileName}' is invalid. The following errors were found:`);
      console.error(validationErrors);
      return;
    }

    console.log(
      `✅ Resume '${resumeFileName}' was successfully exported as PDF to '${resumePdfPath}'.`,
    );
  } catch (error) {
    console.error(`❌ ${error}`);
    return;
  }
}

main();
