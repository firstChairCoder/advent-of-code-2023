console.time('Execution time')

const fs = require("fs");
const path = require("path");

const data = fs.readFileSync(
  path.resolve(__dirname, "../inputs/day21.txt"),
  "utf-8"
);

const dirs = { R: [1, 0], L: [-1, 0], U: [0, 1], D: [0, -1] };
const input = data.trim().split(/\r?\n/gm);
const input2 = data.trim().split(/\r?\n/gm);

function mod(n, m) {
  return ((n % m) + m) % m;
}

const map = new Map();
let start;

//FOR PART1
for (let y = 0; y < input.length; y++) {
  for (let x = 0; x < input[0].length; x++) {
    const char = input[y][x];
    if (char === "." || char === "S") {
      map.set(`${x}, ${y}`, { x, y });
      if (char === "S") {
        start = `${x}, ${y}`;
      }
    }
  }
}

//FOR PART2
for (let y = 0; y < input2.length; y++) {
  for (let x = 0; x < input2[0].length; x++) {
    const char = input2[y][x];
    if (char === "." || char === "S") {
      map.set(`${x}, ${y}`, 0);
      if (char === "S") {
        start = `${x}, ${y}`;
      }
    }
  }
}

//PART1
function getGardenPlotsIn64Steps() {
  const toVisit = new Map([[start, 0]]);
  const visited = new Map();
  const stepsTaken = 64;

  for (const [point, step] of toVisit) {
    if (step > stepsTaken) continue;
    if (visited.has(point)) continue;
    visited.set(point, step);
    const [currX, currY] = point.split(", ").map(Number);
    for (const [xChange, yChange] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nextX = currX + xChange;
      const nextY = currY + yChange;
      const nextPoint = `${nextX}, ${nextY}`;
      if (
        map.has(nextPoint) &&
        !visited.has(nextPoint) &&
        !toVisit.has(nextPoint)
      ) {
        toVisit.set(nextPoint, step + 1);
      }
    }
  }
  console.log("PART1: ", [...visited.values()].filter((x) => x % 2 === 0).length);
}

getGardenPlotsIn64Steps();

//PART2
function getGardenPlotsIn26501365Steps() {
  const height = input2.length;
  const width = input2[0].length;
  const toVisit = new Map([[start, 0]]);
  const stepsTaken = 26501365;
  const afterNeeded = stepsTaken + 1;
  const widthTimesTwo = width * 2;
  const neededModulo = afterNeeded % widthTimesTwo;
  let good = 0;
  let onestep = 0;
  const validationRounds = 2;
  for (const value of toVisit) {
    const [point, step] = value;
    if (onestep < step && step > (width * 2)) {
      const dataset = [...new Set(map.values())]
        .filter((x) => x !== 0)
        .sort((a, b) => a - b);
      const groups = [...map.values()]
        .filter((x) => x !== 0)
        .reduce((acc, curr) => {
          if (!acc[curr]) {
            acc[curr] = 1;
          } else {
            acc[curr]++;
          }
          return acc;
        }, {});

      if (dataset.length === 2) {
        const seed = Math.floor(2 * (step / widthTimesTwo));
        const conjecture =
          seed ** 2 * groups[seed ** 2] +
          (seed ** 2 - seed) * groups[seed ** 2 - seed];
        if (conjecture !== good)
          throw new Error(
            `bad conjecture, ${step}, ${
              step % widthTimesTwo
            }, ${good}, ${conjecture}`,
          );
        if (seed > validationRounds && step % widthTimesTwo === neededModulo) {
          const neededSeed =
            neededModulo === width
              ? Math.floor(2 * (afterNeeded / widthTimesTwo)) - 1
              : Math.floor(2 * (afterNeeded / widthTimesTwo));
          const groupKeys = Object.keys(groups);
          console.log("PART2 ANSWER: ", groups[groupKeys[0]] * (neededSeed ** 2) + groups[groupKeys[1]] * (neededSeed ** 2 - neededSeed));
          return;
        }
      } else if (dataset.length === 3) {
        const seed =
          step % widthTimesTwo === width
            ? Math.floor(2 * (step / widthTimesTwo)) - 1
            : Math.floor(2 * (step / widthTimesTwo));
        const conjecture =
          seed ** 2 * groups[seed ** 2] +
          (seed ** 2 + seed) * groups[seed ** 2 + seed] +
          (seed ** 2 + seed + seed + 1) * groups[seed ** 2 + seed + seed + 1];
        if (conjecture !== good)
          throw new Error(
            `bad conjecture, ${step}, ${
              step % widthTimesTwo
            }, ${good}, ${conjecture}`,
          );
        if (seed > validationRounds && step % widthTimesTwo === neededModulo) {
          const neededSeed =
            neededModulo === width
              ? Math.floor(2 * (afterNeeded / widthTimesTwo)) - 1
              : Math.floor(2 * (afterNeeded / widthTimesTwo));
          const groupKeys = Object.keys(groups);
          console.log("PART2 ANSWER: ", groups[groupKeys[0]] * (neededSeed ** 2) + groups[groupKeys[1]] * (neededSeed ** 2 + neededSeed) + groups[groupKeys[2]] * (neededSeed ** 2 + neededSeed + neededSeed + 1))
          return;
        }
      } else {
        throw new Error("can't solve");
      }
      onestep = step;
    }

    const [currX, currY] = point.split(", ").map(Number);
    if (step % 2 === 1) {
      good++;
      const realX = mod(currX, width);
      const realY = mod(currY, height);
      map.set(`${realX}, ${realY}`, map.get(`${realX}, ${realY}`) + 1);
    }

    for (const [xChange, yChange] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nextX = currX + xChange;
      const nextY = currY + yChange;
      const nextPoint = `${nextX}, ${nextY}`;
      const realX = mod(nextX, width);
      const realY = mod(nextY, height);
      if (map.has(`${realX}, ${realY}`) && !toVisit.has(nextPoint)) {
        toVisit.set(nextPoint, step + 1);
      }
    }
  }
  console.log("GOOD: ", good);
}

getGardenPlotsIn26501365Steps()

console.timeEnd('Execution time')