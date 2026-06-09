import request from './request'
import type { Article, ArticleListParams } from '@/types'

export const articleApi = {
  getList: (params: ArticleListParams) => request.get('/articles', { params }),
  getById: (id: number) => request.get(`/articles/${id}`),
  create: (data: Partial<Article>) => request.post('/articles', data),
  update: (id: number, data: Partial<Article>) => request.put(`/articles/${id}`, data),
  delete: (id: number) => request.delete(`/articles/${id}`),
  batchUpdateStatus: (ids: number[], status: string) =>
    request.put('/articles/batch-status', { ids, status }),
}
