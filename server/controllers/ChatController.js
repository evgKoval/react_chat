const jwtDecode = require("jwt-decode");

const Chat = require("../models/Chat");

exports.index = async function(request, response) {
  try {
    const chats = await Chat.getAll();

    response.status(200).json({ chats });
  } catch (error) {
    response.status(400).json(error);
  }
};

exports.store = async function(request, response) {
  const name = request.body.name;
  const createdBy = request.body.created_by;
  const users = request.body.users;

  users.push(createdBy);

  try {
    const chat = await Chat.store(name, createdBy);

    for (let i = 0; i < users.length; i++) {
      await Chat.storeUser(chat.id, users[i]);
    }

    response.status(200).json({ chat: chat.id });
  } catch (error) {
    response.status(400).json(error);
  }
};

exports.messages = async function(request, response) {
  const userId = jwtDecode(request.headers["x-access-token"]).userId;
  const chatId = request.params.id;

  try {
    const messages = await Chat.getMessages(chatId, userId);

    response.status(200).json({ messages });
  } catch (error) {
    response.status(400).json(error);
  }
};

exports.send = async function(request, response) {
  const userId = jwtDecode(request.headers["x-access-token"]).userId;
  const chatId = request.body.chat_id;
  const text = request.body.text;

  try {
    const message = await Chat.sendText(chatId, userId, text);

    response.status(200).json({ message });
  } catch (error) {
    response.status(400).json(error);
  }
};
