1. Synchronous Code: It executes code line by line, which means that each line of code must wait for the previous code
                     line to resolve. this can be problem specially with slow operation, each line blocks the execution of rest of the code. So we say Synchronous code is also called blocking code.

2. Asynchronous Code: is also called non blocking code. we offload heavy work to background.then the works get done,
                      a callback function register before is called to handle the result, and during all the time rest of the code is executing.

3. Diffrence between normal function vs arrow function

    function(){

    }

    const data = () => {

    }
    1. Arrow function does not have own this keyword, it has parent this, this is called laxical scope. And normal function have own this keyword.

4. Own/Custom Module: In nodeJs every single file treated as module. Example index.js is also module.

5. Package information : 1. ""nodemon": "^2.0.20"" Most of the package use sementic version of packages like "2" is major
                         version "0" is minor version and "20" is patch version.
                         2. "nodemon": "^2.0.20": here ^ prefix means package will accept all minor and all patches releaase.
                         3. "nodemon": "~2.0.20":  here ~ prefix means package will accept only patches release, this is more safer side.
                         4. "nodemon": "*2.0.20":  here * prefix means package will accept all (major, minor, patches) release. this is not good idea.
                         5. $ npm update slugify =>  to update specific package.

6. Node_modules folder: Do not need to store/save node_modules folder on git or any where because it comes through npm install.

7. package.lock.json is necessary when you have package.json in your project application. package.lock.json is created for locking the dependency with the installed version. It will install the exact latest version of that package in your application and save it in package.json. Let’s say if the current version of the package is 1.3.2 then it will save the version with (^) sign. Here carot(^) means, it will support any higher version with major version 1 for eg. 1.2.2.

8. Node, V8, libuv and c++ => need to know more about these.

9. NodeJs is basically a C++ program. NodeJs run in a Single thread no matter its run for 10 users OR 10K users.

10. Node JS is Single thread application and sequence of instructions is like :
    initialize a program => Execute top level code => Require modules => Register event callback => Start event loop.

11. Event Loop done most of the work on Application (its heart of entire node architecture) and some tasks are very expensive/heavy and block the single thread, So thats where thread pool comes in picture.

12. Thread Pool: provide 4 (or more) thread that will be seperated by single thread.and this offload the work from event loop.this
                 will automatically happens, its not up to developer to controll it (who decide to go with thread pool or not).
                 Heavy tasks like : "File System API","Cryptography","Compression","DNS LookUP".

13. Express Js : 1. Express is a minimal node.js framework, a higher level of abstraction.
                 2. Express contains a very robust set of features, complex routing, easier handling of requests and responses, middleware, serverside rendering etc...
                 3. Express allow for rapid development of node.js applications: we don't have to re-invent the wheel.
                 4. Express makes it eaiser to organise our application into the MVC architechture.

14. API : Application programming interface: a piece of software that can be used by another piece of software, in order to allow
          applications to talk to each other.

          Database => JsonData => API => Browsers, Native Mobile APP (ios, android,window)

15. REST (API): Representational state transfer: is basically a way of building web API in logical way.to making them easy to
                consume.

16. HTTP Methods : GET (to read), POST (to create), DELETE (to remove), PATCH, PUT (to update) , we can use same endpoint for all
                   types of http methods, and based on these method endpoint works perfectly.
                   Example => POST => /tours => create
                              GET  => /tours/7 => read
                              PUT  => /tours/7 => update  // Update the entire Object of the data.
                              PATCH => /tours/7 => update // Update the property of Object not entire object of the data.
                              DELETE => /tours/7 => DELETE

17. Stateless RESTful API: All state is handled on the client not on the server. this means that each request must contains "all"
                           the information necessary to process a certain request. the server should "not" have to remember previous request.

18. Middleware : Middleware is basically a function that can modify the incoming data.It's called middleware because it stands
                 between, so in the middle of the request and the response.
                 Examples: 1. parsing body
                           2. logging
                           3. setting headers
                           4. router
                Note: 1. All the middleware working togather in application is called middleware stack.
                      2. In case of middleware Order of middleware is more important, otherwise it will not work properly.
                      3. If middleware code write after routes then this case request and response cycle will complete before this
                          in that case middleware not call.


19. status code: code 200 means "OK" and  "201" means "created", and "404" means "notFound" and "204" means "contentNotAvailable".

20. Each Router is mini sub application for each resource(tour, user ...).

21. Environment variables are global variables that are used to define the environment in which a node app is running.
    EveryThing not related to express we need to write in outside from app.js (LIKE server.js), the environment variables
    are really outside the scope of Express.

22. Some dev dependancy need to use/install every project and both config files parallel to package.json file.
   npm i eslint eslint-config-airbnb eslint-plugin-node eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react --save-dev

