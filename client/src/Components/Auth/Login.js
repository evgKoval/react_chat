import React from "react";

import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";

import Button from "@material-ui/core/Button";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
        <h1 style={{ marginBottom: 24 }}>Login</h1>
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
          Sign In
        </Button>
      </ValidatorForm>
    );
  }
}

export default Login;
