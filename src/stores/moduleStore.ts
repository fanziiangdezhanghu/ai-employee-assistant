import { defineStore } from 'pinia'
import { moduleApi } from '@/api/module'
import type { BusinessModule } from '@/types'

interface ModuleState {
  modules: BusinessModule[]
  loading: boolean
}

export const useModuleStore = defineStore('module', {
  state: (): ModuleState => ({
    modules: [],
    loading: false,
  }),

  getters: {
    pendingUpdateTotal: (state) =>
      state.modules.reduce((sum, m) => sum + (m.pendingUpdateCount || 0), 0),
  },

  actions: {
    async fetchModules() {
      this.loading = true
      try {
        await new Promise((r) => setTimeout(r, 300))
        this.modules = [
          { id: 1, name: '基础使用', ownerId: 1, ownerName: '张三', sortOrder: 1, articleCount: 12, pendingUpdateCount: 0, createdAt: '2026-01-01' },
          { id: 2, name: '收银管理', ownerId: 2, ownerName: '李四', sortOrder: 2, articleCount: 8, pendingUpdateCount: 1, createdAt: '2026-01-01' },
          { id: 3, name: '考勤排班', ownerId: 1, ownerName: '张三', sortOrder: 3, articleCount: 10, pendingUpdateCount: 2, createdAt: '2026-01-01' },
          { id: 4, name: '运营管理', ownerId: 3, ownerName: '王五', sortOrder: 4, articleCount: 9, pendingUpdateCount: 0, createdAt: '2026-01-01' },
          { id: 5, name: '人事管理', ownerId: null, ownerName: null, sortOrder: 5, articleCount: 6, pendingUpdateCount: 0, createdAt: '2026-01-01' },
          { id: 6, name: '薪酬管理', ownerId: null, ownerName: null, sortOrder: 6, articleCount: 5, pendingUpdateCount: 0, createdAt: '2026-01-01' },
          { id: 7, name: '厨政管理', ownerId: 2, ownerName: '李四', sortOrder: 7, articleCount: 7, pendingUpdateCount: 0, createdAt: '2026-01-01' },
        ]
      } catch {
        // ignore
      } finally {
        this.loading = false
      }
    },

    async createModule(data: Partial<BusinessModule>) {
      await moduleApi.create(data)
      await this.fetchModules()
    },

    async updateModule(id: number, data: Partial<BusinessModule>) {
      await moduleApi.update(id, data)
      await this.fetchModules()
    },

    async deleteModule(id: number) {
      await moduleApi.delete(id)
      await this.fetchModules()
    },

    async triggerUpdate(id: number) {
      await moduleApi.triggerUpdate(id)
      await this.fetchModules()
    },
  },
})
