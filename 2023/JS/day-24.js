console.time("Execution time");

const fs = require("fs");
const path = require("path");

const data = fs.readFileSync(
  path.resolve(__dirname, "../inputs/day24.txt"),
  "utf-8"
);

//PART1
let day24a = function (input) {
  let lines = input
    .split("\n")
    .map((line) => line.trim())
    .filter((l) => l.length > 0);
  let parseTriple = function (trip) {
    return trip.split(",").map((x) => +x.trim());
  };
  let parseLine = function (line) {
    let args = line.split("@");
    return [parseTriple(args[0]), parseTriple(args[1])];
  };
  let parsed = lines.map(parseLine);

  let minRange = 200000000000000;
  let maxRange = 400000000000000;
  let pathCrossInRangeQ = function (h1, h2) {
    let x1 = h1[0][0];
    let y1 = h1[0][1];
    let x2 = h2[0][0];
    let y2 = h2[0][1];
    let x1v = h1[1][0];
    let y1v = h1[1][1];
    let x2v = h2[1][0];
    let y2v = h2[1][1];

    let t1num = x2v * y1 - x2v * y2 - x1 * y2v + x2 * y2v;
    let t2num = x1v * y1 - x1 * y1v + x2 * y1v - x1v * y2;
    let det = x1v * y2v - x2v * y1v;
    if (det > 0 && (t1num <= 0 || t2num <= 0)) return false;
    if (det < 0 && (t1num >= 0 || t2num >= 0)) return false;
    if (det == 0) return false;
    let xnum = -(x1 * x2v * y1v) + x1v * x2v * (y1 - y2) + x1v * x2 * y2v;
    let ynum = -(x2v * y1v * y2) + x1v * y1 * y2v + (-x1 + x2) * y1v * y2v;
    if (det < 0) {
      det = -det;
      xnum = -xnum;
      ynum = -ynum;
    }
    return (
      minRange * det <= xnum &&
      xnum <= maxRange * det &&
      minRange * det <= ynum &&
      ynum <= maxRange * det
    );
  };

  let ct = 0;
  for (let n = 1; n < parsed.length; n++) {
    for (let m = 0; m < n; m++) {
      if (pathCrossInRangeQ(parsed[m], parsed[n])) ct++;
    }
  }
  console.log("PART1 ANSWER: ", ct);
};

day24a(data);

