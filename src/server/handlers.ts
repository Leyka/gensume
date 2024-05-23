import { Request, Response } from "express";
import { join } from "node:path";
import { config } from "../config";
import { readJsonFromFile } from "../utils";
import { validateResumeSchema } from "../validator";

// GET /:lang?
export async function handleGetResume(req: Request, res: Response) {
  const { dataDir } = config.resume;
  const { defaultLang } = config.server;
  const lang = req.params.lang || defaultLang;
  const resumeFilePath = join(dataDir, `${lang}.json`);

  let resumeData;
  try {
    resumeData = await readJsonFromFile(resumeFilePath);
  } catch (error: any) {
    res.status(400).send(`Error: ${error.message}`);
    return;
  }

  const errors = validateResumeSchema(resumeData);
  if (errors) {
    res.status(400).send(generateErrorHtml(lang, errors));
    return;
  }

  const { templateFile } = config.template;
  const data = { ...resumeData, lang };
  res.render(templateFile, data);
}

function generateErrorHtml(lang: string, errors: string[]): string {
  return `
      <h2>The resume "${lang}" has invalid schema.</h2>
      <p>The following errors were found:</p>
      <pre><ul>${errors.map((error) => `<li>${error}</li>`).join("")}</ul></pre>`;
}
