const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const express = require('express');
const { application } = require('express');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())

const PORT = 443;

// 이제 터미널에 node app.js 를 입력해보자.
// request 와 response 라는 인자를 줘서 콜백 함수를 만든다.
// localhost:443 브라우저에 res.send() 내부의 문자열이 띄워진다.

// request 와 response 라는 인자를 줘서 콜백 함수를 만든다.
// localhost:3000 브라우저에 res.sendFile() 내부의 파일이 띄워진다.


// start
app.use(express.static(path.join(__dirname, 'start')))
app.use(express.static(path.join(__dirname, 'start/build')))

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + "/start/build/index.html"))
    // res.sendFile(__dirname + "/start/src/index.js")
})
app.get('/css/base.css', function (req, res) {
    res.sendFile(__dirname + "/start/src/base.css")
})
app.get('/Tutorials/Mirrors/static/css/main.06b04e02.chunk.css', function (req, res) {
    res.sendFile(__dirname + "/start/build/static/css/main.06b04e02.chunk.css")
})
app.get('/Tutorials/Mirrors/diamond.glb', function (req, res) {
    res.sendFile(path.join(__dirname + "/start/public/diamond.glb"))
})
app.get('/Tutorials/Mirrors/static/js/2.4944a6e6.chunk.js', function (req, res) {
    res.sendFile(__dirname + "/start/build/static/js/2.4944a6e6.chunk.js")
})
app.get('/Tutorials/Mirrors/static/js/main.a4faeb99.chunk.js', function (req, res) {
    res.sendFile(__dirname + "/start/build/static/js/main.a4faeb99.chunk.js")
})
app.get('/Tutorials/Mirrors/static/js/3.08284a14.chunk.js', function (req, res) {
    res.sendFile(__dirname + "/start/build/static/js/3.08284a14.chunk.js")
})
app.get('/Tutorials/Mirrors/static/css/main.06b04e02.chunk.css.map', function (req, res) {
    res.sendFile(__dirname + '/start/build/static/css/main.06b04e02.chunk.css.map')
})
app.get('/Tutorials/Mirrors/static/js/2.4944a6e6.chunk.js.map', function (req, res) {
    res.sendFile(__dirname + '/start/build/static/js/2.4944a6e6.chunk.js.map')
})


// webgl
// app.use(express.static(path.join(__dirname, 'webgl008')))
// app.use(express.static(path.join(__dirname, 'webgl008/js')))
// app.use(express.static(path.join(__dirname, 'webgl008/css')))
// app.use(express.static(path.join(__dirname, 'webgl008/babel')))

// app.get('/web', function (req, res) {
//     res.sendFile(path.join(__dirname + "/webgl008/index.html"))
// })


// game 1: piano
app.use(express.static(path.join(__dirname, 'min')))
app.use(express.static(path.join(__dirname, 'min/samples')))

app.get('/piano', function (req, res) {
    res.sendFile(path.join(__dirname + "/min/index.html"))
})


// game 2: stack
app.use(express.static(path.join(__dirname, 'cht')))

app.get('/stack', function (req, res) {
    res.sendFile(__dirname + "/cht/index.html")
})


// game 3: maze
app.use(express.static(path.join(__dirname, 'gh')))
app.use(express.static(path.join(__dirname, 'gh/Astrayt')))
app.use(express.static(path.join(__dirname, 'gh/Astrayt/sound')))

app.get('/maze', function (req, res) {
    res.sendFile(__dirname + "/gh/Astrayt/index.html")
})


// ending
app.use(express.static(path.join(__dirname, 'gh')))
app.use(express.static(path.join(__dirname, 'gh/sh')))

app.get('/ending', function (req, res) {
    res.sendFile(__dirname + "/gh/sh/index.html")
})


app.listen(PORT, function () {
    console.log("server is ready at " + PORT);
});