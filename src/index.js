import { readdir } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { config } from "./config.mjs";
import { renderHtmlToPdf, renderToHtml } from "./renderer.mjs";
import { validateResumeSchema } from "./validator.mjs";

const dataDir = config.data.dir;

readdir(dataDir, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  files.forEach(processLocalizedResume);
});

async function processLocalizedResume(fileName) {
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

  const html = await renderToHtml(resumeData);

  const fileDotPdf = fileName.substring(0, fileName.lastIndexOf(".")) + ".pdf";
  const resumeOutputPath = join(config.pdf.outputDir, fileDotPdf);

  await renderHtmlToPdf({
    html,
    resumeOutputPath,
    paperSize: config.pdf.paperSize,
  });

  console.log(`✅ Resume '${fileName}' was successfully exported to PDF format.`);
}

async function readJSONFromFile(fileName) {
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
