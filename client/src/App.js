import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Container from "@material-ui/core/Container";

import Header from "./Components/Header/Header";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";

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
              <Home />
            </Route>
          </Switch>
        </Container>
      </Router>
    </div>
  );
}

function Home() {
  return <h2>Home</h2>;
}

export default App;
