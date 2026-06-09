import request from './request'

export const categoryApi = {
  getList: (type?: string) => request.get('/categories', { params: { type } }),
  create: (data: any) => request.post('/categories', data),
  update: (id: number, data: any) => request.put(`/categories/${id}`, data),
  delete: (id: number) => request.delete(`/categories/${id}`),
  reorder: (ids: number[]) => request.put('/categories/reorder', { ids }),
}
