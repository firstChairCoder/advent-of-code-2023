const fs = require("fs");
const path = require("path");

const data = fs.readFileSync(path.resolve(__dirname, "../inputs/day1.txt"), "utf-8")

const input = data.trim().split("\n");

//PART 1
let result = 0;
for (const line of input) {
  const digits = line.replace(/\D/g, "");
  result += parseInt(digits[0] + (digits[digits.length - 1] ?? digits[0]));
}

console.log("RESULT: ", result);

//PART 2
let result2 = 0;
const nums = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
};
for (const line of input) {
  const numbers = [];
  for (const [key, value] of Object.entries(nums)) {
    numbers.push(
      ...line.matchAll(new RegExp(key, "g")),
      ...line.matchAll(new RegExp(value, "g")),
    );
  }
  numbers.sort((a, b) => a.index - b.index);

  result2 += parseInt(
    `${
      numbers[0][0].length > 1 ? nums[numbers[0][0]] : parseInt(numbers[0][0])
    }${
      numbers[numbers.length - 1][0].length > 1
        ? nums[numbers[numbers.length - 1][0]]
        : parseInt(numbers[numbers.length - 1][0])
    }`,
  );
}

console.log("RESULT: ", result2);