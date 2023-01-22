import axios from "axios";

export const api = axios.create({
  baseURL: "http://2.tcp.eu.ngrok.io:18265",
});
