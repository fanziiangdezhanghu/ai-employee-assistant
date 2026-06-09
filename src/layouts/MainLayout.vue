<template>
  <div class="app-layout">
    <Sidebar />
    <div class="app-layout__main" :class="{ collapsed: sidebarCollapsed }">
      <TopBar />
      <div class="app-layout__content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import TopBar from '@/components/TopBar.vue'

const sidebarCollapsed = ref(false)
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

provide('sidebarCollapsed', sidebarCollapsed)
provide('toggleSidebar', toggleSidebar)
</script>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  background: var(--bg-primary, #F5F5F5);
}

.app-layout__main {
  flex: 1;
  margin-left: 220px;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s;
  min-width: 0;
}

.app-layout__main.collapsed {
  margin-left: 64px;
}

.app-layout__content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background: var(--bg-primary, #F5F5F5);
}
</style>
