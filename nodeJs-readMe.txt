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
                              PUT  => /tours/7 => update
                              DELETE => /tours/7 => DELETE

17. Stateless RESTful API: All state is handled on the client not on the server. this means that each request must contains "all"
                           the information necessary to process a certain request. the server should "not" have to remember previous request.

18.