//PART2
let day24bNoExternal = function (input) {
  let lines = input
    .split("\n")
    .map((line) => line.trim())
    .filter((l) => l.length > 0);
  let parseTriple = function (trip) {
    return trip.split(",").map((x) => +x.trim());
  };
  let parseLine = function (line) {
    let args = line.split("@");
    return [parseTriple(args[0]), parseTriple(args[1])];
  };
  let parsed = lines.map(parseLine);

  //particle at solution sx,sy,sz, velocity svx,svy,svz
  //equations are:
  //sx+svx*t[i]==x[i]+vx[i]*t[i] ...same for y,z.
  //sy+svy*t[i]==y[i]+vy[i]*t[i]
  //sz+svz*t[i]==z[i]+vz[i]*t[i]
  //Ok, let's assume svx,svy,svz are fixed and linear solve on that...

  //sx+(svx-vx[0])*t[0]==x[0]
  //sy+(svy-vy[0])*t[0]==y[0]
  //sz+(svz-vz[0])*t[0]==z[0]
  //
  //sx+(svx-vx[1])*t[1]==x[1]
  //sy+(svy-vy[1])*t[1]==y[1]
  //Matrix looks like:
  //[1 0 0 svx-vx[0]     0    ][ sx ]   [x[0]]
  //[0 1 0 svy-vy[0]     0    ][ sy ]   [y[0]]
  //[0 0 1 svz-vz[0]     0    ][ sz ] = [z[0]]
  //[1 0 0    0      svx-vx[1]][t[0]]   [x[1]]
  //[0 1 0    0      svy-vy[1]][t[1]]   [y[1]]
  // the matrix has determinant (svx-vx[1])*(svy-vy[0])-(svx-vx[0])*(svy-vy[1])
  // mvx1 mvy0 - mvx0 mvy1
  let linearSolve = function (n, m, svx, svy, svz) {
    let x0 = parsed[n][0][0];
    let y0 = parsed[n][0][1];
    let z0 = parsed[n][0][2];
    let x1 = parsed[m][0][0];
    let y1 = parsed[m][0][1];
    let mvx0 = svx - parsed[n][1][0];
    let mvy0 = svy - parsed[n][1][1];
    let mvz0 = svz - parsed[n][1][2];
    let mvx1 = svx - parsed[m][1][0];
    let mvy1 = svy - parsed[m][1][1];
    let det = mvx1 * mvy0 - mvx0 * mvy1;
    if (det != 0) {
      return [
        (mvx1 * mvy0 * x0 - mvx0 * mvy1 * x1 + mvx0 * mvx1 * (-y0 + y1)) / det,
        (mvy0 * mvy1 * (x0 - x1) - mvx0 * mvy1 * y0 + mvx1 * mvy0 * y1) / det,
        (mvy1 * mvz0 * (x0 - x1) + mvx1 * mvz0 * (-y0 + y1)) / det + z0,
        (mvy1 * (-x0 + x1) + mvx1 * (y0 - y1)) / det,
        (mvy0 * (-x0 + x1) + mvx0 * (y0 - y1)) / det,
      ];
    }
    return undefined;
  };
  //error function
  let ef = function (svx, svy, svz) {
    let nums1 = linearSolve(0, 1, svx, svy, svz);
    let nums2 = linearSolve(2, 1, svx, svy, svz);
    if (!nums1 || !nums2) return undefined;
    let dsx = nums1[0] - nums2[0];
    let dsy = nums1[1] - nums2[1];
    let dsz = nums1[2] - nums2[2];
    let dt = nums1[4] - nums2[4];
    return dsx + dsy + dsz + dt;
  };
  let xm = 0,
    ym = 0,
    zm = 0;
  let minFound = undefined;
  //Let's search in progressively larger shells around the origin.
  //This is just boring ctrl-c ctrl-v code for the six faces of a cube.
  //x,y,z are the velocities of the line, I guess I should have named them svx,svy,svz.
  for (let r = 1; r < 400; r++) {
    for (let x = -r; x < r + 1; x++) {
      for (let y = -r; y < r + 1; y++) {
        for (let z = -r; z < r + 1; z += 2 * r) {
          let e = ef(x, y, z);
          if (!isNaN(e)) {
            if (minFound == undefined) {
              xm = x;
              ym = y;
              zm = z;
              minFound = Math.abs(e);
            } else if (Math.abs(e) < minFound) {
              xm = x;
              ym = y;
              zm = z;
              minFound = Math.abs(e);
            }
          }
        }
      }
    }
    for (let x = -r; x < r + 1; x++) {
      for (let y = -r; y < r + 1; y += 2 * r) {
        for (let z = -r; z < r + 1; z += 1) {
          let e = ef(x, y, z);
          if (!isNaN(e)) {
            if (minFound == undefined) {
              xm = x;
              ym = y;
              zm = z;
              minFound = Math.abs(e);
            } else if (Math.abs(e) < minFound) {
              xm = x;
              ym = y;
              zm = z;
              minFound = Math.abs(e);
            }
          }
        }
      }
    }
    for (let x = -r; x < r + 1; x += 2 * r) {
      for (let y = -r; y < r + 1; y++) {
        for (let z = -r; z < r + 1; z++) {
          let e = ef(x, y, z);
          if (!isNaN(e)) {
            if (minFound == undefined) {
              xm = x;
              ym = y;
              zm = z;
              minFound = Math.abs(e);
            } else if (Math.abs(e) < minFound) {
              xm = x;
              ym = y;
              zm = z;
              minFound = Math.abs(e);
            }
          }
        }
      }
    }
    if (minFound < 1) break;
  }
  let nums1 = linearSolve(0, 1, xm, ym, zm);
  console.log("PART2 Solution found is: ", nums1[0] + nums1[1] + nums1[2]);
};
day24bNoExternal(data);

console.timeEnd("Execution time");
