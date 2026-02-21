const socket = io();

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", e => { if(e.key === "Enter") sendMessage(); });
function getCurrentDateTime() {
    const now = new Date();
    return now.toLocaleString();
}

function showWelcome() {
    appendSystemMessage("PRIVATE PUBLIC v1.0");
    appendSystemMessage(getCurrentDateTime());
    appendSystemMessage("");
    appendSystemMessage("Welcome to Anonymous Chat");
    appendSystemMessage("Type your message and press Enter...");
    appendSystemMessage("------------------------------------------------");
}

function appendSystemMessage(text) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("message-wrapper");

    const msg = document.createElement("div");
    msg.classList.add("message");
    msg.style.color = "#00ff66";
    msg.innerText = text;

    wrapper.appendChild(msg);
    chatBox.appendChild(wrapper);
}

let username = localStorage.getItem("username");
console.log(username)

if (!username) {
    localStorage.setItem("username", username);
}

function appendMessage(user, msg) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("message-wrapper");

    const bubble = document.createElement("div");
    bubble.classList.add("message");
    bubble.innerHTML = `<b>${user}</b>: ${msg}`;

    wrapper.appendChild(bubble);
    chatBox.appendChild(wrapper);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage() {
    const msg = userInput.value.trim();
    if(!msg) return;
    socket.emit("chat message", msg);
    userInput.value = "";
}

socket.on("chat message", data => {
    appendMessage(data.user, data.message);
});

socket.on("chat history", (history) => {
    history.forEach(data => {
        appendMessage(data.user, data.message);
    });
});

function appendMessage(user, msg) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("message-wrapper");

    const bubble = document.createElement("div");
    bubble.classList.add("message");

    const time = new Date().toLocaleTimeString();

    bubble.innerText = `[${time}] ${user}: ${msg}`;

    wrapper.appendChild(bubble);
    chatBox.appendChild(wrapper);
    chatBox.scrollTop = chatBox.scrollHeight;
}

window.onload = () => {
    showWelcome();
};