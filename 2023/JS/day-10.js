console.time("Execution time");

const fs = require("fs");
const path = require("path");

const data = fs.readFileSync(
  path.resolve(__dirname, "../inputs/day10.txt"),
  "utf-8"
);

const mainData = [];
let height = 0;
let width = 0;
let homeRow = 0;
let homeCol = 0;
/////////////////////////
const mainData2 = [];
let height2 = 0;
let width2 = 0;
let homeRow2 = 0;
let homeCol2 = 0;
let allInsiders = 0;
let recentInsiders = [];

function processInput() {
  const input = data.trim();
  const lines = input.split("\n");
  for (const line of lines) {
    mainData.push(line.trim());
    mainData2.push(line.trim().split(""));
  }
  height = mainData.length;
  height2 = mainData2.length;
  width = mainData[0].length;
  width2 = mainData2[0].length;
}

function createPoint(row, col) {
  return { row: row, col: col };
}

// PART1
function findHome() {
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      if (mainData[row][col] == "S") {
        homeRow = row;
        homeCol = col;
        return;
      }
    }
  }
}

function checkNeighbor(row, col, chars) {
  if (row < 0) return false;
  if (col < 0) return false;

  if (row > height - 1) return false;
  if (col > width - 1) return false;

  return chars.includes(mainData[row][col]);
}

function getHomeSymbol() {
  const isNorthOk = checkNeighbor(homeRow - 1, homeCol, "|7F");
  const isSouthOk = checkNeighbor(homeRow + 1, homeCol, "|JL");
  const isEastOk = checkNeighbor(homeRow, homeCol + 1, "-7J");
  const isWestOk = checkNeighbor(homeRow, homeCol - 1, "-FL");

  if (isNorthOk && isSouthOk) return "|";
  if (isNorthOk && isEastOk) return "L";
  if (isNorthOk && isWestOk) return "J";
  if (isEastOk && isSouthOk) return "F";
  if (isWestOk && isSouthOk) return "7";
  if (isWestOk && isEastOk) return "-";
  console.log("Error: No home symbol found");
}

function search() {
  const distanceMap = [];
  for (let i = 0; i < height; i++) {
    const line = new Int32Array(width).fill(-1);
    distanceMap.push(line);
  }

  let distance = -1;
  let futureNodes = [createPoint(homeRow, homeCol)];

  while (true) {
    if (futureNodes.length == 0) return distance;
    const currentNodes = futureNodes;

    distance += 1;

    futureNodes = [];

    for (const node of currentNodes) {
      const row = node.row;
      const col = node.col;

      distanceMap[row][col] = distance;

      const symbol = mainData[row][col];

      if (symbol == ".") continue;
      if (symbol == "-") {
        addNode(row, col, "west");
        addNode(row, col, "east");
        continue;
      }
      if (symbol == "|") {
        addNode(row, col, "north");
        addNode(row, col, "south");
        continue;
      }
      if (symbol == "L") {
        addNode(row, col, "north");
        addNode(row, col, "east");
        continue;
      }
      if (symbol == "J") {
        addNode(row, col, "north");
        addNode(row, col, "west");
        continue;
      }
      if (symbol == "F") {
        addNode(row, col, "south");
        addNode(row, col, "east");
        continue;
      }
      if (symbol == "7") {
        addNode(row, col, "west");
        addNode(row, col, "south");
        continue;
      }

      console.log(
        "Error: Unknown symbol: ",
        symbol,
        " at row ",
        row,
        " & column ",
        col
      );
    }
  }

  function addNode(row, col, dir) {
    if (dir == "north") row -= 1;
    if (dir == "south") row += 1;
    if (dir == "east") col += 1;
    if (dir == "west") col -= 1;

    if (
      row < 0 ||
      col < 0 ||
      row > height - 1 ||
      col > width - 1 ||
      distanceMap[row][col] != -1
    )
      return;

    //reserved val
    distanceMap[row][col] = -2;

    futureNodes.push(createPoint(row, col));
  }
}

function main() {
  processInput();
  findHome();

  const homeSymbol = getHomeSymbol();
  mainData[homeRow] = mainData[homeRow].replace("S", homeSymbol);

  console.log("TOTAL NO. OF STEPS: ", search());
}

main();

