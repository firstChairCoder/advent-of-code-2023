console.time("Execution time");

const fs = require("fs");
const path = require("path");

const data = fs.readFileSync(
  path.resolve(__dirname, "../inputs/day18.txt"),
  "utf-8"
);

let main = data;

const parseInput = (rawInput) => {
  return rawInput.split("\n").map((r) =>
    r
      .split(" (")[0]
      .split(" ")
      .map((e, i) => (i % 2 !== 0 ? parseInt(e) : e))
  );
};

const parseInput2 = (rawInput) => {
  return rawInput
    .split("\n")
    .map((r) => r.split("#")[1].substring(0, r.split("#")[1].length - 1));
};

function getPerimeter(rows) {
  let perimeter = 0;
  const len = rows.length;
  for (let i = 0; i < len; i++) {
    const [dir, num] = rows[i];
    if (dir === "R") {
      for (let c = 1; c <= num; c++) perimeter++;
    } else if (dir === "L") {
      for (let c = -1; c >= -num; c--) perimeter++;
    } else if (dir === "D") {
      for (let r = +1; r <= +num; r++) perimeter++;
    } else if (dir === "U") {
      for (let r = -1; r >= -num; r--) perimeter++;
    }
  }
  return perimeter;
}

function getPickInternalPoints(area, perimeter) {
  return area + 1 - perimeter / 2;
}

function getEdgesCoordinates(rows) {
  const cor = [{ i: 0, j: 0 }];
  const len = rows.length;
  for (let i = 0; i < len; i++) {
    const lastCor = cor[cor.length - 1];
    const [dir, num] = rows[i];
    if (lastCor.i === 0 && lastCor.j + num === 0) continue;
    if (dir === "R") cor.push({ i: lastCor.i, j: lastCor.j + num });
    if (dir === "L") cor.push({ i: lastCor.i, j: lastCor.j - num });
    if (dir === "D") cor.push({ i: lastCor.i + num, j: lastCor.j });
    if (dir === "U") cor.push({ i: lastCor.i - num, j: lastCor.j });
  }

  return cor;
}

function getShoelaceArea(edgesCoordinates) {
  const vlen = edgesCoordinates.length;
  // Shoelace formula
  let a = 0;
  for (let i = 0; i < vlen; i++) {
    let sup = i + 1 < vlen ? i + 1 : 0;
    a =
      a +
      edgesCoordinates[i].i * edgesCoordinates[sup].j -
      edgesCoordinates[i].j * edgesCoordinates[sup].i;
  }
  const Area = 0.5 * Math.abs(a);
  return Area;
}

//PART1
const part1 = (rawInput) => {
  const rows = parseInput(rawInput);

  const cor = getEdgesCoordinates(rows);
  const perimeter = getPerimeter(rows);

  // Shoelace formula
  const Area = getShoelaceArea(cor);

  // Pick's theorem
  const internalPoints = getPickInternalPoints(Area, perimeter);

  return internalPoints + perimeter;
};

console.log("PART1: ", part1(main));

//PART2
const part2 = (rawInput) => {
  const rows_pre = parseInput2(rawInput);
  const map = {
    0: "R",
    1: "D",
    2: "L",
    3: "U",
  };
  const rows = rows_pre.map((r) => {
    const dir = map[parseInt(r[r.length - 1])];
    const ex = r.substring(0, r.length - 1);
    const dig = parseInt(ex, 16);
    return [dir, dig];
  });

  const cor = getEdgesCoordinates(rows);
  const perimeter = getPerimeter(rows);

  // Shoelace formula
  const Area = getShoelaceArea(cor);

  // Pick's theorem
  const internalPoints = getPickInternalPoints(Area, perimeter);

  return internalPoints + perimeter;
};

console.log("PART2: ", part2(main) + " metric tonnes");

console.timeEnd("Execution time");
