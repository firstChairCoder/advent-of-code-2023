const fs = require("fs");
const path = require("path");

//RUN FROM adventofcode.com
// let inputs = (
//   await (await fetch("https://adventofcode.com/2023/day/5/input")).text()
// )
//   .trim()
//   .split("\n\n");
const data = fs.readFileSync(
  path.resolve(__dirname, "../inputs/day5.txt"),
  "utf-8"
);

let inputs = data.trim().split("\n\n");

let seeds = inputs[0]
  .split(": ")[1]
  .split(" ")
  .map(function (str) {
    return Number(str);
  });
let c1 = inputs[1].split(":\n")[1].split("\n");
let c2 = inputs[2].split(":\n")[1].split("\n");
let c3 = inputs[3].split(":\n")[1].split("\n");
let c4 = inputs[4].split(":\n")[1].split("\n");
let c5 = inputs[5].split(":\n")[1].split("\n");
let c6 = inputs[6].split(":\n")[1].split("\n");
let c7 = inputs[7].split(":\n")[1].split("\n");

for (let i in c1) c1[i] = c1[i].split(" ");
for (let i in c2) c2[i] = c2[i].split(" ");
for (let i in c3) c3[i] = c3[i].split(" ");
for (let i in c4) c4[i] = c4[i].split(" ");
for (let i in c5) c5[i] = c5[i].split(" ");
for (let i in c6) c6[i] = c6[i].split(" ");
for (let i in c7) c7[i] = c7[i].split(" ");

//sort arrays descending based on source (index 1). convert to numbers
function order(c) {
  c.sort((a, b) => {
    return Number(b[1]) - Number(a[1]);
  });
  for (let i = 0; i < c.length; i++) {
    c[i][0] = Number(c[i][0]);
    c[i][1] = Number(c[i][1]);
    c[i][2] = Number(c[i][2]);

    //sometimes a map is missing the zero source value. This adds it
    if (i == c.length - 1 && c[i][1] != 0) {
      c.push([0, 0, c[i][1]]);
      break;
    }
  }
  return c;
}

//numbers are too big to build individual maps. Instead, we build a map of all sources and targets(ranges)
order(c1);
order(c2);
order(c3);
order(c4);
order(c5);
order(c6);
order(c7);

function process(s, c) {
  for (var i = 0; i < c.length; i++) {
    //since arrays are sorted in descending order, find the first item where s >= c[1];
    if (s >= c[i][1]) {
      let top_range = c[i][1] + c[i][2] - 1;
      //if source > top range, no modifier to destination, else modifier is the delta between source and destination
      let modifier = s > top_range ? 0 : c[i][0] - c[i][1];
      return s + modifier;
    }
  }
}

//PART1
let answer = Infinity;
seeds.forEach(function (seed) {
  let x = process(
    process(
      process(process(process(process(process(seed, c1), c2), c3), c4), c5),
      c6
    ),
    c7
  );
  return (answer = x < answer ? x : answer);
});

console.log("LOWEST LOCATION NUMBER: ", answer);

//PART2
const resultArray = [];

const seeders = data
  .trim()
  .split("\n\n")[0]
  .split(": ")[1]
  .split(" ")
  .map((x) => parseInt(x))
  .reduce((acc, curr, next) => {
    if (next % 2 == 0) acc.push([]);
    return acc[acc.length - 1].push(curr), acc;
  }, []);

const maps = data
  .trim()
  .split("\n\n")
  .slice(1)
  .map((x) =>
    x
      .split("\n")
      .slice(1)
      .map((y) => y.split(" ").map((z) => parseInt(z)))
  );

function expand(index, values) {
  if (index == maps.length) return [values];

  const result = [];
  for (const [destination, source, range] of maps[index]) {
    if (
      values[0] < source &&
      values[0] + values[1] > source &&
      values[0] + values[1] <= source + range
    ) {
      const firstTuple = [values[0], source - values[0]];
      const lastTuple = [destination, values[1] - source + values[0]];
      result.push(
        ...expand(index + 1, lastTuple),
        ...expand(index, firstTuple)
      );
      break;
    } else if (
      values[0] >= source &&
      values[0] < source + range &&
      values[0] + values[1] > source + range
    ) {
      const firstTuple = [
        destination + values[0] - source,
        source + range - values[0],
      ];
      const lastTuple = [
        source + range,
        values[0] - values[1] - source - range,
      ];
      result.push(
        ...expand(index + 1, firstTuple),
        ...expand(index, lastTuple)
      );
      break;
    } else if (values[0] >= source && values[0] + values[1] <= source + range) {
      result.push(
        ...expand(index + 1, [destination + values[0] - source, values[1]])
      );
      break;
    } else if (values[0] < source && values[0] + values[1] > source + range) {
      const firstTuple = [values[0], source - values[0]];
      const middleTuple = [destination, range];
      const lastTuple = [
        source + range,
        values[0] + values[1] - source - range,
      ];
      result.push(
        ...expand(index, lastTuple),
        ...expand(index + 1, middleTuple),
        ...expand(index, firstTuple)
      );
      break;
    }
  }

  if (result.length == 0) result.push(...expand(index + 1, values));
  return result;
}

for (const seeder of seeders) {
  resultArray.push(expand(0, seeder));
}

console.log("RESULT ARRAY: ", Math.min(...resultArray.flat().map((x) => x[0])));
