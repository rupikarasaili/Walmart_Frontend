import axios from "axios";

const backendClient = axios.create({
  baseURL: "http://localhost:3000",
});

backendClient.interceptors.request.use(async function (config) {
  try {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Error obtaining auth token in interceptor, ", error);
  }

  return config;
});

backendClient.interceptors.response.use(
  (response) =>
    new Promise((resolve) => {
      resolve(response);
    }),
  async (error) => {
    if (!error.response) {
      return new Promise((_, reject) => reject(error));
    }
    const path = window.location.pathname;
    if (error.response.status === 401) {
      localStorage.clear();
      window.location.href = `/users/login`;
    } else {
      return new Promise((_, reject) => reject(error));
    }
  }
);

export { backendClient };
