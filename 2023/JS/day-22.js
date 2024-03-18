console.time("Execution time");

const fs = require("fs");
const path = require("path");

const data = fs.readFileSync(
  path.resolve(__dirname, "../inputs/day22.txt"),
  "utf-8"
);

const range = (n) => [...Array(n).keys()];

//parser
const parse = (data) => {
  const dims = ["x", "y", "z"];
  const bricks = [];

  const max = { x: 0, y: 0, z: 0 };

  data.split("\n").forEach((line, i) => {
    const [v1, v2] = line
      .split("~")
      .map((v) =>
        Object.fromEntries(v.split(",").map((v, d) => [dims[d], Number(v)]))
      );
    const brick = {
      i: i + 1,
      v1,
      v2,
      vs: Object.fromEntries(dims.map((d) => [d, 1 + v2[d] - v1[d]])),
      below: [],
      above: [],
    };
    bricks.push(brick);
    dims.forEach((d) => {
      if (brick.v2[d] > max[d]) {
        max[d] = brick.v2[d];
      }
    });
  });

  // pile of bricks, z levels of x * y
  const pile = [];
  range(max.z + 1).forEach(() =>
    pile.push(range(max.x + 1).map(() => range(max.y + 1).map(() => 0)))
  );

  return { bricks, pile };
};

//PART1
const fall = ({ bricks, pile }) => {
  // sort bricks by bottom z
  [...bricks]
    .sort((b1, b2) => b1.v1.z - b2.v1.z)
    .forEach((brick, si) => {
      brick.si = si;
      for (let z = brick.v1.z - 1; z >= 1; z--) {
        for (let x = brick.v1.x; x <= brick.v2.x; x++) {
          for (let y = brick.v1.y; y <= brick.v2.y; y++) {
            const s = pile[z][x][y];
            if (s) {
              if (!brick.below.includes(s)) {
                brick.below.push(s);
              }
              if (!bricks[s - 1].above.includes(brick.i)) {
                bricks[s - 1].above.push(brick.i);
              }
            }
          }
        }
        if (!brick.below.length) {
          // fall
          brick.v1.z--;
          brick.v2.z--;
        } else {
          break; // stay
        }
      }
      // put brick in pile
      for (let x = brick.v1.x; x <= brick.v2.x; x++) {
        for (let y = brick.v1.y; y <= brick.v2.y; y++) {
          for (let z = brick.v1.z; z <= brick.v2.z; z++) {
            pile[z][x][y] = brick.i;
          }
        }
      }
    });
};

const { bricks, pile } = parse(data);

fall({ bricks, pile });

const isOkay = (brick) =>
  !brick.above.length ||
  brick.above.every((a) => bricks[a - 1].below.length > 1);

console.log("P1:", bricks.filter(isOkay).length);

//PART2
const falls = (brick) => {
  const queue = [brick.i];
  const fallen = { [brick.i]: true };

  while (queue.length) {
    const i = queue.shift();
    fallen[i] = true;
    queue.push(
      ...bricks[i - 1].above.filter((b) =>
        bricks[b - 1].below.every((b) => fallen[b])
      )
    );
  }
  return Object.keys(fallen).length - 1;
};

console.log(
  "P2:",
  bricks.reduce((t, brick) => t + falls(brick), 0)
);

console.timeEnd("Execution time");
