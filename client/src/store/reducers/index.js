import { ADD_CHAT } from "../constants/action-types";

const initialState = {
  currentUser: {},
  users: [],
  chats: [],
  messages: {}
};

function rootReducer(state = initialState, action) {
  if (action.type === ADD_CHAT) {
    return Object.assign({}, state, {
      chats: state.chats.concat(action.payload)
    });
  }

  if (action.type === "CHATS_LOADED") {
    return Object.assign({}, state, {
      chats: (state.chats = action.payload)
    });
  }

  if (action.type === "EDIT_CHAT") {
    state.chats = [...state.chats];

    const index = state.chats.findIndex(chat => chat.id === action.payload.id);
    state.chats[index] = action.payload;

    return Object.assign({}, state, {
      chats: state.chats
    });
  }

  if (action.type === "USERS_LOADED") {
    return Object.assign({}, state, {
      users: state.users.concat(action.payload)
    });
  }

  if (action.type === "MESSAGES_LOADED") {
    return Object.assign({}, state, {
      messages: Object.assign(state.messages, action.payload)
    });
  }

  if (action.type === "ADD_MESSAGE") {
    return Object.assign({}, state, {
      message: state.messages[action.payload.chat_id].push(action.payload)
    });
  }

  if (action.type === "USER_LOADED") {
    return Object.assign({}, state, {
      user: (state.currentUser = { ...state.currentUser, ...action.payload })
    });
  }

  if (action.type === "LOGOUT") {
    return Object.assign({}, state, {
      users: (state.currentUser = {})
    });
  }

  return state;
}

export default rootReducer;
