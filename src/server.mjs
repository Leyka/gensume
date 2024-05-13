import express from "express";
import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import nunjucks from "nunjucks";
import { validateResumeSchema } from "./validator.mjs";

const port = 3000;
const app = express();

const dataDir = join(process.cwd(), "data");
const defaultResumeLang = "en";

nunjucks.configure("./src/template", { autoescape: true, express: app, watch: true });

app.set("view engine", "njk");

app.get("/:lang?", async (req, res) => {
  const lang = req.params.lang || defaultResumeLang;

  const resumePath = join(dataDir, `${lang}.json`);
  const fileExists = await access(resumePath)
    .then(() => true)
    .catch(() => false);

  if (!fileExists) {
    res.status(404).send(`Error: resume "${resumePath}" was not found.`);
    return;
  }

  const resumeData = await readFile(resumePath, "utf-8");
  const jsonResumeData = JSON.parse(resumeData);

  // Validate the resume data here
  const errors = await validateResumeSchema(jsonResumeData);
  if (errors) {
    res.status(400).send(formatSchemaValidationError(lang, errors));
    return;
  }

  res.render("index.njk", jsonResumeData);
});

app.listen(port, () => {
  console.log(`✨ Open http://localhost:${port} in your browser to test your resume.`);
  console.log(
    "✨ Use http://localhost:3000/<lang> to test in different language. Example: http://localhost:3000/fr",
  );
});

function formatSchemaValidationError(lang, errors) {
  let errMsg = `
    <h2>The resume "${lang}" has invalid schema.</h2>
    <p>The following errors were found:</p>
    <pre><ul>`;
  errors.forEach((error) => {
    errMsg += `<li>${error}</li>`;
  });
  errMsg += "</ul></pre>";

  return errMsg;
}
