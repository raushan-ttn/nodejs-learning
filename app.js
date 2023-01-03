const express = require("express");
const fs = require('fs');

const app = express();


// Post API callbacks.
/*
  app.get("/", (req, res) => {
    // we can also send string.
    // res.status(200).send("Hello world");
    res
      .status(200)
      .json({ message: "ExpressJs is running on port 3000", app: "natours" });
  });
*/

// Post API callbacks.
/*
  app.post("/", (req, res) => {
    res.send("Hello world from POST API"); // status code 200 is by default.
  });
*/

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
// Note when we call API event loop is working from app.get, so that we can read file at top, because its read once for all request.
app.get("/nitours/v1/tours", (req, res) => {
  res
    .status(200)
    .json({
      status: "SUCCESS",
      result: tours.length,
      data: {
         tours,
      }
    });
});

const port = 3000;

app.listen(port, () => {
  console.log("App is running on port " + port);
});
