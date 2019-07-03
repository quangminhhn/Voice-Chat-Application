var socket = io.connect();
var user = prompt("Kullanıcı Adınız", "");

function say(text) {
    responsiveVoice.speak(text, "Turkish Male");
}

function listen() {
    var recognition = new webkitSpeechRecognition();
    recognition.interimResults = true;
    recognition.onresult = function(event) {
        if (event.results.length > 0) {
            $("#message").text(event.results[0][0].transcript);
        }
    }
    recognition.onend = function(event) {
        postVoice($("#message").text());
    }
    recognition.start();
}

function postVoice(message) {
    console.log(message)
    $.ajax({
        type: "POST",
        url: "/voice",
        data: { message: message },
        success: function(data) {
            socket.emit("sendMessage", {
                username: user,
                message: data.message
            });
        }
    });
}

socket.on("userID", function (data) {
    var socketid = data;
    socket.on("message", function (data) {
        if (socket.id != socketid) {
            $("#message").text(user + ": " + data.message);                
            say(data.message);
        } else {
            $("#message").text("Sen: " + data.message);                
        }
    });
});