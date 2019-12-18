import React from "react";
import jwtDecode from "jwt-decode";
import API from "../../api";
import "./Chat.css";
// import API from "../../api";
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
import SendIcon from "@material-ui/icons/Send";
import PostAddIcon from "@material-ui/icons/PostAdd";

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      error: null,
      selectedIndex: 0,
      open: false,
      userId: 0,
      chats: [],
      chatsFiltered: [],
      messages: [],
      messagesFiltered: []
    };

    this.sendInput = React.createRef();
  }

  async componentDidMount() {
    const token = localStorage.getItem("token");
    if (!token) {
      this.setState({ redirect: true });
    }

    await API.get("/chats").then(res =>
      this.setState({ chats: res.data.chats, chatsFiltered: res.data.chats })
    );

    await API.get("chats/" + this.state.chats[0].id + "/messages/").then(res =>
      this.setState({
        messages: res.data.messages,
        messagesFiltered: res.data.messages
      })
    );

    this.setState({
      userId: jwtDecode(token).userId
    });
  }

  handleSearchChat(value) {
    const chats = [...this.state.chats];

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

    this.setState({ messagesFiltered });
  }

  handleSendMessage() {
    const sendInput = this.sendInput.current.querySelector("input");

    API.post("/chats/messages", {
      chat_id: this.state.chats[0].id,
      text: sendInput.value
    }).then(res => console.log(res));
  }

  render() {
    const handleListItemClick = index => {
      this.setState({ selectedIndex: index });
    };

    const handleClickOpenModal = () => {
      this.setState({ open: true });
    };

    const handleCloseModal = () => {
      this.setState({ open: false });
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
              >
                <ListItemIcon>
                  <PostAddIcon />
                </ListItemIcon>
                <ListItemText primary="Create a new chat" />
              </ListItem>
              {this.state.chatsFiltered.length === 0 ? (
                <h5 style={{ textAlign: "center" }}>
                  There are no chats by this query
                </h5>
              ) : (
                this.state.chatsFiltered.map((chat, index) => {
                  return (
                    <ListItem
                      key={chat.id}
                      button
                      selected={this.state.selectedIndex === index}
                      onClick={event => handleListItemClick(index)}
                    >
                      <ListItemText primary={chat.name} />
                    </ListItem>
                  );
                })
              )}
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
            <div className="chat-messages">
              {this.state.messagesFiltered.length === 0 ? (
                <h3 style={{ textAlign: "center" }}>
                  There are no messages in this chat
                </h3>
              ) : (
                this.state.messagesFiltered.map((message, index) => {
                  return (
                    <Message
                      key={index}
                      name={message.name}
                      avatar={message.avatar}
                      text={message.text}
                      own={message.own}
                    />
                  );
                })
              )}
            </div>
            <Paper component="form" className="message-form">
              <InputBase
                className="message-input"
                placeholder="..."
                ref={this.sendInput}
              />
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
        />
      </Paper>
    );
  }
}

export default Chat;
