const fs = require('node:fs');
let answer = 0;
try {
    const input = fs.readFileSync('../inputs/day16.txt', 'utf8').trim();
	console.log('INPUT TEST: ', input)
    const grid = input.split("\r\n").map((row) => row.split(""));
	console.log('GRID TEST: ', grid[0].length)
    let shift = [];
    shift[0]   = [-1, 0];
    shift[90]  = [ 0, 1];
    shift[180] = [ 1, 0];
    shift[270] = [ 0,-1];
    let nodes = new Map();
    let output = [...Array(grid.length)].map(_=>Array(grid[0].length).fill("."));  
    let queue = [{col:0,row:0,dir:90}];
    while(queue.length > 0) {
        let check = queue.pop();
        let row = check.row;
        let col = check.col;
        let dir = check.dir;
        let key = `${row}/${col}/${dir}`;
        if(nodes.has(key)) {
            //do nothing, already have this
            //console.log('Hit mapping',check);
            continue;
        }
        nodes.set(key, 1);
        if(row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) {
            //out of bounds, end;
            console.log('Out of bounds', check);
			// continue
        }
        else {
            let cell = grid[row][col];
            let newdirs = [];
            output[row][col] = '#';
            if(cell == "|" && (dir == 90 || dir == 270)) {
                newdirs = [0,180];
            }
            else if(cell == "-" && (dir == 0 || dir == 180)) {
                newdirs = [90,270];
            }
            else if(cell == "/") {
                switch(dir) {
                    case 0: newdirs = [90]; break;
                    case 90: newdirs = [0]; break;
                    case 180: newdirs = [270]; break;
                    case 270: newdirs = [180]; break;
                }
            }
            else if(cell == "\\") {
                switch(dir) {
                    case 0: newdirs = [270]; break;
                    case 90: newdirs = [180]; break;
                    case 180: newdirs = [90]; break;
                    case 270: newdirs = [0]; break;
                }
            }
            else { //if(cell == ".") {
                newdirs = [dir];
                //pass through in same direction
            }
            newdirs.forEach((newdir) => queue.push({col:col+shift[newdir][1],row:row+shift[newdir][0],dir:newdir}));

        }
    }
    let temp = output.map((row) => row.join("")).join("\n");
    // console.log(temp);
    answer = output.flat().filter((x) => x == '#').length;

}
catch(e) {
    console.error(e);
}

console.log("The answer is:", answer);