console.time("Execution time");

const fs = require("fs");
const path = require("path");

const data = fs.readFileSync(
  path.resolve(__dirname, "../inputs/day14.txt"),
  "utf-8"
);

const input = data
  .trim()
  .split(/\r?\n/)
  .map((line) => line.split(""));

let lines = input;

//PART1
function getTotalLoad(arr) {
  arr.map((line, i) => {
    line.map((char, j) => {
      let north = i - 1;
      if (char === "O") {
        while (north >= 0 && arr[north][j] === ".") {
          north--;
        }
        north++;
        if (i !== north) {
          arr[i][j] = ".";
          arr[north][j] = "O";
        }
      }
    });
  });
  let total = 0;
  arr.map((line, i) => {
    line.map((char) => {
      if (char === "O") {
        total += arr.length - i;
      }
    });
  });
  return total;
}

console.log("TOTAL LOAD: ", getTotalLoad(input));

//PART2
const insider = (nx, ny) =>
  ny >= 0 && ny < lines.length && nx >= 0 && nx < lines[0].length;

//using N: 0; W: 1; S: 2; E: 3
function roll(dir = 0) {
  const dx = [0, -1, 0, 1][dir];
  const dy = [-1, 0, 1, 0][dir];

  for (
    let y = dir > 1 ? lines.length - 1 : 0;
    dir > 1 ? y >= 0 : y < lines.length;
    y += dir > 1 ? -1 : 1
  ) {
    for (
      let x = dir > 1 ? lines[y].length - 1 : 0;
      dir > 1 ? x >= 0 : x < lines[y].length;
      x += dir > 1 ? -1 : 1
    ) {
      if (lines[y][x] === "O") {
        let [nx, ny] = [x + dx, y + dy];
        while (insider(nx, ny) && lines[ny][nx] == ".") {
          nx += dx;
          ny += dy;
        }
        nx -= dx;
        ny -= dy;
        if (nx !== x || ny !== y) {
          lines[ny][nx] = "O";
          lines[y][x] = ".";
        }
      }
    }
  }
  return lines;
}

const cycle = () => [0, 1, 2, 3].map((dir) => (lines = roll(dir)));

function load(lines) {
  let total = 0;
  lines.map((line, i) => {
    line.map((char) => {
      if (char === "O") total += input.length - i;
    });
  });
  return total;
}

//deep copy lines array
let memo = [JSON.stringify(input)];
cycle();
while (memo.indexOf(JSON.stringify(input)) === -1) {
  memo.push(JSON.stringify(input));
  cycle();
}

const hitIndex = memo.indexOf(JSON.stringify(input));
const fold = (begin, end, target) =>
  ((target - hitIndex) % (end - begin)) + hitIndex;

lines = JSON.parse(memo[fold(hitIndex, memo.length, 1000000000)]);
console.log("TOTAL LOAD AFTER 1BN CYCLES: ", load(lines));

console.timeEnd("Execution time");
