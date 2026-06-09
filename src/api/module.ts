import request from './request'

export const moduleApi = {
  getList: () => request.get('/modules'),
  create: (data: any) => request.post('/modules', data),
  update: (id: number, data: any) => request.put(`/modules/${id}`, data),
  delete: (id: number) => request.delete(`/modules/${id}`),
  triggerUpdate: (id: number) => request.post(`/modules/${id}/trigger-update`),
}
