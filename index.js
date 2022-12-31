// const hello = "Hello World";
// console.log(hello);

const fs = require("fs");
const http = require("http");
const url = require("url");

/////////////////////////////////////
// FILES

// Blocking code. Synchronous way.
/*
    const textIn = fs.readFileSync("./txt/input.txt",'utf-8');
    console.log(textIn);

    const textOut = `This is what we know about avacado: ${textIn} \n Created ${Date.now()}`;

    fs.writeFileSync('./txt/input.txt',textOut);
    console.log("File written");
 */

// Non-Blocking code. ASynchronous way.
/*
    fs.readFile("./txt/start.txt", 'utf-8', (err, data) => {
        if (err) {
            console.log("Error!!!" + err);
            return;
        }
        fs.readFile(`./txt/${data}.txt`, 'utf-8', (err1, data1) => {
            console.log(data1);
            fs.readFile("./txt/append.txt", 'utf-8', (err2, data2) => {
                console.log(data2);
                fs.writeFile("./txt/final.txt", `${data1}\n${data2}`, 'utf-8', err => {
                    console.log("Our file written");
                });
            });
        });
    });

    console.log("We are reading files");

 */

// Note: If we get error during file read then will not execute below lines.otherwise works fine.

/////////////////////////////////////
// SERVERS
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
    const pathName = req.url;
    if (pathName === '/' || pathName === '/overview') {
        res.end("This is OVERVIEW!!!");
    } else if (pathName === '/product') {
        res.end("This is PRODUCT!!!");
    } else if (pathName === '/api') {
        res.writeHead(200, {
            "Content-type": "application/json"
        });
        res.end(data);
    }
    else {
        res.writeHead(404, {
            "Content-type": "text-html",
            'MyOwn-header': 'Hello world'
        });
        res.end("<h1>Page Not Found !!!</h1>");
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log("listing nodeJs server from 8000")
});

// Note: console.log output will show in terminal not browser console.
// We can create multiple Route based on conditions in NodeJs. (this not belongs to directory path like /templates).
// http.createServer call every page load. So if we use readFile inside "/api" then file will be read every page load. So we readFile once (synchronous way) at the top of the file. this will call only once.
//