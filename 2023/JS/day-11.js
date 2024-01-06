console.time("Execution time");

const fs = require("fs");
const path = require("path");

const data = fs.readFileSync(
  path.resolve(__dirname, "../inputs/day11.txt"),
  "utf-8"
);

const input = data.trim().split("\n");

const maps = [];
const galaxies = [];

for (let line of input) {
  line = line.trim();
  let chars = [];
  for (let char of line) {
    chars.push(char);
  }
  maps.push(chars);
}

function getEmptyRow(x) {
  let isRowEmpty = true;
  for (const char of maps[x]) {
    if (char != ".") isRowEmpty = false;
  }
  return isRowEmpty;
}

function getEmptyColumn(y) {
  let isColumnEmpty = true;
  for (const line of maps) {
    if (line[y] != ".") isColumnEmpty = false;
  }
  return isColumnEmpty;
}

//PART1
for (let i = 0; i < maps.length; i++) {
  for (let j = 0; j < maps[i].length; j++) {
    if (maps[i][j] === "#") {
      maps[i][j] = galaxies.length + 1;
      galaxies.push([maps[i][j], i, j]);
    }
  }
}

let totalSteps = 0;
let totalSteps2 = 0;

for (let i = 0; i < galaxies.length; i++) {
  for (let j = i + 1; j < galaxies.length; j++) {
    let x = galaxies[i][2];
    let y = galaxies[i][1];

    let steps = 0;
    let steps2 = 0;
    let xFinal = galaxies[j][2];
    let yFinal = galaxies[j][1];
    let start = maps[y][x];
    let isBehind = xFinal - x < 0 ? true : false;

    while (start != maps[yFinal][xFinal]) {
      let coefficient = 1;
      let coef2 = 1;
      if (yFinal != y) {
        y++;
        start = maps[y][x];
        if (getEmptyRow(y)) {
          coefficient = 2;
          coef2 = 1000000;
        }
      } else if (xFinal != x) {
        isBehind ? x-- : x++;
        start = maps[y][x];
        if (getEmptyColumn(x)) {
          coefficient = 2;
          coef2 = 1000000;
        }
      }
      steps += 1 * coefficient;
      steps2 += 1 * coef2;
    }
    totalSteps += steps;
    totalSteps2 += steps2;
  }
}

console.log("TOTAL STEPS: ", totalSteps);

//PART2
console.log("ACTUAL TOTAL STEPS: ", totalSteps2);

console.timeEnd("Execution time");
