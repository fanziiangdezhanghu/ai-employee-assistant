<template>
  <div class="module-page">
    <div class="page-header" style="display:flex;justify-content:space-between;align-items:center">
      <h1 class="page-header__title">业务模块管理</h1>
      <el-button type="primary" @click="openCreate">+ 新建模块</el-button>
    </div>

    <div class="page-card" style="padding:0">
      <el-table :data="moduleStore.modules" v-loading="moduleStore.loading" stripe>
        <el-table-column type="index" label="排序" width="60" />
        <el-table-column prop="name" label="模块名称" min-width="140" />
        <el-table-column prop="ownerName" label="负责人" width="120">
          <template #default="{ row }">
            <span v-if="row.ownerName">{{ row.ownerName }}</span>
            <el-tag v-else size="small" type="info">未分配</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="articleCount" label="文章数" width="80" align="center" />
        <el-table-column label="待更新" width="80" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.pendingUpdateCount && row.pendingUpdateCount > 0" type="danger" size="small">
              {{ row.pendingUpdateCount }}
            </el-tag>
            <span v-else style="color:#BFBFBF">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="120" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="openEdit(row)">编辑</el-button>
            <el-button type="warning" link size="small" @click="handleTriggerUpdate(row)">发版提醒</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新建/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="isEditing ? '编辑模块' : '新建模块'" width="480px">
      <el-form :model="dialogForm" label-width="100px">
        <el-form-item label="模块名称" required>
          <el-input v-model="dialogForm.name" placeholder="请输入模块名称" maxlength="20" />
        </el-form-item>
        <el-form-item label="负责人">
          <el-select v-model="dialogForm.ownerName" placeholder="选择负责人" clearable style="width:240px">
            <el-option label="张三" value="张三" />
            <el-option label="李四" value="李四" />
            <el-option label="王五" value="王五" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveModule">保存</el-button>
      </template>
    </el-dialog>

    <!-- 发版提醒确认 -->
    <el-dialog v-model="updateDialogVisible" title="发版提醒" width="420px">
      <p style="margin-bottom:16px;color:#434343">
        将触发「{{ triggerModuleName }}」模块的发版提醒，该模块下所有已发布文章将标记为「待更新」。
      </p>
      <template #footer>
        <el-button @click="updateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmTriggerUpdate">确认触发</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useModuleStore } from '@/stores/moduleStore'

const moduleStore = useModuleStore()

const dialogVisible = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)
const dialogForm = reactive({ name: '', ownerName: '' })

const updateDialogVisible = ref(false)
const triggerModuleId = ref<number>(0)
const triggerModuleName = ref('')

function openCreate() {
  isEditing.value = false
  editingId.value = null
  dialogForm.name = ''
  dialogForm.ownerName = ''
  dialogVisible.value = true
}

function openEdit(row: any) {
  isEditing.value = true
  editingId.value = row.id
  dialogForm.name = row.name
  dialogForm.ownerName = row.ownerName || ''
  dialogVisible.value = true
}

async function handleSaveModule() {
  if (!dialogForm.name.trim()) return ElMessage.warning('请输入模块名称')
  ElMessage.success(isEditing.value ? '更新成功' : '创建成功')
  dialogVisible.value = false
}

function handleTriggerUpdate(row: any) {
  triggerModuleId.value = row.id
  triggerModuleName.value = row.name
  updateDialogVisible.value = true
}

async function confirmTriggerUpdate() {
  await moduleStore.triggerUpdate(triggerModuleId.value)
  ElMessage.success(`已触发「${triggerModuleName.value}」发版提醒，文章已标记为待更新`)
  updateDialogVisible.value = false
}

function handleDelete(row: any) {
  ElMessageBox.confirm(`确定删除模块「${row.name}」？模块下的文章不会删除。`, '确认', { type: 'warning' })
    .then(async () => {
      await moduleStore.deleteModule(row.id)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}

onMounted(() => {
  moduleStore.fetchModules()
})
</script>
