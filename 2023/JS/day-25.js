console.time("Execution time");

const fs = require("fs");
const path = require("path");

const data = fs.readFileSync(
  path.resolve(__dirname, "../inputs/day25.txt"),
  "utf-8"
);

// First round of parsing just strips punctuation and makes string values indexable
const input = data
  .trim()
  .split("\n")
  .map((link) => {
    link = link.split(": ");
    link[1] = link[1].split(" ");
    return link;
  });

// Second round of parsing actually restructures input into a format we can use
let network = [];
let nodeList = [];
for (let link of input) {
  let [source, targets] = link;
  for (let target of targets) {
    let line = [source, target];
    line.sort();
    network.push(line);
    for (let node of line) {
      nodeList.includes(node) || nodeList.push(node);
    }
  }
}

// Helper function to generate pairs of non-identical node names for path sampling
let randomNode = () => nodeList[Math.floor(nodeList.length * Math.random())];
let randomNodePair = () => {
  let nodes = [0, 0];
  while (nodes[0] === nodes[1]) {
    nodes = [randomNode(), randomNode()];
  }
  return nodes;
};

// Simple Dijkstra implementation that will allow us to sample paths between random nodes
// Returns a string with format "nodeNameBegin>nodeName1>nodeName2>...>nodeNameEnd" if path exists
// Returns size of space sampled
let shortestRoute = (start, end) => {
  let visited = { [start]: start };
  let toVisit = [start];

  while (toVisit.length) {
    let curr = toVisit.shift();
    let adjacents = network
      .filter((link) => link.includes(curr))
      .map((edge) => edge.filter((node) => node !== curr)[0]);
    adjacents.sort(() => Math.random() - 0.5);
    for (let adjacent of adjacents) {
      if (visited[adjacent]) continue;
      if (adjacent === end) {
        return visited[curr] + " > " + adjacent;
      }
      toVisit.push(adjacent);
      visited[adjacent] = visited[curr] + ">" + adjacent;
    }
  }
  let count = 0;
  for (let _ in visited) {
    count++;
  }
  return count;
};

// Master loop wherein the actual algorithm occurs
// In here we...
//		1) Sample some optimal paths via Dijkstra
//		2) Construct a histogram of for edge usage across this sampling of paths
//		3) Select and eliminate the most frequently used edge
//		4) Perform a final Dijkstra run to attempt to connect nodes from recently severed edge
//		5) If path found, graph not cut, must repeat. Else, we have our cut.
for (let i = 0; true; i++) {
  let histo = {};
  for (let run = 0; run < 5; run++) {
    let route = shortestRoute(...randomNodePair()).split(">");

    while (route.length > 1) {
      let edgeKey = route.splice(0, 2, route[1]);
      edgeKey.sort();
      edgeKey = edgeKey.toString();
      histo[edgeKey] ||= 0;
      histo[edgeKey]++;
    }
  }
  let maxEdge;
  let max = 0;
  for (let edge in histo) {
    let count = histo[edge];
    if (count > max) {
      max = count;
      maxEdge = edge;
    }
  }
  network.splice(
    network.findIndex((link) => link.toString() === maxEdge),
    1
  );

  let route = shortestRoute(...maxEdge.split(","));
  if (typeof route != "string") {
    console.log("ANSWER: ", route * (nodeList.length - route));
	console.timeEnd("Execution time");
    return route * (nodeList.length - route);
  }
}