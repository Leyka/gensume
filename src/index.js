import { readdir } from "node:fs";
import { join } from "node:path";
import { processLocalizedResume } from "./processor.mjs";

const dataDir = join(process.cwd(), "data");

readdir(dataDir, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  files.forEach((file) => processLocalizedResume(dataDir, file));
});
