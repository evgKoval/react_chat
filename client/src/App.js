import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Container from "@material-ui/core/Container";

import Header from "./Components/Header/Header";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import Chat from "./Components/Chat/Chat";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Container>
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route exact path="/">
              <h3 style={{ fontWeight: "normal" }}>Welcome, User</h3>
              <Chat />
            </Route>
          </Switch>
        </Container>
      </Router>
    </div>
  );
}

export default App;
