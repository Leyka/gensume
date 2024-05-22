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

  const resumeTemplateFile = config.html.templateFile;
  const html = renderToHtml(resumeTemplateFile, resumeData);

  const fileName = basename(resumeFilePath);
  const fileDotPdf = fileName.substring(0, fileName.lastIndexOf(".")) + ".pdf";

  await renderHtmlToPdf({
    html,
    resumeOutputPath: join(config.pdf.outputDir, fileDotPdf),
    paperSize: config.pdf.paperSize,
  });

  console.log(`✅ Resume '${resumeFilePath}' was successfully exported to PDF format.`);
}

main();
