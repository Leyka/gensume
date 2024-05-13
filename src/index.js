import { readdir } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { config } from "./config.mjs";
import { renderHtmlToPdf, renderToHtml } from "./renderer.mjs";
import { validateResumeSchema } from "./validator.mjs";

const dataDir = join(process.cwd(), "data");

readdir(dataDir, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  files.forEach((file) => processLocalizedResume(dataDir, file));
});

async function processLocalizedResume(dataDir, file) {
  const resumeData = await readFile(join(dataDir, file), "utf-8");
  const jsonResumeData = JSON.parse(resumeData);

  const errors = await validateResumeSchema(jsonResumeData);
  if (errors) {
    console.error(`❌ The resume '${file}' is invalid. The following errors were found:`);
    console.error(errors);
    return;
  }

  const html = await renderToHtml(jsonResumeData);

  const lang = file.split(".")[0];
  const paperSize = config.pdf.paperSize;
  await renderHtmlToPdf(html, lang, paperSize);

  console.log(`✅ The resume '${file}' was successfully exported to PDF format.`);
}
