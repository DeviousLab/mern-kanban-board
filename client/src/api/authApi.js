import axiosClient from "./axiosClient";

const authApi = {
  register: params => axiosClient.post("/auth/register", params),
  login: params => axiosClient.post("/auth/login", params),
  verifyToken: () => axiosClient.get("/auth/verify-token"),
}

export default authApi;