const { rejects } = require('assert');
const fs = require('fs');
const { resolve } = require('path');
const superagent = require('superagent');

/*
    fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
        if(err) return console.log(`error ${err}`);
        console.log(`Bread:${data}`);

        superagent
            .get(`https://dog.ceo/api/breed/${data}/images/random`)
            .end((err, res) => {
                console.log(res.body.message);
                fs.writeFile("dog-url.txt", res.body.message, err => {
                    if(err) return console.log(`error ${err}`);
                    console.log("File written !!!");
                });
            });
    });
 */
// Note: 1. sychrnous way callbacks inside of callback is like callback hell. sometime its more deeper and hard to mentain.

// Promise basically implements the concept of a future value. So basically, a value that we are expecting to receive some time in the future,so it's a bit like us saying, "Hey, server," or "Hey, API, please get me a random dog image "in the background and let me know when you're ready "and then give me that data back."

/*
    fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
        if (err) return console.log(`error ${err}`);
        console.log(`Bread:${data}`);

        superagent
            .get(`https://dog.ceo/api/breed/${data}/images/random`)
            .then(res => {
                console.log(res.body.message);
                fs.writeFile("dog-url.txt", res.body.message, err => {
                    if (err) return console.log(`error ${err}`);
                    console.log("File written !!!");
                });
            }).catch(err => {
                console.log(`error: ${err.message}`);
            });
    });
 */
// Note: here superagent.get return promise.


// Create new Promise for readFile.

const readFilePro = file => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if (err) reject(`Unable to Read txt file.${err}`);
            resolve(data);
        });
    });
}
// Note: if got error in file reading promise return reject OR return resolve with data/result.

const writeFilePro = (file, message) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, message, err => {
            if (err) reject(`Unable to write in file. Error: ${err}`);
            resolve('hello'); // we can return anything or blank ().
        });
    });
}

/*
        readFilePro(`${__dirname}/dog.txt`)
            .then(data => {
                console.log(`Bread:${data}`);
                return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`)
            })
            .then((res) => {
                console.log(res.body.message);
                return writeFilePro('dog-url.txt', res.body.message)
            })
            .then(() => {
                console.log("Random image written in file!!!")
            }).catch(err => {
                console.log(err.message)
            });

            // Here "superagent" and "writeFilePro" return promise so that next "then" called.

    // Note: With the help of promise , if "readFilePro" throw any error then inside "readFilePro" code will not execute, and same will be done with all inside promise.
    // With the help of promise we can create flat architecture of code in place of trangular (callbacks inside callback).

 */

// Async & Await

const getDogPic = async () => {
    try {
        const data = await readFilePro(`${__dirname}/dog.txt`);
        console.log(`Bread:${data}`);

        const res1Pro = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        const res2Pro = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        const res3Pro = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);

        // here we can process multiple promise togather.
        const all = await Promise.all([res1Pro, res2Pro, res3Pro]);
        const imgs = all.map(el => el.body.message);
        console.log(imgs);

        await writeFilePro('dog-url.txt', imgs.join('\n')); // this promise not return value then no need to store in variable.
        console.log("Random image written in file!!!");

        return "Async function return promise, so this string will not show in console.but we can get through promise.";

    } catch (err) {
        console.log(err);
        throw (err); // throw error if getting any error in code.
    }
}

// We can process multiple "promise" at the sametime, like above example.

// const x = getDogPic();
// console.log(x);

/*
    getDogPic()
        .then(x => {
            console.log(x); // Async function return promise, so this string will not show in console.but we can get through promise.
        })
        .catch(err => {
            console.log(err); // show error from "throw" error. "throw" will mark entire promise as rejected.
        });
 */

// 1. async is special keyword, with the help of this we can change normal function to asynchronus funtion.
// 2. async function automatically return promise.
// 3. async not blocking the event loop.
// 4. we can create/use one or more "await" inside async.
// 5. Handling Error in "async & await" we need to use try/catch block inside async.
// 6. we can call "async" function in another "async" function, and it will up to you.

(async () => {
    try {
        console.log("1. First will get dog pics.");
        const x = await getDogPic();
        console.log(x);
        console.log("3. First will get dog pics.");
    } catch (err) {
        console.log(err);
    }
})();