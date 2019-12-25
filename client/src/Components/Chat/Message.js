import React from "react";
import PropTypes from "prop-types";
import prettyDate from "pretty-date";

import Paper from "@material-ui/core/Paper";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Input from "@material-ui/core/Input";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import DeleteIcon from "@material-ui/icons/Delete";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import ArchiveIcon from "@material-ui/icons/Archive";
import FileCopyIcon from "@material-ui/icons/FileCopy";

export default function Message(props) {
  const {
    id,
    name,
    avatar,
    own,
    type,
    handleEdit,
    handleDelete,
    createdAt
  } = props;

  const [messageText, setMessageText] = React.useState(props.text);
  const [editing, setEditing] = React.useState(false);
  const [editingValue, setEditingValue] = React.useState("");
  const [edited, setEdited] = React.useState(props.edited);

  const handleEditMessage = e => {
    if (own !== "true") {
      return;
    }

    const text = e.currentTarget.querySelector("span.message-text").innerHTML;
    setEditingValue(text);

    setEditing(true);
  };

  const editedMessage = e => {
    const editedText = e.currentTarget;

    if (editedText.value === messageText || editedText.value === "") {
      setTimeout(() => {
        setEditing(false);
      }, 100);
      return;
    }

    handleEdit(editedText.value, id);

    setMessageText(editedText.value);

    setTimeout(() => {
      setEditing(false);
    }, 100);
    setEdited(true);
  };

  const handlerDelete = () => {
    handleDelete(id);
  };

  const withoutTime = text => {
    const array = text.split("_");

    array.shift();

    return array.join("_");
  };

  return (
    <Paper
      className={
        "chat-message " +
        (own === "true" ? "chat-message-own " : null) +
        (editing ? "full-width" : null)
      }
    >
      {type === "image/jpeg" ||
      type === "image/png" ||
      type === "image/webp" ||
      type === "image/gif" ? (
        <ListItem alignItems="flex-start">
          {own !== "false" ? null : (
            <ListItemAvatar>
              <Avatar
                alt={name}
                src={
                  "https://nodejschat.s3.eu-central-1.amazonaws.com/" + avatar
                }
              />
            </ListItemAvatar>
          )}
          <ListItemText
            primary={own !== "false" ? null : name}
            secondary={
              <React.Fragment>
                <img
                  alt={messageText}
                  src={
                    "https://nodejschat.s3.eu-central-1.amazonaws.com/messages/" +
                    messageText
                  }
                  style={{ width: "100%", marginTop: 8 }}
                />
                <span className="created-at">
                  {prettyDate.format(new Date(createdAt))}
                </span>
              </React.Fragment>
            }
          />
        </ListItem>
      ) : type === "text" ? (
        <ListItem alignItems="flex-start">
          {own !== "false" ? null : (
            <ListItemAvatar>
              <Avatar
                alt={name}
                src={
                  "https://nodejschat.s3.eu-central-1.amazonaws.com/" + avatar
                }
              />
            </ListItemAvatar>
          )}
          {editing ? (
            <Input
              defaultValue={editingValue}
              autoFocus
              onBlur={editedMessage}
              style={{ width: "100%" }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={handlerDelete}>
                    <DeleteIcon className="message-delete" />
                  </IconButton>
                </InputAdornment>
              }
            />
          ) : (
            <ListItemText
              onDoubleClick={handleEditMessage}
              primary={own !== "false" ? null : name}
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    color="textPrimary"
                  >
                    <span className="message-text">{messageText}</span>

                    {edited ? (
                      <Typography variant="caption">edited</Typography>
                    ) : null}
                    <span className="created-at">
                      {prettyDate.format(new Date(createdAt))}
                    </span>
                  </Typography>
                </React.Fragment>
              }
            />
          )}
        </ListItem>
      ) : type === "application/pdf" ? (
        <ListItem alignItems="flex-start">
          {own !== "false" ? null : (
            <ListItemAvatar>
              <Avatar
                alt={name}
                src={
                  "https://nodejschat.s3.eu-central-1.amazonaws.com/" + avatar
                }
              />
            </ListItemAvatar>
          )}
          <ListItemText
            onDoubleClick={handleEditMessage}
            primary={own !== "false" ? null : name}
            secondary={
              <React.Fragment>
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                >
                  <a
                    className="message-pdf"
                    href={
                      "https://nodejschat.s3.eu-central-1.amazonaws.com/messages/" +
                      messageText
                    }
                  >
                    <PictureAsPdfIcon />
                    {withoutTime(messageText)}
                  </a>

                  <span className="created-at">
                    {prettyDate.format(new Date(createdAt))}
                  </span>
                </Typography>
              </React.Fragment>
            }
          />
        </ListItem>
      ) : type === "application/x-zip-compressed" ? (
        <ListItem alignItems="flex-start">
          {own !== "false" ? null : (
            <ListItemAvatar>
              <Avatar
                alt={name}
                src={
                  "https://nodejschat.s3.eu-central-1.amazonaws.com/" + avatar
                }
              />
            </ListItemAvatar>
          )}
          <ListItemText
            onDoubleClick={handleEditMessage}
            primary={own !== "false" ? null : name}
            secondary={
              <React.Fragment>
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                >
                  <a
                    className="message-pdf"
                    href={
                      "https://nodejschat.s3.eu-central-1.amazonaws.com/messages/" +
                      messageText
                    }
                  >
                    <ArchiveIcon />
                    {withoutTime(messageText)}
                  </a>

                  <span className="created-at">
                    {prettyDate.format(new Date(createdAt))}
                  </span>
                </Typography>
              </React.Fragment>
            }
          />
        </ListItem>
      ) : (
        <ListItem alignItems="flex-start">
          {own !== "false" ? null : (
            <ListItemAvatar>
              <Avatar
                alt={name}
                src={
                  "https://nodejschat.s3.eu-central-1.amazonaws.com/" + avatar
                }
              />
            </ListItemAvatar>
          )}
          <ListItemText
            onDoubleClick={handleEditMessage}
            primary={own !== "false" ? null : name}
            secondary={
              <React.Fragment>
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                >
                  <a
                    className="message-pdf"
                    href={
                      "https://nodejschat.s3.eu-central-1.amazonaws.com/messages/" +
                      messageText
                    }
                  >
                    <FileCopyIcon />
                    {withoutTime(messageText)}
                  </a>

                  <span className="created-at">
                    {prettyDate.format(new Date(createdAt))}
                  </span>
                </Typography>
              </React.Fragment>
            }
          />
        </ListItem>
      )}
    </Paper>
  );
}

Message.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string,
  avatar: PropTypes.string,
  text: PropTypes.string.isRequired,
  own: PropTypes.string,
  type: PropTypes.string.isRequired,
  edited: PropTypes.bool,
  handleEdit: PropTypes.func,
  createdAt: PropTypes.string
};
