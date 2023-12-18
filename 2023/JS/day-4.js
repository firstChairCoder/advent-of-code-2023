const fs = require("fs");
const path = require("path");

const data = fs.readFileSync(
	path.resolve(__dirname, "../inputs/day4.txt"),
	"utf-8"
  );
  

function readLines(inputFilePath) {
  const input = fs.readFileSync(inputFilePath, "utf-8");
  return input.replace(/\r\n/g, "\n").split("\n");
}

// console.log(readLines(`../inputs/day4.txt`));

const input = data.trim().split("\n");
console.log(input)
