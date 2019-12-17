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
