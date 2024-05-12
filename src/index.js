import { readdir } from "node:fs";
import { join } from "node:path";
import { processLocalizedResume } from "./processor.mjs";

const resumesDir = join(process.cwd(), "resumes");

readdir(resumesDir, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  files.forEach((file) => processLocalizedResume(resumesDir, file));
});
