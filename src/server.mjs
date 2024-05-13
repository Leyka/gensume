import express from "express";
import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import nunjucks from "nunjucks";

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

  res.render("index.njk", jsonResumeData);
});

app.listen(port, () => {
  console.log(`✨ Open http://localhost:${port} in your browser to test your resume.`);
  console.log(
    "✨ Use http://localhost:3000/<lang> to test in different language. Example: http://localhost:3000/fr",
  );
});
