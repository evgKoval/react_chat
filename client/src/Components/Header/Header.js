import React from "react";
import { Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1
  }
}));

function Header(props) {
  const classes = useStyles();

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          ReactChat
        </Typography>
        <Button color="inherit" component={Link} to="/login">
          Login
        </Button>
        <Button color="inherit" component={Link} to="/register">
          Register
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
