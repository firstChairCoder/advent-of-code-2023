const fs = require("fs");
const path = require("path");

const data = fs.readFileSync(
  path.resolve(__dirname, "../inputs/day6.txt"),
  "utf-8"
);

const inputs = data.trim().split("\n");

const times = inputs[0].split(":")[1].split(/\s+/).filter(Boolean).map(Number);

const distances = inputs[1]
  .split(":")[1]
  .split(/\s+/)
  .filter(Boolean)
  .map(Number);

//returns the product of each item in the array
const product = (items) => items.reduce((acc, curr) => acc * curr, 1);

//returns an array of grouped elements, the first of which contains the first elements of the given arrays, the second of which contains the second elements of the given arrays, and so on
const zip = (...arrs) => {
  const result = [];
  const maxLength = Math.max(...arrs.map((x) => x.length));
  for (let col = 0; col < maxLength; col++) {
    result.push(arrs.map((arr) => arr[col]));
  }
  return result;
};

//splits the string on the delimiter and invokes the map function for each delimited substring;
const parseDelimited = (str, delimiter, mapFn = (x) => x) =>
  str.split(delimiter).map(mapFn);

const parseRaces = (lines, parseFn) =>
  zip(parseFn(lines[0]), parseFn(lines[1]));

const waysToWin = ([raceTime, recordTime]) => {
  //count losing results until first encounter with record
  let lessThanCount = 0;
  let pressTime = 1;
  while (pressTime * (raceTime - pressTime) < recordTime) {
    lessThanCount++;
    pressTime++;
  }
  //race results are a curve, remove the two most remote (losing) ends, this leaves the exact number of ways to win
  return raceTime - lessThanCount * 2 - 1;
};

function getProduct(lines, lineParseFn) {
  return product(parseRaces(lines, lineParseFn).map(waysToWin));
}

//PART1
function getProductOfWaysToBeatRecord({ lines }) {
  return getProduct(lines, (line) =>
    parseDelimited(line.split(":")[1].trim(), /\s+/, Number)
  );
}

console.log("ANSWER ", getProductOfWaysToBeatRecord({ lines: inputs }));

//PART 2
function getNumberOfWaysForLongerRace({ lines }) {
  return getProduct(lines, (line) => [
    Number(line.split(":")[1].replaceAll(/\s+/g, "")),
  ]);
}

console.log(
  "NUMBER OF WAYS: ",
  getNumberOfWaysForLongerRace({ lines: inputs })
);
