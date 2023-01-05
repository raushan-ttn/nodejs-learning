const dotenv = require('dotenv');
dotenv.config({ path: `./config.env` });
const app = require("./app");

// Set custom env variable in express, there is many ways like:
// Steps => 1. stop running node server.
//          2. $ NODE_ENV=development nodemon server.js // this will set NODE_ENV variable and start server.
//          3. $ NODE_X=raushanTiwari nodemon server.js // No extra space in env variable

// Second way create config.env file and define all variables here.

// Define custom env variable in express.
// dotenv.config({ path: `./config.env` }); // this will run once at server start time and available in each file through "process.env"

// EveryThing not related to express we need to write in outside from app.js (LIKE server.js) the environment variables are really outside the scope of Express. #######

// this env variable set by express, but NodeJs provides lots of env.
    console.log(app.get('env')); // output: development

// NodeJs also provided env variables
    // console.log(process.env);


//##### SERVER START ##########
const port = process.env.PORT || 3000; // with help of "process.env" get variable in any file, not only here.
app.listen(port, () => {
  console.log("App is running on port " + port);
});

