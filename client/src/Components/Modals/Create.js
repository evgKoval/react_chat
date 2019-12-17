import React from "react";
import PropTypes from "prop-types";
import API from "../../api";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Checkbox from "@material-ui/core/Checkbox";
import Avatar from "@material-ui/core/Avatar";

export default function ModalCreate(props) {
  const { open, onClose, userId } = props;

  React.useEffect(() => {
    API.get("/users").then(res => {
      const users = res.data.users;

      const index = users.findIndex(user => user.id === userId);
      users.splice(index, 1);

      setUsers(users);
    });
  }, [userId]);

  const [checked, setChecked] = React.useState([]);
  const [chatName, setChatName] = React.useState("");
  const [users, setUsers] = React.useState([]);
  const [fieldEmpty, setFieldEmpty] = React.useState(false);

  const handleToggle = value => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleChatName = value => {
    setChatName(value);
    setFieldEmpty(false);
  };

  const createChat = () => {
    if (chatName === "") {
      setFieldEmpty(true);

      return;
    } else {
      setFieldEmpty(false);
    }

    API.post("/chats", {
      name: chatName,
      created_by: userId,
      users: checked
    }).then(res => onClose());
  };

  return (
    <Dialog aria-labelledby="modal-create" open={open} onClose={onClose}>
      <DialogTitle id="simple-dialog-title" style={{ width: "480px" }}>
        Create a new chat
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          id="name"
          label="Enter chat name"
          type="text"
          variant="outlined"
          fullWidth
          style={{ marginBottom: 16 }}
          onChange={e => {
            handleChatName(e.target.value);
          }}
          error={fieldEmpty}
        />
        <List dense>
          {users.map(user => {
            const labelId = `checkbox-list-secondary-label-${user.id}`;
            return (
              <ListItem key={user.id} button>
                <ListItemAvatar>
                  <Avatar src={user.avatar} />
                </ListItemAvatar>
                <ListItemText id={labelId} primary={user.name} />
                <ListItemSecondaryAction>
                  <Checkbox
                    edge="end"
                    onChange={handleToggle(user.id)}
                    checked={checked.indexOf(user.id) !== -1}
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={createChat} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ModalCreate.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired
};
