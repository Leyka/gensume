import { readdir } from "node:fs";
import { basename, join } from "node:path";
import { config } from "./config";
import { renderHtmlToPdf, renderToHtml } from "./renderer";
import { Resume } from "./types";
import { getResumePdfFileName, readJSONFromFile } from "./utils";
import { validateResumeSchema } from "./validator";

const { dataDir } = config.data;

function main(): void {
  readdir(dataDir, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    files.forEach((file) => {
      const filePath = join(dataDir, file);
      processLocalizedResume(filePath);
    });
  });
}

async function processLocalizedResume(resumeFilePath: string): Promise<void> {
  let resumeData: Resume;
  try {
    resumeData = await readJSONFromFile(resumeFilePath);
  } catch (error) {
    console.error(`❌ ${error}`);
    return;
  }

  const errors = validateResumeSchema(resumeData);
  if (errors) {
    console.error(`❌ Resume '${resumeFilePath}' is invalid. The following errors were found:`);
    console.error(errors);
    return;
  }

  const { templateFile } = config.html;
  const html = renderToHtml(templateFile, resumeData);

  const resumeInputFileName = basename(resumeFilePath);
  const resumeOutputFileName = getResumePdfFileName(resumeFilePath, resumeData.$metadata);
  const resumeOutputPath = join(config.pdf.outputDir, resumeOutputFileName);

  const { paperSize } = config.pdf;

  await renderHtmlToPdf({
    html,
    resumeOutputPath,
    paperSize,
  });

  console.log(
    `✅ Resume '${resumeInputFileName}' was successfully exported as PDF to '${resumeOutputPath}'.`,
  );
}

main();
