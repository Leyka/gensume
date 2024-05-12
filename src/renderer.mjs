import nunjucks from "nunjucks";
import { join } from "path";

const templateDir = join(process.cwd(), "src", "template");
nunjucks.configure(templateDir, { autoescape: true });

export function renderToHtml(data) {
  return nunjucks.render("index.njk", data, (err, html) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(html);
  });
}
