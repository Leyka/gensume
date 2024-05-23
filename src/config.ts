import { join } from "node:path";

export const config = {
  server: {
    port: 3000,
    defaultLang: "en",
  },
  resume: {
    dataDir: join(process.cwd(), "data"),
  },
  template: {
    templateDir: join(process.cwd(), "src", "template"),
    templateFile: "resume.njk",
  },
  pdf: {
    paperSize: "Letter", // Letter, Legal, A4, etc.
    outputDir: join(process.cwd(), "resumes"),
  },
};
