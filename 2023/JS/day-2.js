const fs = require("fs");
const path = require("path");

const data = fs.readFileSync(
  path.resolve(__dirname, "../inputs/day2.txt"),
  "utf-8"
);

const input = data.trim().split("\n");

const RED_CUBES_TARGET = 12;
const GREEN_CUBES_TARGET = 13;
const BLUE_CUBES_TARGET = 14;

//PART 1
const getPossibleGamesIdsSum = input.reduce((acc, line) => {
  const roundMatches = line
    .substring(line.indexOf(":") + 1, line.length)
    .split(";")
    .map((row) => row.match(/\s(\d+\s[a-z]+)/g))
    .map((arr) => arr.map((str) => str.trimStart().split(/\s/)));

  const game = {
    id: parseInt(line.match(/^Game\s(\d+):\s/)[1]),
    rounds: roundMatches.map((row) =>
      row.map((x) => {
        return {
          cubes: parseInt(x[0]),
          color: x[1],
        };
      })
    ),
  };

  let isGamePossible = true;
  game.rounds.forEach((row) => {
    if (
      row.some((x) => {
        if (x.color == "red") return x.cubes > RED_CUBES_TARGET;
        else if (x.color == "green") return x.cubes > GREEN_CUBES_TARGET;
        else return x.cubes > BLUE_CUBES_TARGET;
      })
    ) {
      isGamePossible = false;
    }
  });
  if (isGamePossible) {
    return acc + game.id;
  } else {
    return acc;
  }
}, 0);

console.log("SUM: ", getPossibleGamesIdsSum);

//PART 2
const possibleGames = input.reduce((possibleGame, line) => {
  const roundMatches = line
    .substring(line.indexOf(":") + 1, line.length)
    .split(";")
    .map((row) => row.match(/\s(\d+\s[a-z]+)/g))
    .map((arr) => arr.map((str) => str.trimStart().split(/\s/)));

  const game = {
    id: parseInt(line.match(/^Game\s(\d+):\s/)[1]),
    rounds: roundMatches.map((row) =>
      row.map((x) => {
        return {
          cubes: parseInt(x[0]),
          color: x[1],
        };
      })
    ),
  };
  let fewestCubes = {
    red: 0,
    green: 0,
    blue: 0,
  };

  game.rounds.forEach((row) => {
    row.forEach((x) => {
      if (x.color == "red") {
        if (x.cubes > fewestCubes.red) fewestCubes.red = x.cubes;
      } else if (x.color == "green") {
        if (x.cubes > fewestCubes.green) fewestCubes.green = x.cubes;
      } else {
        if (x.cubes > fewestCubes.blue) fewestCubes.blue = x.cubes;
      }
    });
  });

  possibleGame.push(fewestCubes);

  return possibleGame;
}, []);

function getPowerSum(arr) {
  return arr.reduce(
    (sum, set) =>
      sum + Object.values(set).reduce((product, next) => product * next),
    0
  );
}

console.log("POWER SUM: ", getPowerSum(possibleGames));
