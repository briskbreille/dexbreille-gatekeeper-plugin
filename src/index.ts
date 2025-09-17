import express = require("express");
import metadata = require("./metadata");
import plugin = require("./plugin");

const name = metadata.packageData["name"] as string;
const port = metadata.packageData["devPort"] as number;

const app = express();
const gatekeeper = plugin.createGatekeeper();

const errorHandler: express.ErrorRequestHandler = (err, _req, res, next) => {
  if (err) {
    const status = (err?.status ?? 500) as number;
    const statusCode = (err?.statusCode ?? 500) as number;
    const message = (err?.message ?? "Something bad happend.") as string;
    res.status(status).json({
      statusCode,
      message,
    });
  }
};

app.get("/", (_req, res) => {
  res.json({
    message: "Plugin development server is running.",
  });
});

if (gatekeeper) app.use("/private", gatekeeper);
app.get("/private", (req, res) => {
  return res.json({
    message: "Private route.",
    payload: req.payload,
  });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(
    `Development server of '${name}' is listening on port ${port}. (http://localhost:${port})`
  );
});
