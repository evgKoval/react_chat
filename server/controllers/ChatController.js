const jwtDecode = require("jwt-decode");
const nodemailer = require("nodemailer");

const Chat = require("../models/Chat");
const User = require("../models/User");

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

exports.access = async function(request, response) {
  const chatId = request.body.chat_id;
  const chatCreator = await Chat.getCreatorByChatId(chatId);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASSWORD
    }
  });

  const userId = request.body.user_id;
  const userName = request.body.user_name;
  const userEmail = request.body.user_email;
  const chatName = request.body.chat_name;

  const mailOptions = {
    from: process.env.NODEMAILER_USER,
    to: chatCreator.email,
    subject: "Someone has wanted to join in your chat!",
    text: `${userName} (${userEmail}) just asked to join in your chat (${chatName}). To access ${userName} click this link http://localhost:5000/access/${chatId}/${userId}`
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      response.json({
        email: "Success"
      });
    }
  });
};

exports.confirm = async function(request, response) {
  const chatId = request.params.chatId;
  const userId = request.params.userId;

  const access = await Chat.accessUserInChat(chatId, userId);

  if (access.length == 0) {
    response.json({
      access: "User isn't accessed to chat"
    });
  }

  response.json({
    access: "User has accessed to chat"
  });
};
