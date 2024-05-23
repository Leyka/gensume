import puppeteer, { PaperFormat } from "puppeteer";

type Params = {
  html: string;
  paperSize: string;
  outputPdfFilePath: string;
};

export type GeneratePdfFn = typeof generatePdf;

export async function generatePdf(params: Params): Promise<void> {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.setContent(params.html);
  await page.pdf({ path: params.outputPdfFilePath, format: params.paperSize as PaperFormat });

  await browser.close();
}
