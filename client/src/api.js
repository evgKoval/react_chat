import axios from "axios";

const token = localStorage.getItem("token") || "";

export default axios.create({
  baseURL: "http://ec2-3-124-187-242.eu-central-1.compute.amazonaws.com:5000",
  // baseURL: "http://localhost:5000",
  headers: { "x-access-token": token }
});
