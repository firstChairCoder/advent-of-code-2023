const fs = require("fs");
const path = require("path");

const data = fs.readFileSync(
  path.resolve(__dirname, "../inputs/day3.txt"),
  "utf-8"
);

const lines = data.trim().split("\n");

const numbers = [];
const symbols = [];
const gears = [];

for (const [i, line] of lines.entries()) {
  //Extract the positions of all symbols (i.e characters that are not digits and not the dot)
  Array.from(line.matchAll(/[^0-9|.]/g)).forEach((match) => {
    symbols.push({
      line: i,
      index: match?.index,
    });
  });

  //Extract the positions (start and end) and values of all numbers
  Array.from(line.matchAll(/[0-9]+/g)).forEach((match) => {
    numbers.push({
      line: i,
      start: match?.index,
      end: match?.index + match[0].length - 1,
      number: parseInt(match[0]),
    });
  });

  // FOR PART 2
  Array.from(line.matchAll(/\*/g)).forEach((match) => {
    gears.push({
      line: i,
      index: match?.index,
    });
  });
}

function isNearby(num, sym) {
  return (
    sym.line <= num.line + 1 &&
    sym.line >= num.line - 1 &&
    sym.index >= num.start - 1 &&
    sym.index <= num.end + 1
  );
}

//PART 1
const validNumbers = numbers?.filter((num) =>
  symbols.some((sym) => isNearby(num, sym))
);

console.log(
  "PART NUMBERS SUM: ",
  validNumbers?.reduce((acc, num) => num.number + acc, 0)
);

//PART 2
const validGears = gears
  ?.map((gear) => {
    const matchingNumbers = numbers.filter((num) => isNearby(num, gear));
    return {
      isValid: matchingNumbers.length === 2,
      gearRatio: matchingNumbers.reduce(
        (acc, num) => (acc === 0 ? num.number : acc * num.number),
        0
      ),
    };
  })
  .filter((gear) => gear.isValid);

console.log(
  "GEAR RATIOS SUM: ",
  validGears?.reduce((acc, gear) => gear.gearRatio + acc, 0)
);
