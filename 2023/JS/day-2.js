const fs = require("fs");
const path = require("path");

const data = fs.readFileSync(
  path.resolve(__dirname, "../inputs/day2.txt"),
  "utf-8"
);

const input = data.trim().split("\n");

const RED_CUBES_TOTAL = 12;
const GREEN_CUBES_TOTAL = 13;
const BLUE_CUBES_TOTAL = 14;

//PART 1
const getPossibleGamesIdsSum = input.reduce((acc, line) => {
  //this returns a deep nested array filled with each result in the form [num, color]
  const roundMatches = line
    //remove all parts of each string line that comes before the whitespace follwing the colon
    .substring(line.indexOf(":") + 1)
    //split by the semi-colon, which separates each game into its compsite rounds
    .split(";")
    //this regex matching brings each round grouped in an array
    .map((row) => row.match(/\s(\d+\s[a-z]+)/g))
    //removes the whitespace at the beginning of each line and splits by the next whitespace.
    //this creates a game array created of composite rounds (also arrays) like so:
    /**
     * [
        [ [ '5', 'blue' ], [ '5', 'green' ] ],
        [ [ '7', 'blue' ], [ '15', 'green' ] ],
       ]
     */
    .map((arr) => arr.map((str) => str.trimStart().split(/\s/)));

  //create a game variable for each line which is an object that contains the following ppts:
  //id: gotten from the game number;
  //rounds: another object that contains as shown below. this can have multiple objects denoting the number of rounds for that game.:
  //cubes: the number of cubes per color;
  //color: the color of the set of cubes
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

  //the code block below uuses the isGamePossible to register all possible games.
  //it does this by checking if the cubes ppt for each round per color is within the given total of cubes per color.
  let isGamePossible = true;
  game.rounds.forEach((row) => {
    if (
      //if either condition returns true, the game is not possible
      row.some((x) => {
        if (x.color == "red") return x.cubes > RED_CUBES_TOTAL;
        else if (x.color == "green") return x.cubes > GREEN_CUBES_TOTAL;
        else return x.cubes > BLUE_CUBES_TOTAL;
      })
    ) {
      isGamePossible = false;
    }
  });
  //add the ids of all pssiible games
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
  //this object is used to track the highest number of each color per game
  let fewestCubes = {
    red: 0,
    green: 0,
    blue: 0,
  };

  //for each round of a game, check the number of cubes for each color.
  //as it goes through each line(i.e. game), if it gets a higher number than recorded in the fewestObject property for that color, the fewestObject value for that color becomes that value
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
  //this reducer function first gets the product of the numbers of red, green and blue for each game
  //then adds them up..
  return arr.reduce(
    (sum, set) =>
      sum + Object.values(set).reduce((product, next) => product * next),
    0
  );
}

console.log("POWER SUM: ", getPowerSum(possibleGames));
