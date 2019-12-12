import React from "react";

import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";

import Button from "@material-ui/core/Button";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: ""
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
    console.log(this.state);
  }

  render() {
    return (
      <ValidatorForm onSubmit={this.handleSubmit}>
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
      </ValidatorForm>
    );
  }
}

export default Register;
