import API from "../../api";

import { ADD_CHAT } from "../constants/action-types";

export function addChat(payload) {
  return async function(dispatch) {
    const res = await API.post("/chats", {
      name: payload.name,
      created_by: payload.created_by,
      users: payload.users
    });

    const chat = {
      id: res.data.chat,
      name: payload.name,
      users: payload.users
    };

    dispatch({ type: ADD_CHAT, payload: chat });
  };
}

export function getChats() {
  return async function(dispatch) {
    const res = await API.get("/chats");

    dispatch({ type: "CHATS_LOADED", payload: res.data.chats });
  };
}

export function getUsers() {
  return async function(dispatch) {
    const res = await API.get("/users");

    dispatch({ type: "USERS_LOADED", payload: res.data.users });
  };
}

export function getMessagesByChatId(chatId) {
  return async function(dispatch) {
    const res = await API.get("chats/" + chatId + "/messages/");

    const chatMessages = {
      [chatId]: res.data.messages
    };

    dispatch({ type: "MESSAGES_LOADED", payload: chatMessages });
  };
}

export function sendMessage(payload) {
  return async function(dispatch) {
    const message = await API.post("/chats/messages", {
      chat_id: payload.chat_id,
      text: payload.text
    });

    message.data.message["own"] = "true";

    dispatch({ type: "ADD_MESSAGE", payload: message.data.message });
  };
}

export function getUserById(userId) {
  return async function(dispatch) {
    const res = await API.get("/users/" + userId);

    dispatch({ type: "USER_LOADED", payload: res.data.user });
  };
}

export function updateUser(payload) {
  return async function(dispatch) {
    const form = new FormData();

    form.set("file", payload.file);
    form.set("file_name", payload.fileName);
    form.set("name", payload.name);
    form.set("email", payload.email);

    await API.put("/users", form);
  };
}

export function logout() {
  return function(dispatch) {
    dispatch({ type: "LOGOUT" });
  };
}
