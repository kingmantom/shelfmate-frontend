// src/axiosConfig.js
import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NODE_ENV === "production"
    ? "https://shelfmate-server.onrender.com" // כתובת האמיתית של הבאקאנד שלך
    : "http://localhost:4000",
});

export default instance;
