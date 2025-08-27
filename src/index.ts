import express = require("express");
import metadata = require("./metadata");
import plugin = require("./plugin");

const name = metadata.packageData["name"] as string;
const port = metadata.packageData["devPort"] as number;

const app = express();

plugin.inject(app);

app.get("/", (_req, res) => {
  res.json({
    message: "Plugin development server is running.",
  });
});

app.listen(port, () => {
  console.log(
    `Development server of '${name}' is listening on port ${port}. (http://localhost:${port})`
  );
});
