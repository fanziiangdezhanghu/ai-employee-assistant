<template>
  <div class="topbar">
    <div class="topbar__left">
      <el-button text @click="toggle" class="topbar__collapse-btn">
        <el-icon><Fold /></el-icon>
      </el-button>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">翻台宝帮助中心</el-breadcrumb-item>
        <el-breadcrumb-item v-if="route.meta.title">{{ route.meta.title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="topbar__right">
      <el-badge :value="pendingCount" :hidden="pendingCount === 0" class="topbar__badge">
        <el-button text>
          <el-icon :size="20"><Bell /></el-icon>
        </el-button>
      </el-badge>
      <el-dropdown>
        <span class="topbar__user">
          <el-avatar :size="32" icon="UserFilled" />
          <span>管理员</span>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useArticleStore } from '@/stores/articleStore'

const route = useRoute()
const toggleSidebar = inject('toggleSidebar', () => {})
const toggle = toggleSidebar as () => void

const articleStore = useArticleStore()
const pendingCount = computed(() => {
  // 模拟待更新数量
  return 3
})
</script>

<style scoped>
.topbar {
  height: 56px;
  background: #fff;
  border-bottom: 1px solid #F0F0F0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  flex-shrink: 0;
}

.topbar__left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.topbar__collapse-btn {
  font-size: 16px;
  padding: 4px;
}

.topbar__right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.topbar__badge {
  margin-right: 8px;
}

.topbar__user {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #434343;
}
</style>
