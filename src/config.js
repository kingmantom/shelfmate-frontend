import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NODE_ENV === "production"
    ? "https://shelfmate-server.onrender.com"
    : "http://localhost:3001",  // ← עדכון ל-3001
});

export default instance;
