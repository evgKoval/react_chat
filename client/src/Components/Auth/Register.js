import React from "react";
import API from "../../api";

import { Redirect } from "react-router-dom";

import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";

import Button from "@material-ui/core/Button";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      redirect: false,
      error: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const name = target.name;

    this.setState({
      [name]: target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    API.post("/register", {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password
    })
      .then(res => {
        this.setState({ redirect: true });
      })
      .catch(error => this.setState({ error: error.response.data.message }));
  }

  render() {
    const { redirect } = this.state;

    if (redirect) {
      return <Redirect to="/login" />;
    }

    return (
      <ValidatorForm onSubmit={this.handleSubmit} style={{ marginBottom: 32 }}>
        <h1 style={{ marginBottom: 24 }}>Register</h1>
        <TextValidator
          name="name"
          label="Your name"
          variant="outlined"
          value={this.state.name}
          onChange={this.handleChange}
          fullWidth
          style={{ marginBottom: 16 }}
          validators={["required", "minStringLength:2"]}
          errorMessages={[
            "This field is required",
            "This field must be equal 2 or more symbols"
          ]}
        />
        <TextValidator
          name="email"
          label="Your email"
          variant="outlined"
          value={this.state.email}
          onChange={this.handleChange}
          fullWidth
          style={{ marginBottom: 16 }}
          validators={["required", "isEmail"]}
          errorMessages={["This field is required", "Email is not valid"]}
        />
        <TextValidator
          name="password"
          type="password"
          label="Password"
          variant="outlined"
          value={this.state.password}
          onChange={this.handleChange}
          fullWidth
          style={{ marginBottom: 16 }}
          validators={["required", "minStringLength:6"]}
          errorMessages={[
            "This field is required",
            "This field must be equal 6 or more symbols"
          ]}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
        >
          Sign Up
        </Button>
        {this.state.error != null ? (
          <h3 className="text-error">{this.state.error}</h3>
        ) : null}
      </ValidatorForm>
    );
  }
}

export default Register;
