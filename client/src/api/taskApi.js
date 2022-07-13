import axiosClient from "./axiosClient";

const taskApi = {
  create: (boardId, params) => axiosClient.post(`/board/${boardId}/task`, params),
  updatePosition: (boardId, params) => axiosClient.put(`/board/${boardId}/task/update-position`, params),
  update: (boardId, taskId, params) => axiosClient.put(`/board/${boardId}/task/${taskId}`, params),
  delete: (boardId, taskId) => axiosClient.delete(`/board/${boardId}/task/${taskId}`),
}

export default taskApi;