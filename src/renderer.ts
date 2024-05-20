import { promisify } from "node:util";
import nunjucks from "nunjucks";
import puppeteer, { PaperFormat } from "puppeteer";
import { config } from "./config";

const templateDir = config.html.templateDir;
nunjucks.configure(templateDir, { autoescape: true });

const nunjucksRenderAsync: (name: string, context?: object) => Promise<string> = promisify(
  nunjucks.render,
);

export function renderToHtml(templateFile: string, data: object) {
  return nunjucksRenderAsync(templateFile, data);
}

export async function renderHtmlToPdf(params: {
  html: string;
  paperSize: string;
  resumeOutputPath: string;
}) {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.setContent(params.html);
  await page.pdf({ path: params.resumeOutputPath, format: params.paperSize as PaperFormat });

  await browser.close();
}
