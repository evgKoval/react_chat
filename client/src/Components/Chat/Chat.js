import React from "react";
import { connect, connectAdvanced } from "react-redux";
import jwtDecode from "jwt-decode";
import "./Chat.css";
import io from "socket.io-client";
import { Redirect } from "react-router";
import API from "../../api";

// import { Redirect } from "react-router-dom";

import ModalCreate from "../Modals/Create";
import Message from "./Message";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import SendIcon from "@material-ui/icons/Send";
import PostAddIcon from "@material-ui/icons/PostAdd";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import EditIcon from "@material-ui/icons/Edit";

import {
  addChat,
  getChats,
  getUsers,
  getMessagesByChatId,
  sendMessage
} from "../../store/actions/index";

// const socket = io.connect("https://reactchats:5000");
const socket = io.connect("http://localhost:5000");

const mapStateToProps = state => {
  return {
    chats: state.chats,
    users: state.users,
    messages: state.messages,
    currentUser: state.currentUser
  };
};

function mapDispatchToProps(dispatch) {
  return {
    addChat: chat => dispatch(addChat(chat)),
    getChats: () => dispatch(getChats()),
    getUsers: () => dispatch(getUsers()),
    getMessagesByChatId: chatId => dispatch(getMessagesByChatId(chatId)),
    sendMessage: message => dispatch(sendMessage(message))
  };
}

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      error: null,
      selectedIndex: 0,
      selectedChatId: 0,
      open: false,
      userId: 0,
      chats: [],
      chatsFiltered: [],
      messages: [],
      messagesFiltered: [],
      loadingChats: true,
      loadingMessages: true,
      access: false,
      requestSent: false,
      notificate: false,
      modalEdit: false
    };

    this.sendInput = React.createRef();
    this.messagesDiv = React.createRef();

    this.getChats = null;
  }

  async componentDidMount() {
    const token = localStorage.getItem("token");

    if (token === null) {
      this.setState({ redirect: true });
    } else {
      this.setState({
        userId: jwtDecode(token).userId
      });
    }

    this.props.getChats().then(() => {
      const chats = this.props.chats;
      this.setState({ chatsFiltered: chats });
      if (chats.length !== 0) {
        const url = window.location.href;
        let hash = false;

        if (url.match(/#(.*)/)) {
          hash = url.match(/#(.*)/)[1];
        }

        let chatId = chats[0].id;

        if (hash) {
          chatId = parseInt(hash);
        }

        const userId = jwtDecode(token).userId;

        const indexForSelected = chats.findIndex(chat => chat.id === chatId);

        this.setState({
          selectedChatId: chatId,
          selectedIndex: indexForSelected,
          loadingChats: false
        });

        socket.emit("get access", {
          chatId,
          userId
        });
      } else {
        this.setState({ loadingChats: false, loadingMessages: false });
      }
    });

    socket.on("get access", responseAccess => {
      this.setState({ access: responseAccess });

      if (responseAccess) {
        socket.emit("get messages", {
          userId: this.state.userId,
          chatId: this.state.selectedChatId
        });
      }
    });

    socket.on("get messages", messages => {
      this.setState(
        {
          messages,
          messagesFiltered: messages,
          loadingMessages: false
        },
        () => {
          this.messagesDiv.current.scrollTop = this.messagesDiv.current.scrollHeight;
        }
      );
    });

    socket.on("chat message", message => {
      this.setState({
        messages: [...this.state.messages, message],
        messagesFiltered: [...this.state.messages, message]
      });

      const notification = new Notification(
        `${message.name} has sent a message`,
        {
          body: message.text,
          tag: "got-message" + message.id
        }
      );

      notification.onclick = e => {
        e.preventDefault();
        window.open(`http://localhost:3000/#${message.chat_id}`, "_blank");
      };
    });

    socket.on("edit message", editedMessage => {
      this.setState({ loadingMessages: true });

      const messages = [...this.state.messages];

      const index = messages.findIndex(
        message => message.id === editedMessage.id
      );
      messages[index] = editedMessage;

      this.setState({
        messages,
        messagesFiltered: messages,
        loadingMessages: false
      });
    });

    socket.on("delete message", idDeletedMessage => {
      this.setState({ loadingMessages: true });

      const messages = [...this.state.messages];

      const index = messages.findIndex(
        message => message.id === idDeletedMessage
      );

      messages.splice(index, 1);

      this.setState({
        messages,
        messagesFiltered: messages,
        loadingMessages: false
      });
    });

    socket.on("get access", responseAccess => {
      if (responseAccess) {
        socket.emit("get messages", {
          userId: this.state.userId,
          chatId: this.state.selectedChatId
        });

        this.setState({ access: responseAccess });
      } else {
        this.setState({ access: responseAccess, loadingMessages: false });
      }
    });

    this.props.getUsers();

    function urlBase64ToUint8Array(base64String) {
      var padding = "=".repeat((4 - (base64String.length % 4)) % 4);
      var base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

      var rawData = window.atob(base64);
      var outputArray = new Uint8Array(rawData.length);

      for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    }

    navigator.serviceWorker.ready.then(serviceWorkerRegistration => {
      var options = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          "BBZeRDMeH6fL2sXZ9ILBxn7-f9pVWtnWmJ-6mbaEkdbZnFu2Q0DPrICFllzaFlvAu5gV5qtLFYBFd7jp2TFUHK8"
        )
      };
      serviceWorkerRegistration.pushManager.subscribe(options).then(
        pushSubscription => {
          this.setState({ notificate: true });
        },
        function(error) {
          console.log(error);
        }
      );
    });
  }

  handleSearchChat(value) {
    const chats = [...this.props.chats];

    if (value === "") {
      this.setState({ chatsFiltered: chats });
    }

    const chatsFiltered = chats.filter(chat =>
      chat.name.toLowerCase().includes(value)
    );

    this.setState({ chatsFiltered });
  }

  handleSearchMessage(value) {
    const messages = [...this.state.messages];

    if (value === "") {
      this.setState({ messagesFiltered: messages });
    }

    const messagesFiltered = messages.filter(message =>
      message.text.toLowerCase().includes(value)
    );

    console.log(messagesFiltered);

    this.setState({ messagesFiltered });
  }

  async handleSendMessage() {
    const sendInput = await this.sendInput.current.querySelector("input");

    if (sendInput.value === "") return;

    socket.emit("chat message", {
      userId: this.state.userId,
      chatId: this.state.selectedChatId,
      text: sendInput.value
    });

    this.setState({
      messages: [
        ...this.state.messages,
        {
          created_at: new Date(),
          text: sendInput.value,
          chat_id: this.state.selectedChatId,
          user_id: this.state.userId,
          edited: false,
          type: "text",
          own: "true"
        }
      ],
      messagesFiltered: [
        ...this.state.messagesFiltered,
        {
          created_at: new Date(),
          text: sendInput.value,
          chat_id: this.state.selectedChatId,
          user_id: this.state.userId,
          edited: false,
          type: "text",
          own: "true"
        }
      ]
    });

    sendInput.value = "";
  }

  handleUploadChat = event => {
    let file = event.currentTarget.files[0];

    const time = new Date().getTime();

    const fileName = time + "_" + file.name;

    socket.emit(
      "chat file",
      {
        file,
        fileType: file.type,
        fileName,
        userId: this.state.userId,
        chatId: this.state.selectedChatId
      },
      () => {
        this.setState({
          messages: [
            ...this.state.messages,
            {
              created_at: new Date(),
              text: fileName,
              chat_id: this.state.selectedChatId,
              user_id: this.state.userId,
              edited: false,
              type: file.type,
              own: "true"
            }
          ],
          messagesFiltered: [
            ...this.state.messagesFiltered,
            {
              created_at: new Date(),
              text: fileName,
              chat_id: this.state.selectedChatId,
              user_id: this.state.userId,
              edited: false,
              type: file.type,
              own: "true"
            }
          ]
        });
      }
    );
  };

  render() {
    const { redirect } = this.state;

    if (redirect) {
      return <Redirect to="/login" />;
    }

    const handleListItemClick = (index, chatId) => {
      this.setState({ requestSent: false });

      socket.emit("leave chat", { chatId: this.state.selectedChatId });

      this.setState({
        selectedIndex: index,
        selectedChatId: chatId,
        loadingMessages: true
      });

      socket.emit("get access", {
        chatId,
        userId: this.state.userId
      });

      this.sendInput.current.querySelector("input").value = "";
    };

    const handleClickOpenModal = () => {
      this.setState({ open: true });
    };

    const handleCloseModal = () => {
      this.setState({ open: false, modalEdit: false });
    };

    const handleEditedMessage = (text, messageId) => {
      socket.emit("edit message", {
        text,
        messageId,
        chatId: this.state.selectedChatId
      });
    };

    const handleDeleteMessage = messageId => {
      socket.emit("delete message", {
        messageId,
        chatId: this.state.selectedChatId
      });
    };

    const handleRequest = () => {
      const chat = this.props.chats.filter(
        chat => chat.id === this.state.selectedChatId
      );

      API.post("/request", {
        chat_id: this.state.selectedChatId,
        chat_name: chat[0].name,
        user_id: this.state.userId,
        user_name: this.props.currentUser.name,
        user_email: this.props.currentUser.email
      }).then(() => this.setState({ requestSent: true }));
    };

    const handleEditChat = chatId => {
      this.setState({ modalEdit: true });
    };

    return (
      <Paper style={{ marginTop: 32, height: "624px", marginBottom: 32 }}>
        <Grid container>
          <Grid
            item
            xs={3}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "624px"
            }}
          >
            <List component="nav" className="chat-list">
              <ListItem
                button
                style={{ paddingTop: "12px", paddingBottom: "12px" }}
                onClick={handleClickOpenModal}
                className="btn-new-chat"
              >
                <ListItemIcon>
                  <PostAddIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Create a new chat"
                  className="btn-new-chat-text"
                />
              </ListItem>
              <div className="chats">
                {this.state.loadingChats === true ? (
                  <div style={{ textAlign: "center" }}>
                    <CircularProgress
                      color="secondary"
                      size={30}
                      style={{ textAlign: "center" }}
                    />
                  </div>
                ) : this.state.chatsFiltered.length === 0 ? (
                  <h5 style={{ textAlign: "center" }}>
                    There are no chats by this query
                  </h5>
                ) : (
                  this.state.chatsFiltered.map((chat, index) => {
                    return (
                      <ListItem
                        key={index}
                        button
                        selected={this.state.selectedIndex === index}
                        onClick={event => handleListItemClick(index, chat.id)}
                      >
                        <ListItemText primary={chat.name} />
                        {chat.created_by === this.state.userId ? (
                          <EditIcon
                            className="chat-icon"
                            onClick={() => {
                              handleEditChat(chat.id);
                              handleClickOpenModal();
                            }}
                          />
                        ) : null}
                      </ListItem>
                    );
                  })
                )}
              </div>
            </List>
            <TextField
              id="chat-search"
              label="Search by chat name"
              variant="filled"
              fullWidth
              onChange={e => {
                this.handleSearchChat(e.target.value);
              }}
            />
          </Grid>
          <Grid
            item
            xs={9}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "624px",
              borderLeft: "1px solid rgba(0, 0, 0, .14)"
            }}
          >
            <TextField
              id="message-search"
              label="Search by message"
              variant="filled"
              fullWidth
              onChange={e => {
                this.handleSearchMessage(e.target.value);
              }}
            />
            <div ref={this.messagesDiv} className="chat-messages">
              {this.state.loadingMessages === true ? (
                <div style={{ textAlign: "center" }}>
                  <CircularProgress
                    color="secondary"
                    style={{ textAlign: "center" }}
                  />
                </div>
              ) : this.state.access ? (
                this.state.messagesFiltered.length === 0 ? (
                  <h3 style={{ textAlign: "center" }}>
                    There are no messages in this chat
                  </h3>
                ) : (
                  this.state.messagesFiltered.map((message, index) => {
                    return (
                      <Message
                        key={message.id}
                        id={message.id}
                        name={message.name}
                        avatar={message.avatar}
                        text={message.text}
                        own={message.own}
                        type={message.type}
                        edited={message.edited}
                        handleEdit={handleEditedMessage}
                        handleDelete={handleDeleteMessage}
                        createdAt={message.created_at}
                      />
                    );
                  })
                )
              ) : (
                <React.Fragment>
                  <h3 style={{ textAlign: "center" }}>
                    You have no permission to join this chat
                  </h3>

                  {this.state.requestSent ? (
                    <h4 style={{ textAlign: "center", marginTop: 0 }}>
                      Request has been sent
                    </h4>
                  ) : (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleRequest}
                    >
                      Send a request to join
                    </Button>
                  )}
                </React.Fragment>
              )}
            </div>
            <Paper className="message-form">
              <InputBase
                className="message-input"
                placeholder="..."
                ref={this.sendInput}
              />
              <input
                style={{ display: "none" }}
                id="icon-button-file"
                type="file"
                onChange={this.handleUploadChat}
              />
              <label htmlFor="icon-button-file">
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                >
                  <AttachFileIcon />
                </IconButton>
              </label>
              <IconButton
                className="message-icon"
                aria-label="search"
                onClick={event => this.handleSendMessage(event)}
              >
                <SendIcon color="primary" />
              </IconButton>
            </Paper>
          </Grid>
        </Grid>
        <ModalCreate
          open={this.state.open}
          onClose={handleCloseModal}
          userId={this.state.userId}
          users={this.props.users}
          edit={this.state.modalEdit}
          chatId={this.state.selectedChatId}
        />
      </Paper>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
