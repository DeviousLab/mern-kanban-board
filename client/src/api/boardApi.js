import axiosClient from "./axiosClient";

const boardApi = {
  create: () => axiosClient.post("/board"),
  getAll: () => axiosClient.get("/board"),
  updatePosition: (params) => axiosClient.put("/board", params),
  getOne: (id) => axiosClient.get(`/board/${id}`),
  update: (id, params) => axiosClient.put(`/board/${id}`, params),
}

export default boardApi;