//PART2
function findHome2() {
  for (let row = 0; row < height2; row++) {
    for (let col = 0; col < width2; col++) {
      if (mainData2[row][col] == "S") {
        homeRow2 = row;
        homeCol2 = col;
        return;
      }
    }
  }
}

function checkNeighbor2(row, col, chars) {
  if (row < 0 || col < 0 || row > height2 - 1 || col > width2 - 1) {
    return false;
  }
  return chars.includes(mainData2[row][col]);
}

function getHomeSymbol2() {
  const isNorthOk = checkNeighbor2(homeRow2 - 1, homeCol2, "|7F");
  const isSouthOk = checkNeighbor2(homeRow2 + 1, homeCol2, "|JL");
  const isEastOk = checkNeighbor2(homeRow2, homeCol2 + 1, "-7J");
  const isWestOk = checkNeighbor2(homeRow2, homeCol2 - 1, "-FL");

  if (isNorthOk && isSouthOk) return "|";
  if (isNorthOk && isEastOk) return "L";
  if (isNorthOk && isWestOk) return "J";
  if (isEastOk && isSouthOk) return "F";
  if (isWestOk && isSouthOk) return "7";
  if (isWestOk && isEastOk) return "-";
  console.log("Error: No home symbol found");
}

function createTrackNode(row, col, oldDir) {
  return { row: row, col: col, oldDir: oldDir, newDir: "" };
}

function findNextDirection(curr, next) {
  if (next.row < curr.row) return "north";
  if (next.row > curr.row) return "south";
  if (next.col < curr.col) return "west";
  if (next.col > curr.col) return "east";
}

function fixTrackDirections(track) {
  const first = track[0];
  const last = track.at(-1);
  first.oldDir = findNextDirection(last, first);
  for (let n = 1; n < track.length; n++) {
    track[n - 1].newDir = track[n].oldDir;
  }
  last.newDir = first.oldDir;
}

function walkPipesMonoDirection() {
  //walking in a single direction demands only one node in future nodes
  const track = [];
  let futureNodes = [createTrackNode(homeRow2, homeCol2, "unknown")];
  while (true) {
    if (futureNodes.length == 0) {
      fixTrackDirections(track);
      return track;
    }

    const currentNodes = futureNodes;
    futureNodes = [];
    for (const node of currentNodes) {
      track.push(node);
      const row = node.row;
      const col = node.col;
      const symbol = mainData2[row][col];
      mainData2[row][col] = "@";

      if (symbol == "L") {
        addNode(row, col, "north");
        addNode(row, col, "east");
        continue;
      }
      if (symbol == "|") {
        addNode(row, col, "north");
        addNode(row, col, "south");
        continue;
      }
      if (symbol == "J") {
        addNode(row, col, "north");
        addNode(row, col, "west");
        continue;
      }
      if (symbol == "F") {
        addNode(row, col, "south");
        addNode(row, col, "east");
        continue;
      }
      if (symbol == "-") {
        addNode(row, col, "west");
        addNode(row, col, "east");
        continue;
      }
      if (symbol == "7") {
        addNode(row, col, "south");
        addNode(row, col, "west");
        continue;
      }
      console.log(
        "Error: Unknown symbol: ",
        symbol,
        " at row ",
        row,
        " & column ",
        col
      );
    }
  }

  function addNode(row, col, dir) {
    if (dir == "north") row -= 1;
    if (dir == "south") row += 1;
    if (dir == "east") col += 1;
    if (dir == "west") col -= 1;

    if (
      row < 0 ||
      col < 0 ||
      row > height2 - 1 ||
      col > width2 - 1 ||
      futureNodes.length != 0
    ) {
      return;
    }

    const symbol = mainData2[row][col];

    if (symbol == "." || symbol == "@") return;
    futureNodes.push(createTrackNode(row, col, dir));
  }
}

function walkBorder(row, col) {
  if (mainData2[row][col] == "@" || mainData2[row][col] == "#") {
    return;
  }

  let futureNodes = [createPoint(row, col)];
  while (true) {
    if (futureNodes.length == 0) return;

    const currentNodes = futureNodes;
    futureNodes = [];

    for (const node of currentNodes) {
      const row = node.row;
      const col = node.col;

      mainData2[row][col] = "#";

      addBorderNode(row - 1, col);
      addBorderNode(row + 1, col);
      addBorderNode(row, col - 1);
      addBorderNode(row, col + 1);
    }
  }

  function addBorderNode(row, col) {
    if (
      row < 0 ||
      col < 0 ||
      row > height2 - 1 ||
      col > width2 - 1 ||
      mainData2[row][col] == "@" ||
      mainData2[row][col] == "#"
    ) {
      return;
    }

    //reserved val
    mainData2[row][col] = "#";
    futureNodes.push(createPoint(row, col));
  }
}

