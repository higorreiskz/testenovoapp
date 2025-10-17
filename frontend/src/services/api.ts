import axios from "axios";
import useAuthStore from "../store/useAuthStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api",
});

type MaybePromise<T> = T | Promise<T>;

api.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export function delay<T>(value: MaybePromise<T>, ms = 300): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        resolve(await value);
      } catch (err) {
        reject(err);
      }
    }, ms);
  });
}

export default api;
