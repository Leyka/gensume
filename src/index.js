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
  if (!fileName.endsWith(".json")) {
    console.error(`❌ The file '${fileName}' is not a JSON file.`);
    return;
  }

  const resumeData = await readFile(join(dataDir, fileName), "utf-8");
  const jsonResumeData = JSON.parse(resumeData);

  const errors = await validateResumeSchema(jsonResumeData);
  if (errors) {
    console.error(`❌ The resume '${fileName}' is invalid. The following errors were found:`);
    console.error(errors);
    return;
  }

  const html = await renderToHtml(jsonResumeData);

  const fileDotPdf = fileName.substring(0, fileName.lastIndexOf(".")) + ".pdf";
  const resumeOutputPath = join(config.pdf.outputDir, fileDotPdf);

  await renderHtmlToPdf({
    html,
    resumeOutputPath,
    paperSize: config.pdf.paperSize,
  });

  console.log(`✅ The resume '${fileName}' was successfully exported to PDF format.`);
}
