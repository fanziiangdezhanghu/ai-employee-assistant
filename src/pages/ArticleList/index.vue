<template>
  <div class="article-list">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-header__title">文章管理</h1>
    </div>

    <!-- 筛选区 -->
    <div class="page-card article-list__filters">
      <el-form :inline="true" :model="filters" size="default">
        <el-form-item label="类型">
          <el-select v-model="filters.type" placeholder="全部" clearable style="width:140px">
            <el-option label="全部" value="" />
            <el-option label="快速上手" value="quick_start" />
            <el-option label="操作指南" value="guide" />
            <el-option label="常见问题" value="faq" />
          </el-select>
        </el-form-item>
        <el-form-item label="模块">
          <el-select v-model="filters.module_id" placeholder="全部" clearable style="width:140px">
            <el-option label="全部" :value="undefined" />
            <el-option v-for="m in modules" :key="m.id" :label="m.name" :value="m.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.status" placeholder="全部" clearable style="width:140px">
            <el-option label="全部" value="" />
            <el-option label="草稿" value="draft" />
            <el-option label="已发布" value="published" />
            <el-option label="已下架" value="archived" />
            <el-option label="待更新" value="pending_update" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.keyword" placeholder="搜索标题/内容" clearable style="width:240px" @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
        <el-form-item style="margin-left:auto">
          <el-button type="primary" @click="$router.push('/articles/new')"><el-icon><Plus /></el-icon>新建文章</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 批量操作栏 -->
    <div v-if="selectedIds.length > 0" class="article-list__batch-bar">
      <span class="article-list__batch-info">已选 {{ selectedIds.length }} 项</span>
      <el-button size="small" @click="handleBatch('published')">批量发布</el-button>
      <el-button size="small" @click="handleBatch('archived')">批量下架</el-button>
      <el-button size="small" @click="handleBatch('published', true)">批量标记已更新</el-button>
    </div>

    <!-- 表格 -->
    <div class="page-card" style="padding:0">
      <el-table
        :data="mockArticles"
        v-loading="loading"
        row-key="id"
        @selection-change="handleSelectionChange"
        stripe
        style="width:100%"
      >
        <el-table-column type="selection" width="44" />
        <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
        <el-table-column label="类型" width="120">
          <template #default="{ row }">
            <el-tag :type="typeTagType(row.type)" size="small">{{ typeLabel(row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="moduleName" label="模块" width="120" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.status)" size="small">{{ statusLabel(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" width="160" />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="$router.push(`/articles/edit/${row.id}`)">编辑</el-button>
            <el-button type="danger" link size="small" :disabled="row.status === 'published'" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="article-list__pagination">
        <span>共 {{ total }} 条</span>
        <el-pagination
          v-model:current-page="filters.page"
          :page-size="20"
          :total="total"
          layout="prev, pager, next"
          small
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useArticleStore } from '@/stores/articleStore'
import { useModuleStore } from '@/stores/moduleStore'
import type { Article } from '@/types'

const articleStore = useArticleStore()
const moduleStore = useModuleStore()

const filters = reactive({
  type: '',
  module_id: undefined as number | undefined,
  status: '',
  keyword: '',
  page: 1,
  page_size: 20,
})

const selectedIds = ref<number[]>([])

// Mock 数据（待对接API后移除）
const mockArticles = ref<Article[]>([
  { id: 1, title: '门店创建与配置', type: 'quick_start', moduleId: 1, moduleName: '基础使用', categoryId: null, content: '', coverImage: null, steps: null, deeplink: null, status: 'published', sortOrder: 1, createdBy: '管理员', updatedBy: null, createdAt: '2026-06-01', updatedAt: '2026-06-08' },
  { id: 2, title: '排班管理快速上手', type: 'quick_start', moduleId: 3, moduleName: '考勤排班', categoryId: null, content: '', coverImage: null, steps: null, deeplink: null, status: 'draft', sortOrder: 2, createdBy: '张三', updatedBy: null, createdAt: '2026-06-02', updatedAt: '2026-06-07' },
  { id: 3, title: '巡店报告怎么填写', type: 'guide', moduleId: 4, moduleName: '运营管理', categoryId: null, content: '', coverImage: null, steps: null, deeplink: null, status: 'pending_update', sortOrder: 3, createdBy: '管理员', updatedBy: null, createdAt: '2026-06-03', updatedAt: '2026-06-05' },
  { id: 4, title: '忘记打卡怎么补卡', type: 'faq', moduleId: 3, moduleName: '考勤排班', categoryId: null, content: '', coverImage: null, steps: null, deeplink: null, status: 'published', sortOrder: 4, createdBy: '李四', updatedBy: null, createdAt: '2026-06-04', updatedAt: '2026-06-06' },
  { id: 5, title: '工资条在哪里查看', type: 'faq', moduleId: 6, moduleName: '薪酬管理', categoryId: null, content: '', coverImage: null, steps: null, deeplink: null, status: 'published', sortOrder: 5, createdBy: '管理员', updatedBy: null, createdAt: '2026-06-05', updatedAt: '2026-06-03' },
  { id: 6, title: '如何添加新员工', type: 'guide', moduleId: 5, moduleName: '人事管理', categoryId: null, content: '', coverImage: null, steps: null, deeplink: null, status: 'pending_update', sortOrder: 6, createdBy: '王五', updatedBy: null, createdAt: '2026-06-06', updatedAt: '2026-06-01' },
  { id: 7, title: '收银台操作指南', type: 'guide', moduleId: 2, moduleName: '收银管理', categoryId: null, content: '', coverImage: null, steps: null, deeplink: null, status: 'published', sortOrder: 7, createdBy: '管理员', updatedBy: null, createdAt: '2026-06-07', updatedAt: '2026-06-07' },
  { id: 8, title: '如何修改门店信息', type: 'faq', moduleId: 1, moduleName: '基础使用', categoryId: null, content: '', coverImage: null, steps: null, deeplink: null, status: 'archived', sortOrder: 8, createdBy: '管理员', updatedBy: null, createdAt: '2026-06-08', updatedAt: '2026-06-02' },
])

const loading = ref(false)
const total = computed(() => mockArticles.value.length)
const modules = computed(() => moduleStore.modules)

function typeLabel(type: string) {
  const map: Record<string, string> = { quick_start: '快速上手', guide: '操作指南', faq: '常见问题' }
  return map[type] || type
}

function typeTagType(type: string) {
  const map: Record<string, string> = { quick_start: 'warning', guide: 'primary', faq: 'success' }
  return map[type] || ''
}

function statusLabel(status: string) {
  const map: Record<string, string> = { draft: '草稿', published: '已发布', archived: '已下架', pending_update: '待更新' }
  return map[status] || status
}

function statusTagType(status: string) {
  const map: Record<string, string> = { draft: 'info', published: 'success', archived: 'warning', pending_update: 'danger' }
  return map[status] || ''
}

function handleSelectionChange(rows: Article[]) {
  selectedIds.value = rows.map((r) => r.id)
}

function handleSearch() {
  // 搜索逻辑
}

function handleReset() {
  filters.type = ''
  filters.module_id = undefined
  filters.status = ''
  filters.keyword = ''
  filters.page = 1
}

async function handleBatch(status: string, isMarkUpdated = false) {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择文章')
    return
  }
  const label = isMarkUpdated ? '批量标记已更新' : status === 'published' ? '批量发布' : '批量下架'
  try {
    await ElMessageBox.confirm(`确定${label}选中的 ${selectedIds.value.length} 篇文章？`, '确认', { type: 'warning' })
    ElMessage.success(`${label}成功（演示）`)
    selectedIds.value = []
  } catch {
    // 取消
  }
}

function handleDelete(row: Article) {
  ElMessageBox.confirm(`确定删除「${row.title}」？此操作不可恢复。`, '删除确认', { type: 'error' })
    .then(() => ElMessage.success('删除成功（演示）'))
    .catch(() => {})
}

onMounted(() => {
  moduleStore.fetchModules()
})
</script>

<style scoped>
.article-list {
  max-width: 1200px;
}

.article-list__filters {
  margin-bottom: 16px;
}

.article-list__batch-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #fff;
  border: 1px solid #E6F4FF;
  border-radius: 8px;
  margin-bottom: 16px;
}

.article-list__batch-info {
  font-size: 14px;
  color: #1677FF;
  margin-right: 8px;
}

.article-list__pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  font-size: 14px;
  color: #8C8C8C;
}

:deep(.el-form) {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

:deep(.el-form-item) {
  margin-bottom: 0;
}
</style>
