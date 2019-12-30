import axios from "axios";

const token = localStorage.getItem("token") || "";

export default axios.create({
  // baseURL: "https://reactchats:5000",
  baseURL: "http://localhost:5000",
  headers: { "x-access-token": token }
});
