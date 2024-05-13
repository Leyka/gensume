import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { renderHtmlToPdf, renderToHtml } from "./renderer.mjs";
import { validateResumeSchema } from "./validator.mjs";

export async function processLocalizedResume(dataDir, file) {
  const resumeData = await readFile(join(dataDir, file), "utf-8");
  const jsonResumeData = JSON.parse(resumeData);

  const errors = await validateResumeSchema(jsonResumeData);
  if (errors) {
    console.error(`The resume '${file}' is invalid. The following errors were found:`);
    console.error(errors);
    return;
  }

  const html = await renderToHtml(jsonResumeData);

  const lang = file.split(".")[0];
  await renderHtmlToPdf(html, lang);
}
