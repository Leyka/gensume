import express from "express";
import nunjucks from "nunjucks";
import { config } from "../config";
import { getByLang } from "./handler";

const app = express();

const { templateDir } = config.template;
nunjucks.configure(templateDir, {
  autoescape: true,
  express: app,
  watch: true,
});

app.set("view engine", "njk");

app.get("/:lang?", getByLang);

const { port } = config.server;
app.listen(port, () => {
  console.log(`✨ Open http://localhost:${port} in your browser to test your resume.`);
  console.log(
    `✨ Append /<lang> to test in different language. Example: http://localhost:${port}/fr`,
  );
});
