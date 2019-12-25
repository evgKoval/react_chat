import io from "socket.io-client";

const socket = io.connect("http://localhost:5000");

function getChatsSocket(cb) {
  socket.on("get chats", chats => cb(null, chats));
  socket.emit("getChats");
}

function getMessagesById(userId, chatId, cb) {
  socket.on("get messages", messages => cb(null, messages));
  socket.emit("getMessagesById", userId, chatId);
}

function sendMessage(/**userId, chatId, */ text /*, cb*/) {
  console.log(text);
  socket.emit("chat message", text);
  // console.log("send");
  // socket.on("send message", message => cb(null, message));
  // socket.emit("sendMessage", userId, chatId, text);
}

export { getChatsSocket, getMessagesById, sendMessage };
