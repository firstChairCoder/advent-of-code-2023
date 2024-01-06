console.time("Execution time");

const fs = require("fs");
const path = require("path");

const data = fs.readFileSync(
  path.resolve(__dirname, "../inputs/day9.txt"),
  "utf-8"
);

const lines = data.trim().split("\n");

const yVals = lines.map((line) => line.split(" ").map((val) => +val));

const lagrange = (x, xVals, yVals) => {
  let lagrangePol = 0;
  for (let i = 0; i < xVals.length; i++) {
    let basicsPol = 1;
    for (let j = 0; j < xVals.length; j++) {
      if (i != j) {
        basicsPol *= (x - xVals[j]) / (xVals[i] - xVals[j]);
      }
    }
    lagrangePol += yVals[i] * basicsPol;
  }
  return lagrangePol;
};

const num = yVals[0].length;

const xVals = new Array(num).fill(0).map((_, i) => i);

const forwardLagranged = yVals.map((vals) => lagrange(num, xVals, vals));

function getSumExtrapolated() {
  return forwardLagranged.reduce((acc, curr) => acc + curr, 0);
}

console.log("OASIS REPORT SUM: ", Math.round(getSumExtrapolated()));

const backwardLagranged = yVals.map((vals) => lagrange(-1, xVals, vals));

function getReverseSumExtrapolated() {
  return backwardLagranged.reduce((acc, curr) => acc + curr, 0);
}

console.log("NEW OASIS REPORT SUM: ", Math.round(getReverseSumExtrapolated()));
