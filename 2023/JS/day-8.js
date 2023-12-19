const fs = require("fs");
const path = require("path");

const data = fs.readFileSync(
  path.resolve(__dirname, "../inputs/day8.txt"),
  "utf-8"
);

const lines = data.trim().split("\n");

const NODE_RE = /(\w+)\W+(\w+), (\w+)/;

function parseLines(lines) {
  const network = {};
  lines.splice(2).forEach((line) => {
    const matches = NODE_RE?.exec(line);
    network[matches[1]] = { L: matches[2], R: matches[3] };
  });
  return { moves: lines[0].split(""), network };
}

const { moves, network } = parseLines(lines);

// Ref: https://stackoverflow.com/questions/31302054/how-to-find-the-least-common-multiple-of-a-range-of-numbers
function gcd(a, b) {
  return !b ? a : gcd(b, a % b);
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

function lcmAll(arr) {
  return arr.reduce(lcm, 1);
}

function navigate(nodes, target, moves, network) {
  let steps = 0;
  const stepsToCycle = [];
  while (nodes.length > 0) {
    const m = moves[steps % moves.length];
    nodes?.forEach((node, i) => {
      nodes[i] = network[node][m];
    });
    steps += 1;
    //remove any nodes that have reached their destination
    const next = nodes.filter((n) => !n?.endsWith(target));
    if (next.length != nodes.length) {
      stepsToCycle.push(steps);
    }
    nodes = next;
  }
  //total number of steps is when all cycles sync up so each node is at the target, i.e LCM
  return lcmAll(stepsToCycle);
}

//PART1
function getRequiredSteps(moves, network) {
  const steps = navigate(["AAA"], "ZZZ", moves, network);
  console.log("Total number of steps: ", steps);
}

getRequiredSteps(moves, network);

//PART2
function getStepsToNodesZ(moves, network) {
  const starts = Object.keys(network).filter((n) => n.endsWith("A"));
  const answer = navigate(starts, "Z", moves, network);
  console.log("Steps to Z: ", answer);
}

getStepsToNodesZ(moves, network);
