import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import jwtDecode from "jwt-decode";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TelegramIcon from "@material-ui/icons/Telegram";

import { getUserById, logout } from "../../store/actions/index";

const useStyles = makeStyles(theme => ({
  title: {
    marginRight: "auto"
  },
  icon: {
    position: "relative",
    top: 5,
    paddingRight: 5
  }
}));

function Header(props) {
  const history = useHistory();
  const dispatch = useDispatch();

  const token = localStorage.getItem("token");

  if (token !== null) {
    dispatch(getUserById(jwtDecode(token).userId));
  }

  const classes = useStyles();

  const handleLogout = () => {
    dispatch(logout());

    localStorage.removeItem("token");

    history.push("/login");
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          className={classes.title}
        >
          <TelegramIcon className={classes.icon} />
          ReactChat
        </Typography>
        {token === null ? (
          <React.Fragment>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Button color="inherit" component={Link} to="/profile">
              Profile
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </React.Fragment>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
