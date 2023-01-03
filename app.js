const express = require("express");
const fs = require('fs');

const app = express();

app.use(express.json()); // this is middleware. this will provide value for "req.body", without this show undefined.

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
        // tours: tours  // In ES6 do not need to specify key and value at the same name.
        tours,
      }
    });
});

// To modify request data we need to use middleware. and need to define at top.
app.post("/nitours/v1/tours", (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body); // this will merge two object.

  tours.push(newTour);
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    res.status(201).json({
      status: "SUCCESS",
      data: {
        tour: tours,
      }
    })
  });
  // Note: status code 201 for created
});

const port = 3000;

app.listen(port, () => {
  console.log("App is running on port " + port);
});
