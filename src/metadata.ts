import path = require("path");
import fs = require("fs");
import configDotenv = require("dotenv");

const projectDirectory = path.dirname(__dirname);
const packageDataPath = path.join(projectDirectory, "package.json");
const packageData = JSON.parse(fs.readFileSync(packageDataPath).toString());
const dotenvFilenames = packageData["dotenvFilenames"] as string[];

dotenvFilenames.forEach((dotenvFilename) => {
  const dotenvDirectory =
    "SECRET_DIRECTORY" in process.env
      ? (process.env["SECRET_DIRECTORY"] as string)
      : path.join(projectDirectory, "secret");
  const dotenvPath = path.join(dotenvDirectory, dotenvFilename);
  if (fs.existsSync(dotenvPath))
    configDotenv.config({
      path: dotenvPath,
      override: true,
    });
});

export = {
  projectDirectory,
  packageDataPath,
  packageData,
};
