1. Synchronous Code: It executes code line by line, which means that each line of code must wait for the previous code line to resolve. this can be problem specially with slow operation, each line blocks the execution of rest of the code. So we say Synchronous code is also called blocking code.

2. Asynchronous Code: is also called non blocking code. we offload heavy work to background.then the works get done, a callback function register before is called to handle the result, and during all the time rest of the code is executing.

3. Diffrence between normal function vs arrow function

    function(){

    }

    const data = () => {

    }
    1. Arrow function does not have own this keyword, it has parent this, this is called laxical scope. And normal function have own this keyword.

4. Own/Custom Module: In nodeJs every single file treated as module. Example index.js is also module.
