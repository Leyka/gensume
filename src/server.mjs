import express from "express";
import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import nunjucks from "nunjucks";
import { config } from "./config.mjs";
import { validateResumeSchema } from "./validator.mjs";

const dataDir = join(process.cwd(), "data");
const defaultResumeLang = config.pdf.defaultLang;

const port = config.server.port;
const app = express();
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

  const errors = await validateResumeSchema(jsonResumeData);
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

  res.render("resume.njk", jsonResumeData);
});

app.listen(port, () => {
  console.log(`✨ Open http://localhost:${port} in your browser to test your resume.`);
  console.log(
    "✨ Use http://localhost:3000/<lang> to test in different language. Example: http://localhost:3000/fr",
  );
});
