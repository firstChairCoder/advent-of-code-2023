const fs = require("fs");
const path = require("path");

const data = fs.readFileSync(
  path.resolve(__dirname, "../inputs/day7.txt"),
  "utf-8"
);

const inputs = data.trim().split("\n");
const strengths = [
  "A",
  "K",
  "Q",
  "J",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
];
const strengthsWithJokerRule = [
  "A",
  "K",
  "Q",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
  "J",
];

const camelCards = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] };
const camelCardsJoker = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] };

//PART1
for (let i = 0; i < inputs.length; i++) {
  const hand = inputs[i].split(" ")[0];
  const tallies = hand.split("").reduce((acc, curr, index, arr) => {
    acc[curr] ? acc[curr]++ : (acc[curr] = 1);
    return index == arr.length - 1 ? Object.values(acc) : acc;
  }, {});

  switch (tallies.length) {
    case 5:
      camelCards[7].push(inputs[i]);
      break;
    case 4:
      camelCards[6].push(inputs[i]);
      break;
    case 3:
      tallies.find((x) => x == 3)
        ? camelCards[4].push(inputs[i])
        : camelCards[5].push(inputs[i]);
      break;
    case 2:
      tallies.find((x) => x == 4)
        ? camelCards[2].push(inputs[i])
        : camelCards[3].push(inputs[i]);
      break;
    default:
      camelCards[1].push(inputs[i]);
      break;
  }
}

let sum = [];

for (const card in camelCards) {
  const order = camelCards[card].sort((a, b) => {
    const currentCard = a.split(" ");
    const nextCard = b.split(" ");
    for (let i = 0; i < currentCard[0].length; i++) {
      const currIndex = strengths.findIndex((x) => x == currentCard[0][i]);
      const nextIndex = strengths.findIndex((x) => x == nextCard[0][i]);
      if (currIndex < nextIndex) return -1;
      if (currIndex > nextIndex) return 1;
      continue;
    }
  });
  sum = [...sum, ...order];
}

console.log(
  "ANSWER: ",
  sum
    .reverse()
    .reduce((acc, curr, index) => (acc += curr.split(" ")[1] * (index + 1)), 0)
);

//PART2
for (let i = 0; i < inputs.length; i++) {
  const hand = inputs[i].split(" ")[0];
  let numberOfJokers = 0;
  const tallies = hand.split("").reduce((acc, curr, index, arr) => {
    curr == "J" ? numberOfJokers++ : acc[curr] ? acc[curr]++ : (acc[curr] = 1);

    if (index == arr.length - 1) {
      acc = Object.values(acc);
      if (numberOfJokers) {
        acc.sort().reverse();
        acc[0] += numberOfJokers;
      }
    }

    return acc;
  }, {});

  switch (tallies.length) {
    case 5:
      camelCardsJoker[7].push(inputs[i]);
      break;
    case 4:
      camelCardsJoker[6].push(inputs[i]);
      break;
    case 3:
      tallies.find((x) => x == 3)
        ? camelCardsJoker[4].push(inputs[i])
        : camelCardsJoker[5].push(inputs[i]);
      break;
    case 2:
      tallies.find((x) => x == 4)
        ? camelCardsJoker[2].push(inputs[i])
        : camelCardsJoker[3].push(inputs[i]);
      break;
    default:
      camelCardsJoker[1].push(inputs[i]);
      break;
  }
}

let sum2 = [];

for (const card in camelCardsJoker) {
  const order = camelCardsJoker[card].sort((a, b) => {
    const currentCard = a.split(" ");
    const nextCard = b.split(" ");
    for (let i = 0; i < currentCard[0].length; i++) {
      const currIndex = strengthsWithJokerRule.findIndex(
        (x) => x == currentCard[0][i]
      );
      const nextIndex = strengthsWithJokerRule.findIndex(
        (x) => x == nextCard[0][i]
      );
      if (currIndex < nextIndex) return -1;
      if (currIndex > nextIndex) return 1;
      continue;
    }
  });
  sum2 = [...sum2, ...order];
}

console.log(
  "JOKER ANSWER: ",
  sum2
    .reverse()
    .reduce((acc, curr, index) => (acc += curr.split(" ")[1] * (index + 1)), 0)
);
