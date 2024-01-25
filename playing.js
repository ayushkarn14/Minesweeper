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
// console.log(grid3);
$(".parent div").on('contextmenu', function (e) {
    if (!timer_running) {
        starttimer();
        timer_running = true;
    }

    e.preventDefault();
    let index = $(this).index();
    let x = Math.floor(index / 16);
    let y = index % 16;
    if (grid[x][y] != -2 && flags < numBombs) {

        if (grid2[x][y] != -3) {
            if (navigator.vibrate)
                navigator.vibrate(5);
            $(this).text("🚩");
            flags++;
            grid2[x][y] = -3;//-3 for flag
        }
        else {
            if (navigator.vibrate)
                navigator.vibrate(5);
            $(this).text("");
            flags--;
            grid2[x][y] = 0;
        }
        $("#flag").text(flags);
    }
});

$('.parent div').click(function () {
    if (!timer_running) {
        starttimer();
        timer_running = true;
    }
    let index = $(this).index();

    let x = Math.floor(index / 16);
    let y = index % 16;

    if (grid2[x][y] != -3) {
        if (grid[x][y] == -1) {
            $('.parent div').eq(index).text("💣");
            setTimeout(() => {
                window.alert("Game Over");
                location.reload();
            }, 500);

        }
        else if (grid[x][y] == 0) {
            revealZeros(x, y);
        }

        else if (grid[x][y] == -2) {
            // console.log("already revealed")
        }
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
        grid[x][y] = -2;
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


        if (newX >= 0 && newX < grid.length && newY >= 0 && newY < grid[0].length) {

            if (grid[newX][newY] >= 0) {
                if (grid[newX][newY] == 0)
                    $(".parent div").eq(newX * 16 + newY).css({ "background-color": "#f0f0f0" })
                else
                    $('.parent div').eq(newX * 16 + newY).text(grid[newX][newY]);
                grid[newX][newY] = -2;
                revealedCells++;
                revealZeros(newX, newY);
            }
        }
    }
}

let s = 0;
let m = 0;
function starttimer() {
    m = 0, s = 0;
    let t = "";
    let interval = setInterval(() => {
        t = "";
        s++;
        if (s == 60) {
            m++; s = 0;
        }
        t = " " + m + ":" + s;
        $("#time").text(t);
        if (revealedCells == 256 - numBombs) {
            // console.log(m + ":" + s);
            let str = $('td:last').text();
            let min = str.split(" ")[0].substr(0, str.split(" ")[0].length - 1);
            let sec = str.split(" ")[1].substr(0, str.split(" ")[1].length - 1);
            if (min * 60 + sec > m * 60 + s) {
                highscore();
            }
            else {
                window.alert("Completed in " + m + " mins " + s + " seconds. Congratulations!");
            }
            clearInterval(interval);
        }
        // console.log("Revealed : " + revealedCells);
    }, 1000)
}


function highscore() {
    let person = "";
    let first = $("td").eq(2).text()
    let min = first.split(" ")[0].substr(0, first.split(" ")[0].length - 1);
    let sec = first.split(" ")[1].substr(0, first.split(" ")[1].length - 1);
    if (min * 60 + sec > m * 60 + s)
        person = prompt("New Highscore 🎉🎉!! Enter name : ", "name");
    else
        person = prompt("New Top 10 🎉🎉!! Enter name : ", "name");
    // console.log(person);
    $.ajax({
        url: 'https://ddwm3wj8-3000.inc1.devtunnels.ms/data', // replace with your server URL
        type: 'POST',
        data: {
            name: person,
            time: m * 60 + s,
        },
        success: function (response) {
            // console.log(response);
            location.reload();
        },
        error: function (error) {
            // console.error(error);
        }
    });
}