import * as path from "path";
import * as fs from "fs";
import { config } from "dotenv";
import z from "zod";

export const projectDirectory = path.dirname(import.meta.dirname);
export const packageDataPath = path.join(projectDirectory, "package.json");
export const packageData = JSON.parse(
  fs.readFileSync(packageDataPath).toString()
);
const dotenvFilenames = packageData["dotenvFilenames"] as string[];

const envSchema = z.object({
  VEILED_DIRECTORY: z.string().default(path.join(projectDirectory, "secret")),
});
const { VEILED_DIRECTORY } = envSchema.parse(process.env);

dotenvFilenames.toReversed().forEach((dotenvFilename) => {
  const dotenvDirectory = VEILED_DIRECTORY;
  const dotenvPath = path.join(dotenvDirectory, dotenvFilename);
  if (fs.existsSync(dotenvPath))
    config({
      path: dotenvPath,
    });
});
