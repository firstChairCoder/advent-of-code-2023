console.time("Execution time");

const fs = require("fs");
const path = require("path");

const data = fs.readFileSync(
  path.resolve(__dirname, "../inputs/day20.txt"),
  "utf-8"
);

//parser
const LOW_PULSE = "low";
const HIGH_PULSE = "high";

const parse = (input) => {
  const lines = data.split("\n");
  const modules = {};
  const inputMap = {};
  const rxInputs = [];
  for (let line of lines) {
    const parts = line.split("->");
    const label =
      parts[0].trim() == "broadcaster"
        ? "broadcaster"
        : parts[0].trim().substring(1);
    const type = parts[0].trim().charAt(0);
    const dest = parts[1].trim().split(", ");
    if (dest.includes("rx")) {
      rxInputs.push(label);
    }
    for (const d of dest) {
      if (!inputMap[d]) {
        inputMap[d] = [];
      }
      inputMap[d].push(label);
    }
    modules[label] = {
      label: label,
      type: type,
      dest: dest,
    };
    if (type == "%") {
      modules[label].on = false;
    }
  }
  for (const label of Object.keys(inputMap)) {
    const module = modules[label];
    if (module?.type == "&") {
      module.inputs = inputMap[label].reduce((input, label) => {
        input[label] = LOW_PULSE;
        return input;
      }, {});
    }
  }
  return {
    modules: modules,
    rxInputs: rxInputs,
  };
};

const modulate = (module, pulse) => {
  switch (module.type) {
    case "b": {
      return pulse.value;
    }
    case "%": {
      if (pulse.value == HIGH_PULSE) {
        return null;
      }
      module.on = !module.on;
      return module.on ? HIGH_PULSE : LOW_PULSE;
    }
    case "&": {
      module.inputs[pulse.from] = pulse.value;
      for (const p of Object.values(module.inputs)) {
        if (p == LOW_PULSE) {
          return HIGH_PULSE;
        }
      }
      return LOW_PULSE;
    }
  }
  if (module.label == "broadcaster") {
    return pulse;
  }
};

//PART1
function getPulsesProduct(input) {
  const modules = parse(input).modules;
  const cycles = 1000;
  const counters = {
    low: 0,
    high: 0,
  };
  for (let i = 0; i < cycles; i++) {
    const pulses = [
      {
        from: "button",
        to: "broadcaster",
        value: LOW_PULSE,
      },
    ];
    while (pulses.length > 0) {
      const pulse = pulses.shift(); //FIFO
      counters[pulse.value]++;
      const module = modules[pulse.to];
      if (!module) continue;
      const newPulse = modulate(module, pulse);
      if (!newPulse) continue;
      for (const dest of module.dest) {
        pulses.push({
          from: module.label,
          to: dest,
          value: newPulse,
        });
      }
    }
  }
  return counters.low * counters.high;
}

console.log("PART1 ANSWER: ", getPulsesProduct(data));

//PART2
function getFewestCycles(input) {
  const data = parse(input);
  const modules = data.modules;
  const cycles = {};
  for (const input of data.rxInputs) {
    cycles[input] = {};
    for (const module of Object.values(modules)) {
      if (module.dest.includes(input)) {
        cycles[input][module.label] = 1; //fixes of-by-one
      }
    }
  }
  const numCycles = Object.values(cycles).reduce(
    (sum, e) => sum + Object.keys(e).length,
    0
  );
  let cyclesCounter = 0;
  for (let c = 0; cyclesCounter < numCycles; c++) {
    const pulses = [
      {
        from: "button",
        to: "broadcaster",
        value: LOW_PULSE,
      },
    ];
    while (pulses.length > 0) {
      const pulse = pulses.shift(); //FIFO
      for (const input of data.rxInputs) {
        if (
          pulse.to == input &&
          cycles[input][pulse.from] &&
          pulse.value == HIGH_PULSE
        ) {
          if (cycles[input][pulse.from] == 1) {
            cycles[input][pulse.from] += c;
            cyclesCounter++;
            if (cyclesCounter == numCycles) {
              break;
            }
          }
        }
      }

      const module = modules[pulse.to];
      if (!module) continue;
      const newPulse = modulate(module, pulse);
      if (!newPulse) continue;
      for (const dest of module.dest) {
        pulses.push({
          from: module.label,
          to: dest,
          value: newPulse,
        });
      }
    }
  }
  return Math.min(
    ...Object.values(cycles).map((e) =>
      Object.values(e).reduce((product, e) => product * e, 1)
    )
  );
}

console.log("PART2 ANSWER: ", getFewestCycles(data));

console.timeEnd("Execution time");
