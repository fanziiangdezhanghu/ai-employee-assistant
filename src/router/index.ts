import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    redirect: '/articles',
    children: [
      {
        path: 'articles',
        name: 'ArticleList',
        component: () => import('@/pages/ArticleList/index.vue'),
        meta: { title: '文章管理' },
      },
      {
        path: 'articles/new',
        name: 'ArticleNew',
        component: () => import('@/pages/ArticleEdit/index.vue'),
        meta: { title: '新建文章' },
      },
      {
        path: 'articles/edit/:id',
        name: 'ArticleEdit',
        component: () => import('@/pages/ArticleEdit/index.vue'),
        meta: { title: '编辑文章' },
      },
      {
        path: 'my-articles',
        name: 'MyArticles',
        component: () => import('@/pages/MyArticles/index.vue'),
        meta: { title: '我的文章' },
      },
      {
        path: 'categories',
        name: 'CategoryManage',
        component: () => import('@/pages/CategoryManage/index.vue'),
        meta: { title: '分类管理' },
      },
      {
        path: 'home-config',
        name: 'HomeConfig',
        component: () => import('@/pages/HomeConfig/index.vue'),
        meta: { title: '首页配置' },
      },
      {
        path: 'modules',
        name: 'ModuleManage',
        component: () => import('@/pages/ModuleManage/index.vue'),
        meta: { title: '业务模块管理' },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/pages/Settings/index.vue'),
        meta: { title: '基础设置' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
