// const hello = "Hello World";
// console.log(hello);

const fs = require("fs");

const textIn = fs.readFileSync("./txt/input.txt",'utf-8');
console.log(textIn);

const textOut = `This is what we know about avacado: ${textIn} \n Created ${Date.now()}`;

fs.writeFileSync('./txt/input.txt',textOut);
console.log("File written");