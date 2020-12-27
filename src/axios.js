import axios from "axios";

const instance = axios.create({
  baseURL: "https://ai-website-automation.herokuapp.com/",
});

export default instance;
