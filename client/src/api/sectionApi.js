import axiosClient from "./axiosClient";

const sectionApi = {
  create: (boardId) => axiosClient.post(`/board/${boardId}/section`),
  update: (boardId, sectionId, params) => axiosClient.put(`/board/${boardId}/section/${sectionId}`, params),
  delete: (boardId, sectionId) => axiosClient.delete(`/board/${boardId}/section/${sectionId}`),
}

export default sectionApi;