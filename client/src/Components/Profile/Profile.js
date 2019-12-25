import React from "react";
import { connect } from "react-redux";
import jwtDecode from "jwt-decode";

import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";

import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";

import { getUserById, updateUser } from "../../store/actions/index";

const mapStateToProps = state => {
  return { currentUser: state.currentUser };
};

function mapDispatchToProps(dispatch) {
  return {
    getUserById: user => dispatch(getUserById(user)),
    updateUser: user => dispatch(updateUser(user))
  };
}

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      error: null,
      name: "",
      email: "",
      avatar: null,
      file: null,
      fileName: ""
    };
  }

  async componentDidMount() {
    const token = localStorage.getItem("token");
    if (!token) {
      this.setState({ redirect: true });
    }

    const userId = jwtDecode(token).userId;

    this.props.getUserById(userId).then(() =>
      this.setState({
        name: this.props.currentUser.name,
        email: this.props.currentUser.email,
        avatar:
          "https://nodejschat.s3.eu-central-1.amazonaws.com/" +
          this.props.currentUser.avatar
      })
    );
  }

  handleChange = event => {
    const target = event.target;
    const name = target.name;

    this.setState({
      [name]: target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();

    if (this.state.name === "" || this.state.email === "") return;

    this.props.updateUser({
      file: this.state.file,
      fileName: this.state.fileName,
      name: this.state.name,
      email: this.state.email
    });
  };

  handleUpload = event => {
    event.preventDefault();

    let reader = new FileReader();
    let file = event.currentTarget.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        fileName: this.props.currentUser.id + "_" + file.name,
        avatar: reader.result
      });
    };

    reader.readAsDataURL(file);
  };

  render() {
    return (
      <ValidatorForm onSubmit={this.handleSubmit} style={{ marginBottom: 32 }}>
        <h1 style={{ marginBottom: 24 }}>Your profile</h1>
        <Avatar
          src={this.state.avatar}
          style={{ marginBottom: 16, width: 150, height: 150 }}
        />
        <input
          accept="image/*"
          id="outlined-button-file"
          type="file"
          style={{ display: "none" }}
          onChange={this.handleUpload}
        />
        <label htmlFor="outlined-button-file">
          <Button
            variant="outlined"
            component="span"
            style={{ width: 150, marginBottom: 32 }}
          >
            Upload
          </Button>
        </label>
        <TextValidator
          name="name"
          label="Your name"
          variant="outlined"
          value={this.state.name}
          onChange={this.handleChange}
          fullWidth
          style={{ marginBottom: 16 }}
          validators={["required"]}
          errorMessages={["This field is required"]}
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
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
        >
          Update profile data
        </Button>
        {this.state.error != null ? (
          <h3 className="text-error">{this.state.error}</h3>
        ) : null}
      </ValidatorForm>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
