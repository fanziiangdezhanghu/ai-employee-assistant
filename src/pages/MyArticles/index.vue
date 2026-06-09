<template>
  <div class="my-articles">
    <div class="page-header" style="display:flex;justify-content:space-between;align-items:center">
      <div>
        <h1 class="page-header__title">我的文章</h1>
        <p style="color:#8C8C8C;font-size:13px;margin-top:4px">负责人视角 · 仅展示自己负责模块的文章</p>
      </div>
      <div class="my-articles__stats">
        <el-tag type="danger" size="large">
          待更新：{{ pendingCount }} 篇
        </el-tag>
      </div>
    </div>

    <!-- Banner：待更新提醒 -->
    <div v-if="pendingCount > 0" class="my-articles__banner">
      <el-icon :size="20" color="#FAAD14"><WarningFilled /></el-icon>
      <span>您有 <strong>{{ pendingCount }}</strong> 篇文章需要更新，请及时处理</span>
      <el-button size="small" type="primary" @click="showPendingOnly = !showPendingOnly">
        {{ showPendingOnly ? '查看全部' : '查看待更新' }}
      </el-button>
    </div>

    <!-- 筛选 -->
    <div class="page-card" style="margin-bottom:16px">
      <el-form :inline="true" size="default">
        <el-form-item label="类型">
          <el-select v-model="filterType" placeholder="全部" clearable style="width:140px">
            <el-option label="全部" value="" />
            <el-option label="快速上手" value="quick_start" />
            <el-option label="操作指南" value="guide" />
            <el-option label="常见问题" value="faq" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filterStatus" placeholder="全部" clearable style="width:140px">
            <el-option label="全部" value="" />
            <el-option label="草稿" value="draft" />
            <el-option label="已发布" value="published" />
            <el-option label="待更新" value="pending_update" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <!-- 批量操作 -->
    <div v-if="selectedIds.length > 0" class="my-articles__batch-bar">
      <span>已选 {{ selectedIds.length }} 项</span>
      <el-button size="small" @click="handleBatchMarkUpdated">批量标记已更新</el-button>
    </div>

    <!-- 表格 -->
    <div class="page-card" style="padding:0">
      <el-table
        :data="filteredArticles"
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="44" />
        <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
        <el-table-column label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="typeTagType(row.type)" size="small">{{ typeLabel(row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="moduleName" label="模块" width="100" />
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.status)" size="small">{{ statusLabel(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" width="140" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="$router.push(`/articles/edit/${row.id}`)">编辑</el-button>
            <el-button v-if="row.status === 'pending_update'" type="success" link size="small" @click="handleMarkUpdated(row)">标记已更新</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useModuleStore } from '@/stores/moduleStore'
import type { Article } from '@/types'

const moduleStore = useModuleStore()

const mockMyArticles = ref<Article[]>([
  { id: 1, title: '门店创建与配置', type: 'quick_start', moduleId: 1, moduleName: '基础使用', categoryId: null, content: '', coverImage: null, steps: null, deeplink: null, status: 'published', sortOrder: 1, createdBy: '管理员', updatedBy: null, createdAt: '2026-06-01', updatedAt: '2026-06-08' },
  { id: 2, title: '排班管理快速上手', type: 'quick_start', moduleId: 3, moduleName: '考勤排班', categoryId: null, content: '', coverImage: null, steps: null, deeplink: null, status: 'published', sortOrder: 2, createdBy: '张三', updatedBy: null, createdAt: '2026-06-02', updatedAt: '2026-06-07' },
  { id: 3, title: '忘记打卡怎么补卡', type: 'faq', moduleId: 3, moduleName: '考勤排班', categoryId: null, content: '', coverImage: null, steps: null, deeplink: null, status: 'pending_update', sortOrder: 3, createdBy: '李四', updatedBy: null, createdAt: '2026-06-04', updatedAt: '2026-06-06' },
  { id: 4, title: '如何添加新员工', type: 'guide', moduleId: 5, moduleName: '人事管理', categoryId: null, content: '', coverImage: null, steps: null, deeplink: null, status: 'pending_update', sortOrder: 4, createdBy: '王五', updatedBy: null, createdAt: '2026-06-06', updatedAt: '2026-06-01' },
  { id: 5, title: '收银台操作指南', type: 'guide', moduleId: 2, moduleName: '收银管理', categoryId: null, content: '', coverImage: null, steps: null, deeplink: null, status: 'published', sortOrder: 5, createdBy: '管理员', updatedBy: null, createdAt: '2026-06-07', updatedAt: '2026-06-07' },
])

const filterType = ref('')
const filterStatus = ref('')
const showPendingOnly = ref(false)
const selectedIds = ref<number[]>([])

const pendingCount = computed(() => mockMyArticles.value.filter((a) => a.status === 'pending_update').length)

const filteredArticles = computed(() => {
  let list = showPendingOnly.value
    ? mockMyArticles.value.filter((a) => a.status === 'pending_update')
    : mockMyArticles.value
  if (filterType.value) list = list.filter((a) => a.type === filterType.value)
  if (filterStatus.value) list = list.filter((a) => a.status === filterStatus.value)
  return list
})

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

function handleMarkUpdated(row: Article) {
  ElMessage.success(`「${row.title}」已标记为已更新`)
}

function handleBatchMarkUpdated() {
  if (selectedIds.value.length === 0) return ElMessage.warning('请选择文章')
  ElMessageBox.confirm(`确定将选中的 ${selectedIds.value.length} 篇文章标记为已更新？`, '确认', { type: 'warning' })
    .then(() => {
      ElMessage.success(`已标记 ${selectedIds.value.length} 篇文章为已更新`)
      selectedIds.value = []
    })
    .catch(() => {})
}

onMounted(() => {
  moduleStore.fetchModules()
})
</script>

<style scoped>
.my-articles {
  max-width: 1100px;
}

.my-articles__stats {
  display: flex;
  gap: 8px;
}

.my-articles__banner {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #FFFBE6;
  border: 1px solid #FFE58F;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #434343;
}

.my-articles__batch-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #fff;
  border: 1px solid #E6F4FF;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
}
</style>
