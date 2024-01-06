//NOTE: The .toReversed() method may give errors depending on what version of Node you are running.
//It is advisable to use ~v20 to run this code.
console.time("Execution time");

const fs = require("fs");
const path = require("path");

const data = fs.readFileSync(
  path.resolve(__dirname, "../inputs/day12.txt"),
  "utf-8"
);

const springTypes = [".", "#", "?"];
function buildInputRow(arr) {
  const springs = arr[0]
    .replace(/^\.+|\.+$/g, "") //removes dots at start and end
    .replace(/\.{2,}/g, ".") //removes consecutive dots
    .split("")
    .filter((char) => springTypes.includes(char));

  const records = arr[1].split(",").map(Number);
  let dotCounter = 0;

  const dotDistances = springs
    .toReversed()
    .map((state) => (dotCounter = state === "." ? 0 : dotCounter + 1))
    .toReversed();
  const lastHashIndex = springs.lastIndexOf("#");
  return { springs, records, dotDistances, lastHashIndex };
}

const input = data
  .trim()
  .split(/\r?\n/)
  .filter(Boolean)
  .map((line) => line.split(" "))
  .map(buildInputRow);

const extendedInput = data
  .trim()
  .split(/\r?\n/)
  .filter(Boolean)
  .map((line) => line.split(" "))
  .map((x) => [
    `${x[0]}?`.repeat(5).slice(0, -1),
    `${x[1]},`.repeat(5).slice(0, -1),
  ])
  .map(buildInputRow);

class Cache {
  results = new Map();
  get(springsIndex, recordsIndex) {
    return this.results.get((springsIndex << 16) | recordsIndex);
  }
  set(springsIndex, recordsIndex, value) {
    this.results.set((springsIndex << 16) | recordsIndex, value);
  }
}

function arrangements(row, springsIndex, recordsIndex, minLength, cache) {
  const cached = cache.get(springsIndex, recordsIndex);
  if (cached !== undefined) return cached;
  if (recordsIndex >= row.records.length) {
    if (springsIndex <= row.lastHashIndex) {
      return 0;
    }
    return 1;
  }
  if (springsIndex >= row.springs.length) {
    return 0;
  }
  const record = row.records[recordsIndex];
  const canPlaceSpring =
    record <= row.dotDistances[springsIndex] &&
    row.springs[springsIndex + record] !== "#";
  const placeSpring = canPlaceSpring
    ? arrangements(
        row,
        springsIndex + record + 1,
        recordsIndex + 1,
        minLength - record,
        cache
      )
    : 0;
  const moveOn =
    row.springs[springsIndex] !== "#"
      ? arrangements(row, springsIndex + 1, recordsIndex, minLength, cache)
      : 0;
  const numArrangements = placeSpring + moveOn;
  cache.set(springsIndex, recordsIndex, numArrangements);

  return numArrangements;
}

//PART1
console.log(
  "ARRANGEMENTS SUM: ",
  input
    .map((row, i) =>
      arrangements(
        row,
        0,
        0,
        row.records.reduce((acc, curr) => acc + curr, 0),
        new Cache()
      )
    )
    .reduce((sum, curr) => sum + curr, 0)
);

console.log(
  "ACTUAL ARRANGEMENTS SUM: ",
  extendedInput
    .map((row, i) =>
      arrangements(
        row,
        0,
        0,
        row.records.reduce((acc, curr) => acc + curr, 0),
        new Cache()
      )
    )
    .reduce((sum, curr) => sum + curr, 0)
);

console.timeEnd("Execution time");
