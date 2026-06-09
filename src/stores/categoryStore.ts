import { defineStore } from 'pinia'
import { categoryApi } from '@/api/category'
import type { Category } from '@/types'

interface CategoryState {
  guideCategories: Category[]
  faqGroups: Category[]
  loading: boolean
}

export const useCategoryStore = defineStore('category', {
  state: (): CategoryState => ({
    guideCategories: [],
    faqGroups: [],
    loading: false,
  }),

  actions: {
    async fetchCategories() {
      this.loading = true
      try {
        // 模拟数据
        await new Promise((r) => setTimeout(r, 300))
        this.guideCategories = [
          { id: 1, name: '门店配置', type: 'guide_category', sortOrder: 1, articleCount: 3 },
          { id: 2, name: '收银操作', type: 'guide_category', sortOrder: 2, articleCount: 5 },
          { id: 3, name: '排班管理', type: 'guide_category', sortOrder: 3, articleCount: 4 },
          { id: 4, name: '巡店流程', type: 'guide_category', sortOrder: 4, articleCount: 2 },
          { id: 5, name: '薪酬查询', type: 'guide_category', sortOrder: 5, articleCount: 3 },
        ]
        this.faqGroups = [
          { id: 6, name: '账号相关', type: 'faq_group', sortOrder: 1, articleCount: 4 },
          { id: 7, name: '考勤打卡', type: 'faq_group', sortOrder: 2, articleCount: 6 },
          { id: 8, name: '薪资问题', type: 'faq_group', sortOrder: 3, articleCount: 3 },
          { id: 9, name: '其他问题', type: 'faq_group', sortOrder: 4, articleCount: 5 },
        ]
      } catch {
        // ignore
      } finally {
        this.loading = false
      }
    },

    async createCategory(data: Partial<Category>) {
      await categoryApi.create(data)
      await this.fetchCategories()
    },

    async updateCategory(id: number, data: Partial<Category>) {
      await categoryApi.update(id, data)
      await this.fetchCategories()
    },

    async deleteCategory(id: number) {
      await categoryApi.delete(id)
      await this.fetchCategories()
    },

    async reorderCategories(ids: number[]) {
      await categoryApi.reorder(ids)
      await this.fetchCategories()
    },
  },
})
