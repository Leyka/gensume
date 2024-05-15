import { join } from "node:path";
import { promisify } from "node:util";
import nunjucks from "nunjucks";
import puppeteer from "puppeteer";
import { config } from "./config.mjs";
import { ensureEndsWith } from "./utils.mjs";

const templateDir = config.html.templateDir;
nunjucks.configure(templateDir, { autoescape: true });

const nunjucksRenderAsync = promisify(nunjucks.render);

/**
 * @param {*} data
 * @returns {Promise<string>} html
 */
export function renderToHtml(data) {
  const templateFile = config.html.templateFile;
  return nunjucksRenderAsync(templateFile, data);
}

/**
 * @param {string} html
 * @param {string} fileName
 * @param {string} paperSize
 * @returns {Promise<void>}
 */
export async function renderHtmlToPdf(html, fileName, paperSize) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);

  const outputDir = config.pdf.outputDir;
  const fileDotPdf = ensureEndsWith(fileName, ".pdf");
  const resumePath = join(outputDir, fileDotPdf);
  await page.pdf({ path: resumePath, format: paperSize });

  await browser.close();
}
