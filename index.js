// const hello = "Hello World";
// console.log(hello);

const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate"); // do not use .js in file name as per other modules, and name should be upto you.

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

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

// Read API json file
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true); // De-structuring: create variable with same key from object.
    // Note: if we pass "true" in url.parse then get query params in object.

    // Overview page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { "Content-type": "text/html" });

        const cardsHtml = dataObj.map(product => replaceTemplate(tempCard, product)).join('');
        const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);

        res.end(output);
        // Product page

    } else if (pathname === '/product') {
        res.writeHead(200, { "Content-type": "text/html" });
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
        // API

    } else if (pathname === '/api') {
        res.writeHead(200, {
            "Content-type": "application/json"
        });
        res.end(data);

        // Not Found page
    } else {
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
// templates will call synchronous same like read file.