var express = require('express');
var app = express();

var server = app.listen(8000);

const io = require('socket.io').listen(server);

var path = require('path');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use(express.static(path.join(__dirname,'client')));

app.post('/voice', function(req, res) {
    getResponse(req.body.message, function(response) {
        res.json({
            message: response
        })
    })
});

function getResponse(message, callback) {
    callback(message);
}

io.sockets.on("connection", function(socket) {
    console.log("Bir kullanıcı " + socket.id + " id'si ile konuşmaya katıldı");
    socket.on("sendMessage", function(data) {
        io.sockets.emit("message", data);
        io.sockets.emit("userID", socket.id);
        console.log(data.username + ": " + data.message);
    });
});