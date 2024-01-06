console.time("Execution time");

const fs = require("fs");
const path = require("path");

const data = fs.readFileSync(
  path.resolve(__dirname, "../inputs/day13.txt"),
  "utf-8"
);

const input = data.trim().split("\n\n");

const maps = input.map((map) => map.split("\n"));

const range = (n) => [...Array(n).keys()];

function split(map, i) {
  return map.reduce((acc, line) => {
    if (acc === false || i >= line.length - 1) return acc;
    const p1 = line
      .slice(0, i + 1)
      .split("")
      .reverse()
      .join("");
    const p2 = line.slice(i + 1, i + p1.length + 1);
    return !!p1.startsWith(p2);
  }, true);
}

//PART1
const checkMatch = (map, skipRange) => {
  const mapRows = map.length;
  const mapCols = map[0].length;
  const ci = range(mapCols - 1).find(
    (x) => (!skipRange || skipRange !== x + 1) && split(map, x)
  );

  if (ci !== undefined) {
    return ci + 1;
  } else {
    const transposed = range(mapCols).map((r) =>
      range(mapRows)
        .map((c) => map[c][r])
        .join("")
    );
    const rowIndex = range(mapRows - 1).find(
      (i) => (!skipRange || skipRange / 100 !== i + 1) && split(transposed, i)
    );
    if (rowIndex !== undefined) {
      return (rowIndex + 1) * 100;
    } else {
      return 0;
    }
  }
};

function fixSmudgesLine(map) {
  const mapRows = map.length;
  const mapCols = map[0].length;

  const flip = (row, col) =>
    (map[row] =
      map[row].slice(0, col) +
      (map[row][col] == "." ? "#" : ".") +
      map[row].slice(col + 1));

  const initial = checkMatch(map);
  for (let i = 0; i < mapRows; i++) {
    for (j = 0; j < mapCols; j++) {
      flip(i, j);
      const second = checkMatch(map, initial);
      if (second) {
        return second;
      } else {
        flip(i, j);
      }
    }
  }
  return 0;
}

console.log(
  "TOTAL: ",
  maps.reduce((acc, map) => acc + checkMatch(map), 0)
);

//PART2
console.log(
  "ACTUAL TOTAL: ",
  maps.reduce((acc, map) => acc + fixSmudgesLine(map), 0)
);

console.timeEnd("Execution time");
