console.time("Execution time");

const fs = require("fs");
const path = require("path");

const data = fs.readFileSync(
  path.resolve(__dirname, "../inputs/day15.txt"),
  "utf-8"
);

const input = data.split(",");
const lines = input;

//PART1
console.log(
  "ANSWER: ",
  input.reduce(
    (acc, line) =>
      acc +
      line
        .split("")
        .reduce((sum, curr) => ((sum + curr.charCodeAt()) * 17) % 256, 0),
    0
  )
);

//PART2
function generateHash(label) {
  return label.split("").reduce((acc, char) => {
    acc += char.charCodeAt(0);
    acc *= 17;
    return acc % 256;
  }, 0);
}

function sortToBoxes(data) {
  const boxes = Array(256);

  data.forEach((datum) => {
    const [_, label, sign, focalLength] = datum.match(/^([^=-]*)(=|-)(\d*)$/);
    const box = (boxes[generateHash(label)] ??= new Map());
    if (sign === "-") {
      return box.delete(label);
    }
    box.set(label, focalLength);
  });
  return boxes;
}

console.log(
  "SUM = %d ",
  sortToBoxes(lines).reduce((total, box, boxIndex) => {
    if (!box) return total;
    Array.from(box.entries()).forEach(([_, focalLength], lensIndex) => {
      total += (1 + boxIndex) * (1 + lensIndex) * focalLength;
    });
    return total;
  }, 0)
);

console.timeEnd("Execution time");
