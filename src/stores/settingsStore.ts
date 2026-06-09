import { defineStore } from 'pinia'
import { homeConfigApi, settingsApi } from '@/api/settings'
import type { HomeConfigData, Settings } from '@/types'

interface SettingsState {
  homeConfig: HomeConfigData | null
  settings: Settings | null
  loading: boolean
}

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsState => ({
    homeConfig: null,
    settings: null,
    loading: false,
  }),

  actions: {
    async fetchHomeConfig() {
      this.loading = true
      try {
        await new Promise((r) => setTimeout(r, 300))
        this.homeConfig = {
          greetingTitle: 'Hi~，有什么可以帮您！',
          greetingSubtitle: '7×24小时为您服务',
          categories: [
            { id: 1, name: '基础使用', icon: 'Setting', enabled: true, sortOrder: 1 },
            { id: 2, name: '经营分析', icon: 'DataAnalysis', enabled: true, sortOrder: 2 },
            { id: 3, name: '系统设置', icon: 'Tools', enabled: true, sortOrder: 3 },
          ],
          hotFaqIds: [1, 3, 5],
          hotKeywords: ['排班', '打卡', '薪资', '调班', '巡店'],
          bottomButtons: [
            { id: 1, name: '在线咨询', icon: 'ChatDotSquare', action: 'service' },
            { id: 2, name: '意见反馈', icon: 'Edit', action: 'feedback' },
          ],
        }
      } catch {
        // ignore
      } finally {
        this.loading = false
      }
    },

    async updateHomeConfig(data: HomeConfigData) {
      await homeConfigApi.update(data)
      this.homeConfig = data
    },

    async fetchSettings() {
      this.loading = true
      try {
        await new Promise((r) => setTimeout(r, 300))
        this.settings = {
          helpCenterName: '翻台宝帮助中心',
          logo: null,
          features: [
            { key: 'ai_chat', label: 'AI智能客服', enabled: false },
            { key: 'hot_search', label: '热门搜索', enabled: true },
            { key: 'feedback', label: '意见反馈', enabled: true },
            { key: 'quick_start', label: '快速上手', enabled: true },
          ],
        }
      } catch {
        // ignore
      } finally {
        this.loading = false
      }
    },

    async updateSettings(data: Settings) {
      await settingsApi.update(data)
      this.settings = data
    },
  },
})
