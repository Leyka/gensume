import nunjucks from "nunjucks";

type Params = {
  data: object;
  templateDir: string;
  templateFile: string;
};

export type RenderTemplateFn = typeof renderTemplate;

export function renderTemplate(params: Params): string {
  const njk = nunjucks.configure(params.templateDir, { autoescape: true });
  const html = njk.render(params.templateFile, params.data);
  return html;
}
