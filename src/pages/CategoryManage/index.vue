<template>
  <div class="category-page">
    <div class="page-header">
      <h1 class="page-header__title">分类管理</h1>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <!-- 操作指南分类 -->
      <div class="page-card">
        <div class="category-page__header">
          <h3>操作指南分类</h3>
          <el-button size="small" type="primary" @click="openCreate('guide_category')">+ 新增</el-button>
        </div>

        <el-table :data="catStore.guideCategories" v-loading="catStore.loading" stripe>
          <el-table-column type="index" label="排序" width="60" />
          <el-table-column prop="name" label="分类名称" min-width="120" />
          <el-table-column prop="articleCount" label="文章数" width="80" align="center" />
          <el-table-column label="操作" width="100">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="openEdit(row)">编辑</el-button>
              <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- FAQ分组 -->
      <div class="page-card">
        <div class="category-page__header">
          <h3>FAQ分组</h3>
          <el-button size="small" type="primary" @click="openCreate('faq_group')">+ 新增</el-button>
        </div>

        <el-table :data="catStore.faqGroups" v-loading="catStore.loading" stripe>
          <el-table-column type="index" label="排序" width="60" />
          <el-table-column prop="name" label="分组名称" min-width="120" />
          <el-table-column prop="articleCount" label="文章数" width="80" align="center" />
          <el-table-column label="操作" width="100">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="openEdit(row)">编辑</el-button>
              <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 新建/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="isEditing ? '编辑分类' : '新建分类'" width="400px">
      <el-form :model="dialogForm" label-width="80px">
        <el-form-item label="名称" required>
          <el-input v-model="dialogForm.name" placeholder="请输入名称" maxlength="20" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveCategory">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCategoryStore } from '@/stores/categoryStore'

const catStore = useCategoryStore()

const dialogVisible = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)
const editingType = ref<'guide_category' | 'faq_group'>('guide_category')
const dialogForm = reactive({ name: '' })

function openCreate(type: 'guide_category' | 'faq_group') {
  isEditing.value = false
  editingId.value = null
  editingType.value = type
  dialogForm.name = ''
  dialogVisible.value = true
}

function openEdit(row: any) {
  isEditing.value = true
  editingId.value = row.id
  editingType.value = row.type
  dialogForm.name = row.name
  dialogVisible.value = true
}

async function handleSaveCategory() {
  if (!dialogForm.name.trim()) return ElMessage.warning('请输入名称')
  try {
    if (isEditing.value && editingId.value) {
      await catStore.updateCategory(editingId.value, { name: dialogForm.name })
      ElMessage.success('更新成功')
    } else {
      await catStore.createCategory({ name: dialogForm.name, type: editingType.value })
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
  } catch {
    ElMessage.error('操作失败')
  }
}

function handleDelete(row: any) {
  ElMessageBox.confirm(`确定删除「${row.name}」？`, '确认', { type: 'warning' })
    .then(async () => {
      await catStore.deleteCategory(row.id)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}

onMounted(() => {
  catStore.fetchCategories()
})
</script>

<style scoped>
.category-page__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.category-page__header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}
</style>
