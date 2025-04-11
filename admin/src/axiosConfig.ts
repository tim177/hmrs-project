import axios from "axios";

const isProduction = import.meta.env.PROD;

axios.defaults.withCredentials = true;

axios.defaults.baseURL = isProduction
  ? "https://your-render-backend.onrender.com" // ✅ Render deployed backend URL
  : "http://localhost:5000"; // ✅ Local dev backend

export default axios;
