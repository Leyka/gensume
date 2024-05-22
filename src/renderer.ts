import nunjucks from "nunjucks";
import puppeteer, { PaperFormat } from "puppeteer";
import { config } from "./config";

export function renderToHtml(templateFile: string, data: object): string {
  const { templateDir } = config.html;
  const njk = nunjucks.configure(templateDir, { autoescape: true });

  return njk.render(templateFile, data);
}

export async function renderHtmlToPdf(params: {
  html: string;
  paperSize: string;
  resumeOutputPath: string;
}): Promise<void> {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.setContent(params.html);
  await page.pdf({ path: params.resumeOutputPath, format: params.paperSize as PaperFormat });

  await browser.close();
}
