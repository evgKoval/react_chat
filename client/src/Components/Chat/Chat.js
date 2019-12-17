import React from "react";
import jwtDecode from "jwt-decode";
import API from "../../api";
import "./Chat.css";
import avatar from "../../images/default_avatar.png";
// import API from "../../api";
// import { Redirect } from "react-router-dom";

import ModalCreate from "../Modals/Create";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import PostAddIcon from "@material-ui/icons/PostAdd";
import SendIcon from "@material-ui/icons/Send";

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
      chatsFiltered: []
    };
  }

  componentDidMount() {
    const token = localStorage.getItem("token");
    if (!token) {
      this.setState({ redirect: true });
    }

    API.get("/chats").then(res =>
      this.setState({ chats: res.data.chats, chatsFiltered: res.data.chats })
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

    this.setState({ chatsFiltered: chatsFiltered });
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
              {/* {this.state.chatsFiltered.map((chat, index) => {
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
              })} */}
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
            />
            <div className="chat-messages">
              <Paper className="chat-message">
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar alt="Wesley" src="/static/images/avatar/1.jpg" />
                  </ListItemAvatar>
                  <ListItemText
                    primary="Wesley"
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          color="textPrimary"
                        >
                          Hello, brothers
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
              </Paper>
              <Paper className="chat-message">
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar src={avatar} />
                  </ListItemAvatar>
                  <ListItemText
                    primary="Wesley"
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          color="textPrimary"
                        >
                          How are you?
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
              </Paper>
              <Paper className="chat-message chat-message-own">
                <ListItem alignItems="flex-start">
                  <ListItemText
                    color="primary"
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          color="textPrimary"
                        >
                          Cool!
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
              </Paper>
            </div>
            <Paper component="form" className="message-form">
              <InputBase className="message-input" placeholder="..." />
              <IconButton
                type="submit"
                className="message-icon"
                aria-label="search"
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