function walkAlongBorders() {
  for (let row = 0; row < height2; row++) {
    walkBorder(row, 0);
    walkBorder(row, width2 - 1);
  }

  for (let col = 0; col < width2; col++) {
    walkBorder(0, col);
    walkBorder(height2 - 1, col);
  }
}

function markInsider(row, col) {
  if (
    row < 0 ||
    col < 0 ||
    row > height2 - 1 ||
    col > width2 - 1 ||
    mainData2[row][col] == "@" ||
    mainData2[row][col] == "#" ||
    mainData2[row][col] == "*"
  ) {
    return;
  }

  allInsiders += 1;
  recentInsiders.push(createPoint(row, col));
  mainData2[row][col] = "*";
}

function getRelativeOutsiders(track) {
  for (const node of track) {
    if (node.direction == "north") {
      if (mainData2[node.row][node.col - 1] == "#") return "left";
      if (mainData2[node.row][node.col + 1] == "#") return "right";
      continue;
    }

    if (node.direction == "south") {
      if (mainData2[node.row][node.col + 1] == "#") return "left";
      if (mainData2[node.row][node.col - 1] == "#") return "right";
      continue;
    }

    if (node.direction == "west") {
      if (node.row + 1 < height2) {
        if (mainData2[node.row + 1][node.col] == "#") return "left";
      }
      if (node.row > 0) {
        if (mainData2[node.row - 1][node.col] == "#") return "right";
      }
      continue;
    }

    if (node.direction == "east") {
      if (node.row + 1 < height2) {
        if (mainData2[node.row + 1][node.col] == "#") return "right";
      }
      if (node.row > 0) {
        if (mainData2[node.row - 1][node.col] == "#") return "left";
      }
      continue;
    }
  }
}

function expandInsiders() {
  while (true) {
    if (recentInsiders.length == 0) return;
    const insidersToDo = recentInsiders;

    recentInsiders = [];
    for (const node of insidersToDo) {
      markInsider(node.row - 1, node.col);
      markInsider(node.row + 1, node.col);
      markInsider(node.row, node.col - 1);
      markInsider(node.row, node.col + 1);
    }
  }
}

function markSingleInsiderRight(dir, row, col) {
  if (dir == "north") {
    markInsider(row, col + 1);
    return;
  }
  if (dir == "south") {
    markInsider(row, col - 1);
    return;
  }
  if (dir == "west") {
    markInsider(row - 1, col);
    return;
  }
  if (dir == "east") {
    markInsider(row + 1, col);
    return;
  }
}

function markAllRightInsiders(track) {
  for (const node of track) {
    markSingleInsiderRight(node.oldDir, node.row, node.col);
    markSingleInsiderRight(node.newDir, node.row, node.col);
  }
}

function markSingleInsiderLeft(dir, row, col) {
  if (dir == "north") {
    markInsider(row, col - 1);
    return;
  }
  if (dir == "south") {
    markInsider(row, col + 1);
    return;
  }
  if (dir == "west") {
    markInsider(row + 1, col);
    return;
  }
  if (dir == "east") {
    markInsider(row - 1, col);
    return;
  }
}

function markAllLeftInsiders(track) {
  for (const node of track) {
    markSingleInsiderLeft(node.oldDir, node.row, node.col);
    markSingleInsiderLeft(node.newDir, node.row, node.col);
  }
}

function main2() {
  processInput();
  findHome2();

  mainData2[homeRow2][homeCol2] = getHomeSymbol2();

  const track = walkPipesMonoDirection();

  walkAlongBorders();

  if (getRelativeOutsiders(track) == "left") {
    markAllRightInsiders(track);
  } else {
    markAllLeftInsiders(track);
  }

  expandInsiders();

  console.log("TILES ENCLOSED BY LOOP: ", allInsiders);
}

main2();

console.timeEnd("Execution time");
