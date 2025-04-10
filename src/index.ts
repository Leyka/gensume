import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { config } from "./config";
import { generateResume } from "./generator";

const { dataDir } = config.resume;

async function main(): Promise<void> {
  try {
    const resumes = await readdir(dataDir);
    const paperSizes = config.pdf.paperSizes;

    // Generate a resume for each language and paper size
    for (const resumeJsonFileName of resumes) {
      for (const paperSize of paperSizes) {
        await processResume(resumeJsonFileName, paperSize);
      }
    }
  } catch (error) {
    console.error(`❌ ${error}`);
  }
}

async function processResume(resumeJsonFileName: string, paperSize: string): Promise<void> {
  const resumeJsonFilePath = join(dataDir, resumeJsonFileName);

  try {
    const { validationErrors, resumePdfPath } = await generateResume(resumeJsonFilePath, paperSize);

    if (validationErrors) {
      console.error(
        `❌ Resume '${resumeJsonFileName}' with size ${paperSize} is invalid. The following errors were found:`,
      );
      console.error(validationErrors);
      return;
    }

    console.log(
      `✅ Resume '${resumeJsonFileName}' with size ${paperSize} was successfully exported as PDF to '${resumePdfPath}'.`,
    );
  } catch (error) {
    console.error(`❌ ${error}`);
    return;
  }
}

main();
