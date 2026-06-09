<template>
  <div class="sidebar" :class="{ collapsed: sidebarCollapsed }">
    <div class="sidebar__header">
      <el-icon :size="28" color="#fff" v-if="!sidebarCollapsed"><Monitor /></el-icon>
      <span v-if="!sidebarCollapsed" class="sidebar__title">翻台宝帮助中心</span>
      <el-icon :size="24" color="#fff" v-else><Monitor /></el-icon>
    </div>

    <el-menu
      :default-active="activeMenu"
      :collapse="sidebarCollapsed"
      :router="true"
      background-color="transparent"
      text-color="#8C8C8C"
      active-text-color="#1677FF"
    >
      <el-menu-item index="/articles">
        <el-icon><Document /></el-icon>
        <template #title>文章管理</template>
      </el-menu-item>
      <el-menu-item index="/my-articles">
        <el-icon><FolderOpened /></el-icon>
        <template #title>我的文章</template>
      </el-menu-item>
      <el-menu-item index="/categories">
        <el-icon><Grid /></el-icon>
        <template #title>分类管理</template>
      </el-menu-item>
      <el-menu-item index="/home-config">
        <el-icon><HomeFilled /></el-icon>
        <template #title>首页配置</template>
      </el-menu-item>
      <el-menu-item index="/modules">
        <el-icon><Connection /></el-icon>
        <template #title>业务模块管理</template>
      </el-menu-item>
      <el-menu-item index="/settings">
        <el-icon><Setting /></el-icon>
        <template #title>基础设置</template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const sidebarCollapsed = inject('sidebarCollapsed', ref(false))

const activeMenu = computed(() => {
  const path = route.path
  if (path.startsWith('/articles')) return '/articles'
  if (path.startsWith('/my-articles')) return '/my-articles'
  return path
})
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 220px;
  background: #fff;
  border-right: 1px solid #F0F0F0;
  display: flex;
  flex-direction: column;
  z-index: 100;
  transition: width 0.3s;
  overflow: hidden;
}

.sidebar.collapsed {
  width: 64px;
}

.sidebar__header {
  height: 56px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px;
  border-bottom: 1px solid #F0F0F0;
  background: #001529;
  flex-shrink: 0;
}

.sidebar__title {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
}

.sidebar.collapsed .sidebar__header {
  justify-content: center;
  padding: 0;
}

.el-menu {
  border-right: none;
  flex: 1;
  padding: 8px 0;
}

.el-menu-item {
  height: 44px;
  line-height: 44px;
  margin: 2px 8px;
  border-radius: 8px;
  font-size: 14px;
}

.el-menu-item.is-active {
  background: #E6F4FF !important;
  color: #1677FF !important;
  font-weight: 500;
}
</style>
