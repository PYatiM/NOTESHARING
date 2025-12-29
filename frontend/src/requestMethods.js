import axios from "axios";

// 1. Get the Backend URL from Vercel's settings
// If it's not found (like on your laptop), fallback to localhost
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api/";

// 2. Define the Public Folder for images
// We take the API URL (e.g., .../api/) and replace "/api/" with "/images"
export const pf = process.env.REACT_APP_API_URL 
  ? process.env.REACT_APP_API_URL.replace("/api/", "/images") 
  : "http://localhost:8000/images";

// 3. Create the axios instances
export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
});