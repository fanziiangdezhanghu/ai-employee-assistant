<template>
  <div class="home-config">
    <div class="page-header" style="display:flex;justify-content:space-between;align-items:center">
      <h1 class="page-header__title">首页配置</h1>
      <el-button type="primary" @click="handleSave">保存配置</el-button>
    </div>

    <el-skeleton :loading="loading" animated :count="4">
      <template #default>
        <!-- 问候区域 -->
        <div class="page-card" style="margin-bottom:16px">
          <h3 class="section-title">问候区域</h3>
          <el-form :model="config" label-width="120px">
            <el-form-item label="问候标题">
              <el-input v-model="config.greetingTitle" style="width:400px" />
            </el-form-item>
            <el-form-item label="问候副标题">
              <el-input v-model="config.greetingSubtitle" style="width:400px" />
            </el-form-item>
          </el-form>
        </div>

        <!-- 分类图标 -->
        <div class="page-card" style="margin-bottom:16px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
            <h3 class="section-title" style="margin-bottom:0">分类图标</h3>
            <el-button size="small" @click="addCategory">+ 添加分类</el-button>
          </div>

          <div class="home-config__categories">
            <div v-for="(cat, idx) in config.categories" :key="cat.id" class="home-config__category-item">
              <div class="home-config__category-sort">{{ idx + 1 }}</div>
              <el-switch v-model="cat.enabled" size="small" style="margin-right:8px" />
              <el-input v-model="cat.name" placeholder="分类名称" size="small" style="width:120px;margin-right:8px" />
              <el-select v-model="cat.icon" placeholder="图标" size="small" style="width:120px;margin-right:8px">
                <el-option label="设置" value="Setting" />
                <el-option label="分析" value="DataAnalysis" />
                <el-option label="工具" value="Tools" />
                <el-option label="首页" value="HomeFilled" />
              </el-select>
              <el-button text type="danger" size="small" @click="removeCategory(idx)">删除</el-button>
            </div>
          </div>
        </div>

        <!-- 热门FAQ推荐 -->
        <div class="page-card" style="margin-bottom:16px">
          <h3 class="section-title">热门FAQ推荐</h3>
          <div class="home-config__hint">从FAQ库中选择文章推荐到首页</div>
          <div class="home-config__hot-faqs">
            <el-tag
              v-for="id in config.hotFaqIds"
              :key="id"
              closable
              type="primary"
              style="margin-right:8px;margin-bottom:8px"
              @close="removeFaq(id)"
            >
              FAQ #{{ id }}
            </el-tag>
            <el-button size="small" @click="showFaqSelector = true">+ 选择</el-button>
          </div>
        </div>

        <!-- 热搜词 -->
        <div class="page-card" style="margin-bottom:16px">
          <h3 class="section-title">热搜词</h3>
          <div class="home-config__keywords">
            <div v-for="(kw, idx) in config.hotKeywords" :key="idx" class="home-config__keyword-item">
              <el-input v-model="config.hotKeywords[idx]" placeholder="热搜词" size="small" style="width:200px" />
              <el-button text type="danger" size="small" @click="config.hotKeywords.splice(idx, 1)">删除</el-button>
            </div>
            <el-button size="small" style="margin-top:8px" @click="config.hotKeywords.push('')">+ 添加热搜词</el-button>
          </div>
        </div>

        <!-- 底部操作栏 -->
        <div class="page-card" style="margin-bottom:16px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
            <h3 class="section-title" style="margin-bottom:0">底部操作栏</h3>
            <el-button size="small" @click="addBottomBtn">+ 添加按钮</el-button>
          </div>

          <div class="home-config__bottom-btns">
            <div v-for="(btn, idx) in config.bottomButtons" :key="btn.id" class="home-config__btn-item">
              <span class="home-config__btn-num">{{ idx + 1 }}</span>
              <el-input v-model="btn.name" placeholder="按钮名称" size="small" style="width:140px;margin-right:8px" />
              <el-select v-model="btn.icon" placeholder="图标" size="small" style="width:120px;margin-right:8px">
                <el-option label="客服" value="ChatDotSquare" />
                <el-option label="编辑" value="Edit" />
                <el-option label="消息" value="Message" />
              </el-select>
              <el-select v-model="btn.action" placeholder="动作" size="small" style="width:140px;margin-right:8px">
                <el-option label="在线咨询" value="service" />
                <el-option label="意见反馈" value="feedback" />
                <el-option label="URL跳转" value="url" />
              </el-select>
              <el-button text type="danger" size="small" @click="config.bottomButtons.splice(idx, 1)">删除</el-button>
            </div>
          </div>
        </div>
      </template>
    </el-skeleton>

    <!-- FAQ选择器 -->
    <el-dialog v-model="showFaqSelector" title="选择FAQ推荐" width="500px">
      <div class="faq-selector__list">
        <el-checkbox-group v-model="selectedFaqIds">
          <el-checkbox v-for="i in 10" :key="i" :value="i" style="margin-bottom:8px">
            FAQ问题示例 {{ i }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <template #footer>
        <el-button @click="showFaqSelector = false">取消</el-button>
        <el-button type="primary" @click="confirmFaqs">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useSettingsStore } from '@/stores/settingsStore'
