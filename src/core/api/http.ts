import axios from "axios";
import { env } from "@/core/config/env";

export const http = axios.create({
  baseURL: env.apiBaseUrl,
  // withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});