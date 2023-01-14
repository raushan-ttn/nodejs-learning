const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE_LOCAL;

// this handler will be very top in application, because it catch all "uncaughtException",
// If this will be at bottom then it will not catch and getting error.
process.on('uncaughtException', (err) => {
  console.log('uncaughtException ! Shutting Down...');
  console.log(err.name, err.message);
  process.exit(1);
});
// console.log(x); // example to reproduce "uncaughtException".
// if we paste "console.log(x);" inside MIDDLEWARE then this will show error when route call.
// Becoz middleware calls when we call route.

// Display Query on console for each request.
mongoose.set('debug', (collectionName, method, query, doc) => {
  console.log(`${collectionName}.${method}`, JSON.stringify(query), doc);
});

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
}).then(() => {
  // console.log(con.connections);
  console.log('Database connected Successfully!!!');
}).catch((err) => {
  console.log(err);
});

// Set custom env variable in express, there is many ways like:
// Steps => 1. stop running node server.
//  2. $ NODE_ENV=development nodemon server.js // this will set NODE_ENV variable and start server.
//          3. $ NODE_X=raushanTiwari nodemon server.js // No extra space in env variable

// Second way create config.env file and define all variables here.

// Define custom env variable in express.
// dotenv.config({ path: `./config.env` });
// this will run once at server start time and available in each file through "process.env"

// EveryThing not related to express we need to write in outside from app.js
// (LIKE server.js) the environment variables are really outside the scope of Express. #######

// this env variable set by express, but NodeJs provides lots of env.
console.log(app.get('env')); // output: development

// NodeJs also provided env variables
// console.log(process.env);

//##### SERVER START ##########
// with help of "process.env" get variable in any file, not only here.
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

// unhandledRejection: is event and we need to handle here.
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1); // 0 = success and 1 = exception
  });
});

// Note: In nodeJs this is not good practice to blindly relay on this two error handlers
// ("unhandledRejection" and "uncaughtException")
//
