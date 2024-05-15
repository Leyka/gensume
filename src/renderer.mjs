import { promisify } from "node:util";
import nunjucks from "nunjucks";
import puppeteer from "puppeteer";
import { config } from "./config.mjs";

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
 * @param {Object} options
 * @param {string} options.html
 * @param {string} options.paperSize
 * @param {string} options.resumeOutputPath
 */
export async function renderHtmlToPdf({ html, paperSize, resumeOutputPath }) {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.setContent(html);
  await page.pdf({ path: resumeOutputPath, format: paperSize });

  await browser.close();
}
