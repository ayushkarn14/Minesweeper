const http = require('http');
const fs = require('fs');
const qs = require('querystring');
const mysql = require('mysql');

// const conn = mysql.createConnection({
//     host: 'sql6.freemysqlhosting.net',
//     user: 'sql6679731',
//     password: 'UN7U8nwptb',
//     database: 'sql6679731',
//     port: '3306'
// });

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'sql6.freemysqlhosting.net',
    user: 'sql6679731',
    password: 'UN7U8nwptb',
    database: 'sql6679731',
});

// const conn = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'minesweeper'
// });

// conn.connect((err) => {
//     if (err) {
//         console.error('Error connecting to MySQL:', err);
//         return;
//     }
//     console.log('Connected to MySQL database');
// });

pool.getConnection(function (err, conn) {
    if (err) throw err; // not connected!

    function makeTable(resp) {
        let t = '<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Minesweeper</title> <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous"> <style> @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@800&display=swap"); * { margin: 0; padding: 0; } .parent { width: 70vw; height: 70vw; max-height: 80vh; max-width: 80vh; display: block; margin: auto; -ms-user-select: none; -webkit-user-select: none; user-select: none; } .child { border-radius: 5%; margin: 0.28%; width: 5.69%; height: 5.69%; display: inline-block; text-align: center; font-size: min(2.8vw, 3.2vh); font-family: "Poppins", sans-serif; vertical-align: top; padding: 0; background-color: rgb(218, 218, 218); border: none; } .child:hover { cursor: pointer; background-color: rgb(207, 207, 207); } h1 { text-align: center; font-family: "Poppins", sans-serif; font-size: 50px; } h2 { margin-top: 50px; position: relative; left: calc(45vw); font-family: "Poppins", sans-serif; font-size: 30px; width: fit-content; } #time_h { margin-top: 10px; } #highscore { width: 50vw; display: block; margin: auto; margin-top: 20px; } @media screen and (max-width: 550px){#highscore {width: 80vw;}.parent{width: 95vw;height:95vw}h1{font-size:25px} h2{font-size:15px} .child{font-size:3.6vw}} </style></head><body> <h1>Minesweeper</h1> <div class="parent"></div> <h2 id="flag_h">🚩 <span id="flag">0</span>/30</h2> <h2 id="time_h">Time:<span id="time"></span></h2> <div id="highscore"> <table class="table"> <thead> <tr> <th scope="col">#</th> <th scope="col">Name</th> <th scope="col">Time</th> </tr> </thead> <tbody>';

        for (let i = 0; i < Math.min(resp.length, 10); i++) {
            t += '<tr>';
            t += "<td>" + (i + 1) + "</td>";
            t += "<td>" + resp[i].name + "</td>";
            t += "<td>" + Math.floor(resp[i].time / 60) + "m " + resp[i].time % 60 + "s</td>";
            t += '</tr>';
        }
        t += '</tbody> </table> </div> <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script> <script src="jquery-3.7.1.min.js"></script> <script src="index.js"></script> <script src="playing.js"></script></body></html>';
        return t;
        // return "<h1>New link : <a href='https://puce-busy-lovebird.cyclic.app/'>https://puce-busy-lovebird.cyclic.app/</a></h1><br><h2>This url will be scrapped so store the new link somewhere</h2>";
    }

    const server = http.createServer((req, res) => {

        if (req.url == "/index.js") {
            fs.readFile('index.js', (err, data) => {
                if (err) {
                    res.statusCode = 500;
                    res.end('Internal Server Error');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/javascript' });
                    res.write(data);

                    res.end();
                }
            });
        }
        else if (req.url == '/jquery-3.7.1.min.js') {
            fs.readFile('jquery-3.7.1.min.js', (err, data) => {
                if (err) {
                    res.statusCode = 500;

                    res.end('Internal Server Error');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/javascript' });
                    res.write(data);

                    res.end();
                }
            });
        }
        else if (req.url == '/playing.js') {
            fs.readFile('playing.js', (err, data) => {
                if (err) {
                    res.statusCode = 500;

                    res.end('Internal Server Error');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/javascript' });
                    res.write(data);

                    res.end();
                }
            });
        }
        else if (req.url == "/") {
            res.statusCode = 200;
            conn.query("SELECT name,time from highscore order by time;", (err, resp) => {
                if (err) {
                    console.log(err);
                    console.log("Error in SQL");
                }
                else {
                    res.setHeader('Content-Type', 'text/html');
                    res.write(makeTable(resp));
                }

                res.end();
                // fs.readFile('index.html', (err, data) => {
                //     if (err) {
                //         res.statusCode = 500;
                //         res.end('Internal Server Error');
                //     } else {
                //         res.statusCode = 200;
                //         res.end(data);
                //     }
                // });
            }
            )
        }
        else if (req.method === 'POST' && req.url === '/data') {
            let raw_data = '';
            req.on('data', chunk => {
                raw_data += chunk.toString();
            });
            req.on('end', () => {
                console.log(raw_data);
                d = qs.parse(raw_data);
                conn.query('insert into highscore(name,time) values("' + d.name + '",' + d.time + ');', (err, res) => {
                    if (err) console.log(err);
                    else console.log("Entry added");
                })

                res.end();
            });
        }
        else {
            res.setHeader('Content-Type', 'text/html');
            res.statusCode = 404;

            res.end("Page not found");
        }
    });

    const port = 3000;
    server.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
});