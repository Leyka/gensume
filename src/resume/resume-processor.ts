import { join } from "node:path";
import { ensureEndsWith, extractFileNameFromPath } from "../file/file-utils";
import { ReadJsonFromFileFn, readJsonFromFile } from "../file/json-file-reader";
import { GeneratePdfFn, generatePdf } from "../pdf/pdf-generator";
import { RenderTemplateFn, renderTemplate } from "../template/template-renderer";
import { Resume, ResumeMetadata } from "./resume";
import { ValidateResumeSchemaFn, validateResumeSchema } from "./resume-validator";

type Deps = {
  readJsonFromFile: ReadJsonFromFileFn<Resume>;
  validateResumeSchema: ValidateResumeSchemaFn;
  renderTemplate: RenderTemplateFn;
  generatePdf: GeneratePdfFn;
};

type Params = {
  resumeFilePath: string;
  templateDir: string;
  templateFile: string;
  outputPdfDir: string;
  paperSize: string;
};

type Response = {
  validationErrors?: string[];
  resumePdfPath?: string;
};

export type ProcessResumeFn = ReturnType<typeof makeProcessResume>;

export function makeProcessResume(deps: Deps) {
  return async function processResume(params: Params): Promise<Response> {
    const resumeData = await deps.readJsonFromFile(params.resumeFilePath);

    const validationErrors = deps.validateResumeSchema(resumeData);
    if (validationErrors) {
      return { validationErrors };
    }

    const html = deps.renderTemplate({
      data: resumeData,
      templateDir: params.templateDir,
      templateFile: params.templateFile,
    });

    const resumePdfFileName = getPdfFileName(params.resumeFilePath, resumeData.$metadata);
    const resumePdfPath = join(params.outputPdfDir, resumePdfFileName);
    await deps.generatePdf({
      html,
      paperSize: params.paperSize,
      outputPdfFilePath: resumePdfPath,
    });

    return { resumePdfPath };
  };

  function getPdfFileName(resumeFilePath: string, metadata: ResumeMetadata | undefined): string {
    if (metadata?.exportedFileTitle) {
      return ensureEndsWith(metadata.exportedFileTitle, ".pdf");
    }

    const fileName = extractFileNameFromPath(resumeFilePath);
    const fileWithoutExtension = fileName.substring(0, fileName.lastIndexOf("."));
    return fileWithoutExtension + ".pdf";
  }
}

export const processResume = makeProcessResume({
  readJsonFromFile,
  validateResumeSchema,
  renderTemplate,
  generatePdf,
});
