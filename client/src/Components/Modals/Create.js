import React from "react";
import { useDispatch } from "react-redux";
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

import { addChat, editChat } from "../../store/actions/index";

function ModalCreate(props) {
  const { open, onClose, userId, users, edit, chatId } = props;

  const dispatch = useDispatch();

  const [checked, setChecked] = React.useState([]);
  const [chatName, setChatName] = React.useState("");
  const [fieldEmpty, setFieldEmpty] = React.useState(false);

  React.useEffect(() => {
    if (users.length !== 0) {
      const index = users.findIndex(user => user.id === userId);

      if (index === 0) {
        users.splice(index, 1);
      }
    }

    if (edit) {
      API.get("chat/" + chatId).then(res => {
        const array = [];
        users.map(user => {
          for (let i = 0; i < res.data.users.length; i++) {
            if (user.id === res.data.users[i]) array.push(user.id);
          }
          return user;
        });

        setChatName(res.data.name);
        setChecked(array);
      });
    }
  }, [userId, users, edit, chatId]);

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

    dispatch(
      addChat({
        name: chatName,
        created_by: userId,
        users: checked
      })
    ).then(() => onClose());
  };

  const updateChat = () => {
    if (chatName === "") {
      setFieldEmpty(true);

      return;
    } else {
      setFieldEmpty(false);
    }

    dispatch(
      editChat({
        chat_id: chatId,
        name: chatName,
        created_by: userId,
        users: checked
      })
    ).then(() => onClose());
  };

  const handleOnClose = () => {
    onClose();

    setChecked([]);
    setChatName("");
  };

  return (
    <Dialog aria-labelledby="modal-create" open={open} onClose={handleOnClose}>
      <DialogTitle id="simple-dialog-title" style={{ width: "480px" }}>
        {edit ? "Edit the chat" : "Create a new chat"}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          value={chatName}
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
          {users.map((user, index) => {
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
        <Button onClick={handleOnClose}>Cancel</Button>
        {edit ? (
          <Button onClick={updateChat} color="primary">
            Edit
          </Button>
        ) : (
          <Button onClick={createChat} color="primary">
            Create
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

ModalCreate.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
  users: PropTypes.array.isRequired,
  edit: PropTypes.bool,
  chatId: PropTypes.number
};

export default ModalCreate;
