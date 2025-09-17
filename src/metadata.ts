import * as path from "path";
import * as fs from "fs";
import { config } from "dotenv";

export const projectDirectory = path.dirname(import.meta.dirname);
export const packageDataPath = path.join(projectDirectory, "package.json");
export const packageData = JSON.parse(
  fs.readFileSync(packageDataPath).toString()
);
const dotenvFilenames = packageData["dotenvFilenames"] as string[];

dotenvFilenames.forEach((dotenvFilename) => {
  const dotenvDirectory =
    "SECRET_DIRECTORY" in process.env
      ? (process.env["SECRET_DIRECTORY"] as string)
      : path.join(projectDirectory, "secret");
  const dotenvPath = path.join(dotenvDirectory, dotenvFilename);
  if (fs.existsSync(dotenvPath))
    config({
      path: dotenvPath,
      override: true,
    });
});
