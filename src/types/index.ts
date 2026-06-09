// ============ 文章 ============
export interface Article {
  id: number
  title: string
  type: 'quick_start' | 'guide' | 'faq'
  moduleId: number
  moduleName: string
  categoryId: number | null
  content: string
  coverImage: string | null
  steps: Step[] | null
  deeplink: string | null
  status: 'draft' | 'published' | 'archived' | 'pending_update'
  sortOrder: number
  createdBy: string
  updatedBy: string | null
  createdAt: string
  updatedAt: string
}

export interface Step {
  step: number
  title: string
  description: string
}

export interface ArticleListParams {
  page?: number
  page_size?: number
  type?: string
  module_id?: number
  status?: string
  keyword?: string
}

// ============ 分类 ============
export interface Category {
  id: number
  name: string
  type: 'guide_category' | 'faq_group'
  sortOrder: number
  description?: string
  articleCount?: number
}

// ============ 业务模块 ============
export interface BusinessModule {
  id: number
  name: string
  ownerId: number | null
  ownerName: string | null
  sortOrder: number
  articleCount?: number
  pendingUpdateCount?: number
  createdAt: string
}

// ============ 首页配置 ============
export interface HomeConfigData {
  greetingTitle: string
  greetingSubtitle: string
  categories: HomeCategory[]
  hotFaqIds: number[]
  hotKeywords: string[]
  bottomButtons: BottomButton[]
}

export interface HomeCategory {
  id: number
  name: string
  icon: string
  enabled: boolean
  sortOrder: number
}

export interface BottomButton {
  id: number
  name: string
  icon: string
  action: string
}

// ============ 基础设置 ============
export interface Settings {
  helpCenterName: string
  logo: string | null
  features: FeatureToggle[]
}

export interface FeatureToggle {
  key: string
  label: string
  enabled: boolean
}

// ============ 通用 ============
export interface ApiResponse<T> {
  code: number
  data: T
  message: string
}

export interface PaginatedData<T> {
  items: T[]
  total: number
  page: number
  page_size: number
}
