import React from "react";
import PropTypes from "prop-types";

import Paper from "@material-ui/core/Paper";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";

export default function Message(props) {
  const { name, avatar, text, own } = props;

  return (
    <Paper
      className={"chat-message " + (own === "true" ? "chat-message-own" : "")}
    >
      <ListItem alignItems="flex-start">
        {own !== "false" ? null : (
          <ListItemAvatar>
            <Avatar alt={name} src={avatar} />
          </ListItemAvatar>
        )}
        <ListItemText
          primary={own !== "false" ? null : name}
          secondary={
            <React.Fragment>
              <Typography component="span" variant="body2" color="textPrimary">
                {text}
              </Typography>
            </React.Fragment>
          }
        />
      </ListItem>
    </Paper>
  );
}

Message.propTypes = {
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  own: PropTypes.string
};
