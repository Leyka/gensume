import { basename, join } from "node:path";
import nunjucks from "nunjucks";
import puppeteer, { PaperFormat } from "puppeteer";
import { config } from "./config";
import { ensureEndsWith, readJsonFromFile } from "./utils";
import { validateResumeSchema } from "./validator";

type Resume = {
  [key: string]: any;
  $metadata?: {
    exportedFileTitle?: string;
  };
};

type ResumeMetadata = Resume["$metadata"];

type GeneratedResumeResponse = {
  validationErrors?: string[];
  resumePdfPath?: string;
};

export async function generateResume(
  resumeJsonFilePath: string,
  paperSize: string,
): Promise<GeneratedResumeResponse> {
  const resumeData = await readJsonFromFile<Resume>(resumeJsonFilePath);

  const validationErrors = validateResumeSchema(resumeData);
  if (validationErrors) {
    return { validationErrors };
  }

  const html = generateHtmlFromTemplate(resumeData);

  const resumePdfFileName = getPdfFileName(resumeJsonFilePath, resumeData.$metadata, paperSize);
  const resumePdfPath = join(config.pdf.outputDir, resumePdfFileName);
  await generatePdfFile(html, resumePdfPath, paperSize);

  return { resumePdfPath };
}

function generateHtmlFromTemplate(data: object): string {
  const { templateDir, templateFile } = config.template;

  const njk = nunjucks.configure(templateDir, { autoescape: true });
  return njk.render(templateFile, data);
}

async function generatePdfFile(
  html: string,
  outputPdfFilePath: string,
  paperSize: string,
): Promise<void> {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.setContent(html);
  await page.pdf({ path: outputPdfFilePath, format: paperSize as PaperFormat });

  await browser.close();
}

function getPdfFileName(
  resumeJsonFilePath: string,
  metadata: ResumeMetadata | undefined,
  paperSize: string,
): string {
  if (metadata?.exportedFileTitle) {
    return ensureEndsWith(metadata.exportedFileTitle, ` - ${paperSize}.pdf`);
  }

  const fileName = basename(resumeJsonFilePath);
  const fileWithoutExtension = fileName.substring(0, fileName.lastIndexOf("."));

  return `${fileWithoutExtension} - ${paperSize}.pdf`;
}
