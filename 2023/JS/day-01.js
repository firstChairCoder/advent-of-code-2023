const fs = require("fs");
const path = require("path");

const data = fs.readFileSync(path.resolve(__dirname, "../inputs/day1.txt"), "utf-8")

const input = data.trim().split("\n");

//PART 1
let result = 0;
for (const line of input) {
  //remove all non digit characters in the input line
  const digits = line.replace(/\D/g, "");
  //add the first character to the last character per digit or to itself, in cases where the digit has just one character
  //convert to number
  //add each number to get our final result
  result += parseInt(digits[0] + (digits[digits.length - 1] ?? digits[0]));
}

console.log("RESULT: ", result);

//PART 2
let result2 = 0;
//create an object with keys = digits in words and the values = actual digits
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
};
for (const line of input) {
  const numbers = [];

  for (const [key, value] of Object.entries(nums)) {
    //this allows us get matches for `three` and `3` for instance when looping through our input.
    //returns something like this for each line of input:
    /**
     * [
          [ 'two', index: 9, input: 'nkxmdshm5twoseven672', groups: undefined ],
          [ '6', index: 14, input: '88788jnscmpqr66sxcjx', groups: undefined ],
          [ '7', index: 2, input: '88788jnscmpqr66sxcjx', groups: undefined ],
        ]
     */
    numbers.push(
      ...line.matchAll(new RegExp(key, "g")),
      ...line.matchAll(new RegExp(value, "g")),
    );
  }
  //this arranges the returned `numbers` based on their position in the string.
  //this allows for the manipulation when adding as shown below.
  numbers.sort((a, b) => a.index - b.index);

  //for numbers as words, the length would be greater than 1. In such a case, we use the respective value based on the nums object.
  //for regular numbers, the length would be 1, and they're simply cnnverted to integers
  //this is done for the first and last `digit` in each line of input
  //add each number to get our final result.
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

console.log("RESULT 2: ", result2);