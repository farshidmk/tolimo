import axios from "axios";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3008";
// process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3008";

// Create Axios instance
export const api = axios.create({
  baseURL: API_URL,
  // withCredentials: true,
});
