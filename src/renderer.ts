import nunjucks from "nunjucks";
import puppeteer, { PaperFormat } from "puppeteer";
import { config } from "./config";

nunjucks.configure(config.html.templateDir, { autoescape: true });

export function renderToHtml(templateFile: string, data: object) {
  return nunjucks.render(templateFile, data);
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
