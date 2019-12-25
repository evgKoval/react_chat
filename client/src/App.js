import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Container from "@material-ui/core/Container";

import Header from "./Components/Header/Header";
import Chat from "./Components/Chat/Chat";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import Profile from "./Components/Profile/Profile";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Container>
          <Switch>
            <Route exact path="/">
              <Chat />
            </Route>
            <Route path="/profile">
              <Profile />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
          </Switch>
        </Container>
      </Router>
    </div>
  );
}

export default App;
