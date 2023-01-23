import axios from "axios";

export const api = axios.create({
  baseURL: "http://6.tcp.eu.ngrok.io:10306",
});
