import React from "react";
import API from "../../api";

import { Redirect } from "react-router-dom";

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      error: null
    };
  }

  componentDidMount() {
    if (!localStorage.getItem("token")) {
      this.setState({ redirect: true });
    }
  }

  render() {
    const { redirect } = this.state;

    if (redirect) {
      return <Redirect to="/login" />;
    }

    return <h1>Chat!</h1>;
  }
}

export default Chat;
