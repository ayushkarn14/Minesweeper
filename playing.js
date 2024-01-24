let timer_running = false;
let revealedCells = 0;
let flags = 0;
let grid2 = Array.from({ length: numRows }, () => Array(numRows).fill(0));
let grid3 = Array.from({ length: numRows }, () => Array(numRows).fill(0));
for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numRows; j++) {
        grid3[i][j] = grid[i][j];
    }
}
console.log(grid3);
$(".parent div").on('contextmenu', function (e) {
    if (!timer_running) {
        starttimer();
        timer_running = true;
    }

    e.preventDefault();
    let index = $(this).index();
    let x = Math.floor(index / 16);
    let y = index % 16;

    if (grid2[x][y] != -3) {
        $(this).text("🚩");
        flags++;
        grid2[x][y] = -3;//-3 for flag
    }
    else {
        $(this).text("");
        flags--;
        grid2[x][y] = 0;
    }
    $("#flag").text(flags);
});

$('.parent div').click(function () {
    if (!timer_running) {
        starttimer();
        timer_running = true;
    }
    let index = $(this).index();
    // console.log(index);

    let x = Math.floor(index / 16);
    let y = index % 16;
    // console.log(x, y);

    if (grid2[x][y] != -3) {
        //check for bomb
        if (grid[x][y] == -1) {
            $('.parent div').eq(index).text("💣");
            setTimeout(() => {
                window.alert("Game Over");
                location.reload();
            }, 500);

        }
        //if bomb then game over

        //0 then reveal all adjacent 0s
        else if (grid[x][y] == 0) {
            revealZeros(x, y);
        }

        else if (grid[x][y] == -2) {
            console.log("already revealed")
        }
        //number then reveal just the cell
        else {
            $('.parent div').eq(index).text(grid[x][y]);
            grid[x][y] = -2;
            revealedCells++;
        }
    }
});


function revealZeros(x, y) {
    if (grid3[x][y] > 0) {
        return;
    }
    if (grid[x][y] == 0) {
        $(".parent div").eq(x * 16 + y).css({ "background-color": "#f0f0f0" });
        grid[x][y] = -2; // Mark the cell as revealed
        revealedCells++;
    }
    let directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];
    for (let direction of directions) {
        let newX = x + direction[0];
        let newY = y + direction[1];

        // Check if the new coordinates are valid
        if (newX >= 0 && newX < grid.length && newY >= 0 && newY < grid[0].length) {
            // If the cell contains 0, reveal it and check its neighbors
            if (grid[newX][newY] >= 0) {
                if (grid[newX][newY] == 0)
                    $(".parent div").eq(newX * 16 + newY).css({ "background-color": "#f0f0f0" })
                else
                    $('.parent div').eq(newX * 16 + newY).text(grid[newX][newY]);
                grid[newX][newY] = -2; // Mark the cell as revealed
                revealedCells++;
                revealZeros(newX, newY);
            }
        }
    }
}

function starttimer() {
    let t = "";
    let s = 0;
    let m = 0;
    let interval = setInterval(() => {
        t = "";
        s++;
        if (s == 60) {
            m++; s = 0;
        }
        t = " " + m + ":" + s;
        $("#time").text(t);
        if (revealedCells == 256 - 40) {
            // console.log(m + ":" + s);
            clearInterval(interval);
        }
        console.log("Revealed : " + revealedCells);
    }, 1000)
}
