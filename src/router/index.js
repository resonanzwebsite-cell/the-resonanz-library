import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'auth',
    component: () => import('@/views/AuthView.vue'),
    meta: { title: 'Sign In', public: true }
  },
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
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  await auth.init()

  document.title = `${to.meta.title ?? 'Library'} — The Resonanz Library`

  if (to.meta.public) {
    if (auth.isAuthenticated) return { name: 'dashboard' }
    return true
  }

  if (!auth.isAuthenticated) {
    return { name: 'auth', query: { redirect: to.fullPath } }
  }

  return true
})

export default router
