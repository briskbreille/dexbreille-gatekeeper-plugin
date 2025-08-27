import express = require("express");

const inject = (app: express.Express) => {
  // Add your routes here...

  app.get("/plugin", (req, res) => {
    res.json({
      message: "Hello from plugin",
    });
  });
};

export = {
  inject,
};