23. filename =>> .eslintrc.json

             {
                "extends": ["airbnb", "plugin:node/recommended"],
                //"plugins": ["prettier"],
                "rules": {
                 //   "prettier/prettier": "error",
                    "spaced-comment": "off",
                    "no-console": "warn",
                    "consistent-return": "off",
                    "func-names": "off",
                    "object-shorthand": "off",
                    "no-process-exit": "off",
                    "no-param-reassign": "off",
                    "no-return-await": "off",
                    "no-underscore-dangle": "off",
                    "class-methods-use-this": "off",
                    "prefer-destructuring": ["error", { "object": true, "array": false }],
                    "no-unused-vars": ["error", { "argsIgnorePattern": "req|res|next|val" }]
                }
             }

24. MongoDB is a document database with the scalability and flexibility that you want, and with the querying and indexing
    that you need.
     BSON: Data format MongoDB uses for data storage. Like JSON, but "Typed", So MongoDB documents are "Typed".
          1.  MongoDB ==== Mysql
              Collections === tables
              documents ==== Rows

          2. The maximum size for each document is currently 16 MB, but this might increase in the future.
          3. Each document contains a unique ID, which acts as a primary key of that document. It's automatically generated
             with the object ID data type each time there is a new document.

25. Always use doubleQuote in JSON, because JSON not recognise singleQuote. AND in JS Always use singleQuote and "template litterals".

26. MongoDB Helps:()
                1. connect with mongo shell.
                      $ mongo (if install mongodb)
                      $ mongosh (if install mongod)
                   // start server
                      $ sudo systemctl restart mongod
                   // Check port number
                      $ sudo lsof -i | grep mongo
                   // Check status
                      $ sudo service mongod status

                2. Create database
                   > use tours_guide;

                3. Insert data into collection. (data as similar as JS object, In format of BSON, doubleQuote in key not required).

                   >db.tours_records.insertOne({name:"My test tour4",price:330,ratings:3.2});
                   >db.tours_records.insertMany([{name:"My test tour7",price:430,ratings:5.2},{name:"My test tour6",price:510,ratings:4.2}]);

                4. Select Data from collection.
                > db.tours_records.find({name: "My test tour1"});

                =>> AND Operator between two keys (this matchs exact value)
                > db.tours_records.find({name: "My test tour1",ratings: 4.5});

                =>> OR Operatods between two keys (this matchs exact value)
                > db.tours_records.find({$or: [{name: "My test tour2"}, {ratings:4.5}] });
                > db.tours_records.find({$or: [{name: "My test tour2"}, {ratings:{$gte:3.5}}] }); // grearter than equals to
                > db.tours_records.find({$or: [{name: "My test tour2"}, {ratings:{$gt:4.2}}] }); // greater than


                =>> show only specific columns from resulted document.
                > db.tours_records.find({$or: [{name: "My test tour2"}, {ratings:{$gt:4.2}}] },{name:1}); // show only name

                 5.Update Data from collection.
                  > db.tours_records.updateOne({name: "My test tour2"},{$set:{ratings:1.5}}); // Here find "My test tour2" and update ratings.
                  > db.tours_records.updateOne({name: "My test tour2"},{$set:{premium:true}}); // Add new field in existing document like "premium".
                    // Note "$set" update existing field as well as create new one in existing document.
                  >db.tours_records.updateMany({ ratings:{$gt:4.2}, {$set: {premium:true} } }); // Find and update multiple documents at sametime.

                6. Replace the whole document.
                 > db.tours_records.replaceOne({...})
                 > db.tours_records.replaceMany({...})
                7. DELETE the whole document.
                  > db.tours_records.deleteOne({name:"My test tour4"});
                  > db.tours_records.deleteMany({...});

27. MongoDB tools (For UI => compass ) start from console: $ mongodb-compass
                  =>>> install from here https://www.mongodb.com/docs/compass/current/install/
                  =>>> if any problem found then run..
                   $ sudo apt --fix-broken install

28. Mongoose : Mongoose is an object data modeling library for MongoDB and Node JS, providing a higher level of abstraction.mongoose
               allows for rapid and simple development of mongodb database interactions.

               MOngoose is all about models, and models is like blueprint the we use to create document.

               Features: schemas to model data and relationships, eaisy data validation, Simple query API, middleware etc...

               Mongoose Schemas: where we model our data, by describing the structure of the data, default values and validation.

               Mongoose Model: a wrapper of schema, providing an interface to the database for the CRUD Operations.


29. Always use Uppercase in model name, that's standard in programming.

30. MVC : (Model, view, Controller)
          Model : The model layer is concerned with everything about applications data, and the business logic.

          Controller : The controller layer and the function of the controllers is to handle the application's request,
                       interact with models, and send back responses to the client.

          View : the view layer is necessary if we have a graphical interface in our app. Or in other words, if we're building
                 a server-side rendered website,

31. unwind : unwind is gonna do is basically deconstruct an array field from the info documents and then output one document for each element of the array.

32.
