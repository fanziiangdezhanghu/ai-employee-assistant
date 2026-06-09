<template>
  <div class="settings-page">
    <div class="page-header" style="display:flex;justify-content:space-between;align-items:center">
      <h1 class="page-header__title">基础设置</h1>
      <el-button type="primary" @click="handleSave">保存设置</el-button>
    </div>

    <el-skeleton :loading="loading" animated :count="3">
      <template #default>
        <!-- 帮助中心信息 -->
        <div class="page-card" style="margin-bottom:16px">
          <h3 class="section-title">帮助中心信息</h3>
          <el-form :model="form" label-width="140px">
            <el-form-item label="帮助中心名称">
              <el-input v-model="form.helpCenterName" style="width:360px" maxlength="20" />
            </el-form-item>
            <el-form-item label="LOGO">
              <div class="upload-placeholder" @click="handleUpload">
                <el-icon :size="20"><Plus /></el-icon>
                <span>上传LOGO</span>
              </div>
              <div v-if="form.logo" style="margin-top:8px;display:flex;align-items:center;gap:8px">
                <img :src="form.logo" alt="logo" style="height:40px;border-radius:4px" />
                <el-button text size="small" type="danger" @click="form.logo = ''">删除</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>

        <!-- 功能开关 -->
        <div class="page-card" style="margin-bottom:16px">
          <h3 class="section-title">功能开关</h3>
          <div class="settings-page__list">
            <div v-for="feature in form.features" :key="feature.key" class="settings-page__item">
              <div class="settings-page__item-info">
                <span class="settings-page__item-label">{{ feature.label }}</span>
                <span v-if="feature.key === 'ai_chat'" class="settings-page__item-hint">默认关闭，开启后APP端显示AI小宝入口</span>
              </div>
              <el-switch v-model="feature.enabled" />
            </div>
          </div>
        </div>

        <!-- 通知设置 -->
        <div class="page-card" style="margin-bottom:16px">
          <h3 class="section-title">通知设置</h3>
          <div class="settings-page__list">
            <div class="settings-page__item">
              <div class="settings-page__item-info">
                <span class="settings-page__item-label">发版提醒通知</span>
                <span class="settings-page__item-hint">模块负责人触发发版提醒时发送通知</span>
              </div>
              <el-switch v-model="notificationEnabled" />
            </div>
            <div class="settings-page__item">
              <div class="settings-page__item-info">
                <span class="settings-page__item-label">企微通知</span>
                <span class="settings-page__item-hint">通过企业微信发送发版提醒消息</span>
              </div>
              <el-switch v-model="wechatNotification" />
            </div>
          </div>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useSettingsStore } from '@/stores/settingsStore'
import type { FeatureToggle } from '@/types'

const settingsStore = useSettingsStore()

const loading = ref(true)
const notificationEnabled = ref(true)
const wechatNotification = ref(false)

const form = reactive({
  helpCenterName: '翻台宝帮助中心',
  logo: null as string | null,
  features: [] as FeatureToggle[],
})

function loadData() {
  if (settingsStore.settings) {
    form.helpCenterName = settingsStore.settings.helpCenterName
    form.logo = settingsStore.settings.logo
    form.features = settingsStore.settings.features.map((f) => ({ ...f }))
  }
}

function handleUpload() {
  ElMessage.info('LOGO上传功能待对接（演示）')
}

function handleSave() {
  ElMessage.success('设置已保存（演示）')
}

onMounted(async () => {
  await settingsStore.fetchSettings()
  loadData()
  loading.value = false
})
</script>

<style scoped>
.settings-page {
  max-width: 800px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 16px;
}

.upload-placeholder {
  width: 160px;
  height: 80px;
  border: 2px dashed #D9D9D9;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  color: #8C8C8C;
  font-size: 13px;
  transition: border-color 0.2s;
}

.upload-placeholder:hover {
  border-color: var(--accent-primary);
  color: var(--accent-primary);
}

.settings-page__list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.settings-page__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #F0F0F0;
}

.settings-page__item:last-child {
  border-bottom: none;
}

.settings-page__item-label {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
}

.settings-page__item-hint {
  font-size: 12px;
  color: #8C8C8C;
  display: block;
  margin-top: 2px;
}
</style>
