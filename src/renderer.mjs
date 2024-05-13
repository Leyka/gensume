import { join } from "node:path";
import { promisify } from "node:util";
import nunjucks from "nunjucks";
import puppeteer from "puppeteer";
import { ensureEndsWith } from "./utils.mjs";

const templateDir = join(process.cwd(), "src", "template");
nunjucks.configure(templateDir, { autoescape: true });

const nunjucksRenderAsync = promisify(nunjucks.render);

export function renderToHtml(data) {
  return nunjucksRenderAsync("index.njk", data);
}

export async function renderHtmlToPdf(html, fileName, format = "letter") {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);

  const fileDotPdf = ensureEndsWith(fileName, ".pdf");
  const resumePath = join(process.cwd(), "resumes", fileDotPdf);

  await page.pdf({ path: resumePath, format: "Letter" });

  await browser.close();
}
