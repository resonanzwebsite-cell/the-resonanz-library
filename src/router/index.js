import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { title: 'Dashboard', icon: 'LayoutDashboard' }
  },
  {
    path: '/sheet-music',
    name: 'sheet-music',
    component: () => import('@/views/SheetMusicView.vue'),
    meta: { title: 'Sheet Music', icon: 'FileMusic' }
  },
  {
    path: '/youtube',
    name: 'youtube',
    component: () => import('@/views/YouTubeView.vue'),
    meta: { title: 'YouTube', icon: 'Youtube' }
  },
  {
    path: '/collections',
    name: 'collections',
    component: () => import('@/views/CollectionsView.vue'),
    meta: { title: 'Collections', icon: 'FolderOpen' }
  },
  {
    path: '/people',
    name: 'people',
    component: () => import('@/views/PeopleView.vue'),
    meta: { title: 'People', icon: 'Users' }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/SettingsView.vue'),
    meta: { title: 'Settings', icon: 'Settings' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} · The Resonanz Library`
  next()
})

export default router