<template>
  <div class="article-edit">
    <div class="page-header">
      <h1 class="page-header__title">{{ isEdit ? '编辑文章' : '新建文章' }}</h1>
    </div>

    <!-- 基本信息 -->
    <div class="page-card" style="margin-bottom:16px">
      <el-form :model="form" label-position="top" style="max-width:720px">
        <el-form-item label="文章标题" required>
          <el-input v-model="form.title" placeholder="请输入文章标题" maxlength="100" show-word-limit />
        </el-form-item>

        <el-form-item label="文章类型" required>
          <el-radio-group v-model="form.type" @change="handleTypeChange">
            <el-radio value="quick_start">快速上手</el-radio>
            <el-radio value="guide">操作指南</el-radio>
            <el-radio value="faq">常见问题</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="业务模块" required>
          <el-select v-model="form.moduleId" placeholder="请选择业务模块" style="width:240px">
            <el-option v-for="m in moduleStore.modules" :key="m.id" :label="m.name" :value="m.id" />
          </el-select>
        </el-form-item>

        <!-- 封面图（快速上手必填，其他可选） -->
        <el-form-item :label="'封面图片' + (form.type === 'quick_start' ? ' *' : '')" :required="form.type === 'quick_start'">
          <div class="upload-placeholder" @click="handleUpload">
            <el-icon :size="24"><Plus /></el-icon>
            <span>点击上传</span>
            <span class="upload-placeholder__hint">支持 jpg/png，5MB以内</span>
          </div>
          <div v-if="form.coverImage" class="upload-preview">
            <img :src="form.coverImage" alt="封面" />
            <el-button text size="small" type="danger" @click="form.coverImage = ''">删除</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <!-- 文章内容 - 富文本 -->
    <div class="page-card" style="margin-bottom:16px">
      <h3 style="margin-bottom:12px;font-size:15px;font-weight:600;color:#262626">文章内容</h3>
      <el-input
        v-model="form.content"
        type="textarea"
        :rows="12"
        placeholder="请输入文章内容（支持HTML）"
        style="width:100%"
      />
    </div>

    <!-- 操作步骤（仅快速上手） -->
    <div v-if="form.type === 'quick_start'" class="page-card" style="margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <h3 style="font-size:15px;font-weight:600;color:#262626">操作步骤</h3>
        <el-button size="small" @click="addStep">+ 添加步骤</el-button>
      </div>

      <div v-for="(step, idx) in form.steps" :key="idx" class="step-item">
        <div class="step-item__header">
          <span class="step-item__num">步骤 {{ idx + 1 }}</span>
          <el-button text size="small" type="danger" :disabled="form.steps.length <= 1" @click="removeStep(idx)">删除</el-button>
        </div>
        <el-input v-model="step.title" placeholder="步骤标题" style="margin-bottom:8px" />
        <el-input v-model="step.description" type="textarea" :rows="2" placeholder="步骤描述" />
      </div>
    </div>

    <!-- 跳转配置（快速上手+操作指南） -->
    <div v-if="form.type === 'quick_start' || form.type === 'guide'" class="page-card" style="margin-bottom:16px">
      <h3 style="font-size:15px;font-weight:600;color:#262626;margin-bottom:12px">跳转配置</h3>
      <el-form>
        <el-form-item label="「去试试」跳转路径">
          <el-input v-model="form.deeplink" placeholder="如 /store/create" style="width:400px" />
        </el-form-item>
      </el-form>
    </div>

    <!-- 操作按钮 -->
    <div class="page-card" style="display:flex;gap:12px;justify-content:flex-end">
      <el-button @click="$router.back()">取消</el-button>
      <el-button @click="handleSave('draft')">保存草稿</el-button>
      <el-button type="primary" @click="handleSave('published')">发布</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useModuleStore } from '@/stores/moduleStore'
import type { Step } from '@/types'

const route = useRoute()
const router = useRouter()
const moduleStore = useModuleStore()

const isEdit = computed(() => !!route.params.id)

const form = reactive({
  title: '',
  type: 'quick_start' as 'quick_start' | 'guide' | 'faq',
  moduleId: undefined as number | undefined,
  coverImage: '',
  content: '',
  steps: [{ step: 1, title: '', description: '' }] as Step[],
  deeplink: '',
})

// 类型切换时保留数据
const savedSteps = ref<Step[]>([{ step: 1, title: '', description: '' }])
const savedDeeplink = ref('')

function handleTypeChange(val: string) {
  if (val === 'quick_start') {
    // 切换回快速上手，恢复已保存的步骤和跳转配置
    form.steps = savedSteps.value.length > 0 ? savedSteps.value : [{ step: 1, title: '', description: '' }]
    form.deeplink = savedDeeplink.value
  } else if (val === 'guide') {
    // 保存步骤数据，隐藏步骤块
    savedSteps.value = form.steps
    form.steps = []
    form.deeplink = savedDeeplink.value
  } else {
    // faq：保存步骤和跳转配置，全部隐藏
    savedSteps.value = form.steps
    savedDeeplink.value = form.deeplink
    form.steps = []
    form.deeplink = ''
  }
}

function addStep() {
  form.steps.push({ step: form.steps.length + 1, title: '', description: '' })
}

function removeStep(idx: number) {
  form.steps.splice(idx, 1)
  form.steps.forEach((s, i) => (s.step = i + 1))
}

function handleUpload() {
  ElMessage.info('图片上传功能待对接（演示）')
}

function handleSave(status: string) {
  if (!form.title) return ElMessage.warning('请输入文章标题')
  if (!form.moduleId) return ElMessage.warning('请选择业务模块')
  if (!form.content) return ElMessage.warning('请输入文章内容')
  if (form.type === 'quick_start' && !form.coverImage) return ElMessage.warning('快速上手类型必须上传封面图片')

  ElMessage.success(status === 'published' ? '发布成功' : '草稿已保存')
  router.push('/articles')
}

onMounted(() => {
  moduleStore.fetchModules()
})
</script>

<style scoped>
.article-edit {
  max-width: 900px;
}

.upload-placeholder {
  width: 240px;
  height: 140px;
  border: 2px dashed #D9D9D9;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  color: #8C8C8C;
  font-size: 14px;
  transition: border-color 0.2s;
}

.upload-placeholder:hover {
  border-color: var(--accent-primary);
  color: var(--accent-primary);
}

.upload-placeholder__hint {
  font-size: 12px;
  color: #BFBFBF;
}

.upload-preview {
  margin-top: 8px;
}

.upload-preview img {
  max-width: 240px;
  border-radius: 8px;
  display: block;
  margin-bottom: 8px;
}

.step-item {
  background: #FAFAFA;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
}

.step-item__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.step-item__num {
  font-size: 14px;
  font-weight: 600;
  color: var(--accent-primary);
}
</style>
