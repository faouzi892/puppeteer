const express = require("express");
const { scrapeLogic } = require("./scrapeLogic");

const { cat_amazon } = require("./cat-amazon");
const app = express();

const PORT = process.env.PORT || 4000;

app.get("/scrape", (req, res) => {
  scrapeLogic(res);
});

app.get("/cat-amazon", (req, res) => {
  cat_amazon(req, res);
});

app.get("/", (req, res) => {
  res.send("Render Puppeteer server is up and running!");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
