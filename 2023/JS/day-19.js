console.time("Execution time");

const fs = require("fs");
const path = require("path");

const data = fs.readFileSync(
  path.resolve(__dirname, "../inputs/day19.txt"),
  "utf-8"
);

//PART1
let [lines1, lines2] = data.split(/\r?\n\r?\n/).map((el) => el.split(/\r?\n/));

function addAllLegitRatings() {
  let db = {};
  lines1.map(
    (el) => (
      (x = el.split("{")),
      (db[x[0]] = x[1]
        .slice(0, -1)
        .replaceAll(/([a-zA-Z]+)(?![<>])/g, "'$&'")
        .replaceAll(/(\w)[<>]/g, "dd.$&")
        .replaceAll(":", "?")
        .replaceAll(",", ":"))
    )
  );
  let mainData = [];
  lines2.map((el, i) => {
    mainData[i] = {};
    el.slice(1, -1)
      .split(",")
      .map((str) => {
        let x = str.split("=");
        mainData[i][x[0]] = +x[1];
      });
  });

  return mainData
    .map((dd) => {
      let box = eval(db.in);
      while (box != "A" && box != "R") {
        box = eval(db[box]);
      }
      return box == "A" ? Object.values(dd).reduce((a, b) => a + b) : 0;
    })
    .reduce((a, b) => a + b);
}

console.log("PART1 ANSWER: ", addAllLegitRatings());

//PART2
function getDistinctCombos() {
  let db = {};
  lines1.map((line) => ((x = line.split("{")), (db[x[0]] = x[1].slice(0, -1))));
  let possibles = [];

  function tweak(pool, cond, rev = false) {
    const clonedPool = JSON.parse(JSON.stringify(pool));
    let int = clonedPool[cond[0]];
    if (!int) return;
    if (rev) {
      if (cond[1] == ">") {
        int[1] = Math.min(int[1], +cond.slice(2));
      }
      if (cond[1] == "<") {
        int[0] = Math.max(int[0], +cond.slice(2));
      }
    } else {
      if (cond[1] == ">") {
        int[0] = Math.max(int[0], +cond.slice(2) + 1);
      }
      if (cond[1] == "<") {
        int[1] = Math.min(int[1], +cond.slice(2) - 1);
      }
    }
    if (int[0] > int[1]) int = null;
    clonedPool[cond[0]] = int;
    return clonedPool;
  }

  function getConditions(
    cond,
    pool = { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] }
  ) {
    if (!pool) return;

    if (!cond.includes(",")) {
      if (cond[0] == "A")
        return possibles.push(JSON.parse(JSON.stringify(pool)));
      if (cond[0] == "R") {
        return;
      }
      getConditions(db[cond], pool);
    } else {
      const colonIndex = cond.indexOf(":");
      let [beforeColon, afterColon] = [
        cond.slice(0, colonIndex),
        cond.slice(colonIndex + 1),
      ];
      const commaIndex = afterColon.indexOf(",");
      let [beforeComma, afterComma] = [
        afterColon.slice(0, commaIndex),
        afterColon.slice(commaIndex + 1),
      ];
      getConditions(beforeComma, tweak(pool, beforeColon));
      getConditions(afterComma, tweak(pool, beforeColon, true));
    }
  }

  getConditions(db.in);

  return possibles
    .map(
      (po) =>
        (po.x[1] - po.x[0] + 1) *
        (po.m[1] - po.m[0] + 1) *
        (po.a[1] - po.a[0] + 1) *
        (po.s[1] - po.s[0] + 1)
    )
    .reduce((a, b) => a + b);
}

console.log("PART2 ANSWER: ", getDistinctCombos());

console.timeEnd("Execution time");