import type { HomeCategory, BottomButton } from '@/types'

const settingsStore = useSettingsStore()

const config = reactive({
  greetingTitle: '',
  greetingSubtitle: '',
  categories: [] as HomeCategory[],
  hotFaqIds: [] as number[],
  hotKeywords: [] as string[],
  bottomButtons: [] as BottomButton[],
})

const loading = ref(true)
const showFaqSelector = ref(false)
const selectedFaqIds = ref<number[]>([])

function loadConfig() {
  if (settingsStore.homeConfig) {
    const hc = settingsStore.homeConfig
    config.greetingTitle = hc.greetingTitle
    config.greetingSubtitle = hc.greetingSubtitle
    config.categories = hc.categories.map((c) => ({ ...c }))
    config.hotFaqIds = [...hc.hotFaqIds]
    config.hotKeywords = [...hc.hotKeywords]
    config.bottomButtons = hc.bottomButtons.map((b) => ({ ...b }))
  }
}

function addCategory() {
  config.categories.push({
    id: Date.now(),
    name: '',
    icon: 'Setting',
    enabled: true,
    sortOrder: config.categories.length + 1,
  })
}

function removeCategory(idx: number) {
  config.categories.splice(idx, 1)
}

function removeFaq(id: number) {
  config.hotFaqIds = config.hotFaqIds.filter((i) => i !== id)
}

function addBottomBtn() {
  config.bottomButtons.push({
    id: Date.now(),
    name: '',
    icon: 'ChatDotSquare',
    action: 'service',
  })
}

function confirmFaqs() {
  config.hotFaqIds = [...new Set([...config.hotFaqIds, ...selectedFaqIds.value])]
  showFaqSelector.value = false
  selectedFaqIds.value = []
}

function handleSave() {
  ElMessage.success('首页配置已保存（演示）')
}

onMounted(async () => {
  await settingsStore.fetchHomeConfig()
  loadConfig()
  loading.value = false
})
</script>

<style scoped>
.home-config {
  max-width: 900px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 16px;
}

.home-config__hint {
  font-size: 13px;
  color: #8C8C8C;
  margin-bottom: 12px;
}

.home-config__categories {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.home-config__category-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #FAFAFA;
  border-radius: 8px;
}

.home-config__category-sort {
  width: 24px;
  height: 24px;
  background: var(--accent-primary);
  color: #fff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  margin-right: 8px;
}

.home-config__hot-faqs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.home-config__keyword-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.home-config__btn-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #FAFAFA;
  border-radius: 8px;
  margin-bottom: 8px;
}

.home-config__btn-num {
  width: 24px;
  height: 24px;
  background: var(--el-color-warning);
  color: #fff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  margin-right: 8px;
}

.faq-selector__list {
  max-height: 300px;
  overflow-y: auto;
}
</style>
