import { readdir } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { config } from "./config";
import { renderHtmlToPdf, renderToHtml } from "./renderer";
import { validateResumeSchema } from "./validator";

const dataDir = config.data.dir;

readdir(dataDir, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  files.forEach(processLocalizedResume);
});

async function processLocalizedResume(fileName: string) {
  const resumeData = await readJSONFromFile(fileName);
  if (!resumeData) {
    return;
  }

  const errors = validateResumeSchema(resumeData);
  if (errors) {
    console.error(`❌ Resume '${fileName}' is invalid. The following errors were found:`);
    console.error(errors);
    return;
  }

  const resumeTemplateFile = config.html.templateFile;
  const html = await renderToHtml(resumeTemplateFile, resumeData);

  const fileDotPdf = fileName.substring(0, fileName.lastIndexOf(".")) + ".pdf";

  await renderHtmlToPdf({
    html,
    resumeOutputPath: join(config.pdf.outputDir, fileDotPdf),
    paperSize: config.pdf.paperSize,
  });

  console.log(`✅ Resume '${fileName}' was successfully exported to PDF format.`);
}

async function readJSONFromFile(fileName: string) {
  if (!fileName.endsWith(".json")) {
    console.error(`❌ File '${fileName}' is not a JSON file.`);
    return null;
  }

  try {
    const fileData = await readFile(join(dataDir, fileName), "utf-8");
    return JSON.parse(fileData);
  } catch {
    console.error(`❌ File '${fileName}' could not be parsed as JSON`);
    return null;
  }
}
