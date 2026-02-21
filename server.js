const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const PORT = process.env.PORT || 3000;

let messages = [];
let users = {};

app.use(express.static("public"));

function generateName() {
    const names = ["Neo", "Ghost", "Shadow", "Cyber", "Zero", "Nova"];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomNum = Math.floor(Math.random() * 9999);
    return randomName + "-" + randomNum;
}

function createRoom(id1, id2) {
    return [id1, id2].sort().join("-");
}


io.on("connection", (socket) => {
    // kasih random username sementara
    //const userName = "Anon" + Math.floor(Math.random() * 1000);

    socket.emit("chat history", messages);

    const username = generateName();

    users[socket.id] = username;

    io.emit("user list", users);

    // update daftar user
    io.emit("user list", Object.keys(users));

    socket.on("chat message", (msg) => {
        const messageData = {
            user: username,
            message: msg
        };
    

    messages.push(messageData); // simpan ke array

    io.emit("chat message", messageData);

    socket.on("disconnect", () => {
        delete users[socket.id];
        io.emit("user list", Object.keys(users));
    });

});
})

http.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));