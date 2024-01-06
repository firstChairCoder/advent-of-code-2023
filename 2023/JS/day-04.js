const fs = require("fs");
const path = require("path");

const data = fs.readFileSync(
  path.resolve(__dirname, "../inputs/day4.txt"),
  "utf-8"
);

const input = data.trim().split("\n");

const cards = input.map((line) => {
  const match = line.match(
    /^Card\s+(?<cardNumber>\d+):\s+(?<winningNums>.+)\|(?<cardNums>.+)$/
  );
  const { cardNumber, winningNums, cardNums } = match?.groups ?? {};
  const parseNumsStr = (str) => str.trim().split(" ").filter(Boolean);

  return {
    cardNumber,
    winningNumbers: parseNumsStr(winningNums),
    cardNumbers: parseNumsStr(cardNums),
  };
});

function checkHits(arr) {
  return arr.cardNumbers.reduce(
    (acc, cardNum) => (arr.winningNumbers.includes(cardNum) ? acc + 1 : acc),
    0
  );
}

//PART1
function getTotalPoints(cards) {
  return cards.reduce((acc, card) => {
    const cardWorth =
      checkHits(card) === 0 ? 0 : Math.pow(2, checkHits(card) - 1);
    return acc + cardWorth;
  }, 0);
}
console.log("TOTAL: ", getTotalPoints(cards));

//PART2
function getTotalScratchcards(cards) {
  const instances = cards.reduce((acc, card) => {
    acc[card.cardNumber] = 1;
    return acc;
  }, {});

  for (let i = 0; i < cards.length; i++) {
    for (let j = 1; j <= checkHits(cards[i]) && i + j < cards.length; j++) {
      const nextCard = cards[i + j];
      instances[nextCard.cardNumber] =
        (instances[nextCard.cardNumber] ?? 0) + instances[cards[i].cardNumber];
    }
  }

  return Object.values(instances).reduce((sum, next) => sum + next, 0);
}
console.log("TOTAL: ", getTotalScratchcards(cards));
