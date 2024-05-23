import express from "express";
import { join } from "node:path";
import nunjucks from "nunjucks";
import { config } from "../config";
import { readJsonFromFile } from "../utils";
import { validateResumeSchema } from "../validator";

const { port } = config.server;
const app = express();

const { templateDir } = config.template;

nunjucks.configure(templateDir, {
  autoescape: true,
  express: app,
  watch: true,
});

app.set("view engine", "njk");

app.get("/:lang?", async (req, res) => {
  const { dataDir } = config.resume;
  const { defaultLang } = config.server;
  const lang = req.params.lang || defaultLang;
  const resumeFilePath = join(dataDir, `${lang}.json`);

  let resumeData;
  try {
    resumeData = await readJsonFromFile(resumeFilePath);
  } catch (error) {
    res.status(400).send(`Error: ${error}`);
    return;
  }

  const errors = await validateResumeSchema(resumeData);
  if (errors) {
    let err = `
    <h2>The resume "${lang}" has invalid schema.</h2>
    <p>The following errors were found:</p>
    <pre><ul>`;

    errors.forEach((error) => {
      err += `<li>${error}</li>`;
    });

    err += "</ul></pre>";

    res.status(400).send(err);
    return;
  }

  const { templateFile } = config.template;
  const data = { ...resumeData, lang };
  res.render(templateFile, data);
});

app.listen(port, () => {
  console.log(`✨ Open http://localhost:${port} in your browser to test your resume.`);
  console.log(
    "✨ Use http://localhost:3000/<lang> to test in different language. Example: http://localhost:3000/fr",
  );
});
