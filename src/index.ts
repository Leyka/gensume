import { readdir } from "node:fs";
import { basename, join } from "node:path";
import { config } from "./config";
import { renderHtmlToPdf, renderToHtml } from "./renderer";
import { readJSONFromFile } from "./utils";
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
  let resumeData;
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

  const fileName = basename(resumeFilePath);
  const fileDotPdf = fileName.substring(0, fileName.lastIndexOf(".")) + ".pdf";
  const resumeOutputPath = join(config.pdf.outputDir, fileDotPdf);

  const { paperSize } = config.pdf;

  await renderHtmlToPdf({
    html,
    resumeOutputPath,
    paperSize,
  });

  console.log(`✅ Resume '${resumeFilePath}' was successfully exported to PDF format.`);
}

main();
