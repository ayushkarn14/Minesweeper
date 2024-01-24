//making squares
for (let i = 0; i < 16 * 16; i++)
    $(".parent").append("<div class=child></div>");


const numRows = 16;
const numBombs = 40;

const grid = Array.from({ length: numRows }, () => Array(numRows).fill(0));

// Randomly place 40 -1s in the grid
let count = 0;
while (count < numBombs) {
    const row = Math.floor(Math.random() * numRows);
    const col = Math.floor(Math.random() * numRows);
    if (grid[row][col] === 0) {
        grid[row][col] = -1;
        count++;
    }
}

//giving cell numbers
for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numRows; j++) {
        if (grid[i][j] == -1) {
            if (i - 1 >= 0 && j - 1 >= 0 && grid[i - 1][j - 1] != -1)
                grid[i - 1][j - 1]++;
            if (i - 1 >= 0 && grid[i - 1][j] != -1)
                grid[i - 1][j]++;
            if (i - 1 >= 0 && j + 1 < numRows && grid[i - 1][j + 1] != -1)
                grid[i - 1][j + 1]++;
            if (j - 1 >= 0 && grid[i][j - 1] != -1)
                grid[i][j - 1]++;
            if (j + 1 < numRows && grid[i][j + 1] != -1)
                grid[i][j + 1]++;
            if (i + 1 < numRows && j - 1 >= 0 && grid[i + 1][j - 1] != -1)
                grid[i + 1][j - 1]++;
            if (i + 1 < numRows && grid[i + 1][j] != -1)
                grid[i + 1][j]++;
            if (i + 1 < numRows && j + 1 < numRows && grid[i + 1][j + 1] != -1)
                grid[i + 1][j + 1]++;
        }
    }
}
console.log(grid);