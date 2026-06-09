import { defineStore } from 'pinia'
import { articleApi } from '@/api/article'
import type { Article, ArticleListParams } from '@/types'

interface ArticleState {
  articles: Article[]
  total: number
  loading: boolean
  filters: ArticleListParams
  currentArticle: Article | null
}

export const useArticleStore = defineStore('article', {
  state: (): ArticleState => ({
    articles: [],
    total: 0,
    loading: false,
    filters: { page: 1, page_size: 20 },
    currentArticle: null,
  }),

  actions: {
    setFilters(filters: ArticleListParams) {
      this.filters = filters
    },

    async fetchArticles() {
      this.loading = true
      try {
        const res: any = await articleApi.getList(this.filters)
        this.articles = res.data.items
        this.total = res.data.total
      } catch {
        // ignore
      } finally {
        this.loading = false
      }
    },

    async fetchArticleById(id: number) {
      const res: any = await articleApi.getById(id)
      this.currentArticle = res.data
    },

    async createArticle(data: Partial<Article>) {
      await articleApi.create(data)
      await this.fetchArticles()
    },

    async updateArticle(id: number, data: Partial<Article>) {
      await articleApi.update(id, data)
      await this.fetchArticles()
    },

    async deleteArticle(id: number) {
      await articleApi.delete(id)
      await this.fetchArticles()
    },

    async batchUpdateStatus(ids: number[], status: string) {
      await articleApi.batchUpdateStatus(ids, status)
      await this.fetchArticles()
    },
  },
})
