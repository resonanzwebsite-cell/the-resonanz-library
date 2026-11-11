<script setup>
import { computed, ref } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { 
  LayoutDashboard, FileMusic, Youtube, FolderOpen, Users, Settings, 
  Menu, X, Music, Search, Bell, LogOut 
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const sidebarOpen = ref(false)
const authStore = useAuthStore()
const { user, displayName, initials, avatarUrl } = storeToRefs(authStore)

const isAuthPage = computed(() => route.meta.public === true)

async function handleLogout() {
  await authStore.logout()
  router.push({ name: 'auth' })
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Sheet Music', href: '/sheet-music', icon: FileMusic },
  { name: 'YouTube', href: '/youtube', icon: Youtube },
  { name: 'Collections', href: '/collections', icon: FolderOpen },
  { name: 'People', href: '/people', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings }
]

function isActive(href) {
  return route.path === href
}
</script>

<template>
  <RouterView v-if="isAuthPage" />

  <div v-else class="min-h-screen bg-surface" @keydown.esc="sidebarOpen = false">
    <!-- Mobile sidebar backdrop -->
    <Transition name="sidebar-backdrop">
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-40 bg-brand-950/45 backdrop-blur-[2px] lg:hidden"
        aria-hidden="true"
        @click="sidebarOpen = false"
      />
    </Transition>

    <!-- Sidebar -->
    <aside 
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-xl border-r border-brand-100 shadow-xl shadow-brand-950/5 transform transition-transform duration-300 lg:translate-x-0 lg:shadow-none',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
      aria-label="Main navigation"
    >
      <!-- Logo -->
      <div class="flex items-center gap-3 px-6 h-16 border-b border-brand-100">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/20">
          <Music class="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 class="font-serif font-semibold text-brand-900 text-lg leading-tight">The Resonanz</h1>
          <p class="text-[10px] uppercase tracking-[0.2em] text-brand-400 font-medium">Library</p>
        </div>
        <button 
          @click="sidebarOpen = false"
          class="ml-auto rounded-lg p-2 text-brand-400 transition-colors hover:bg-brand-50 hover:text-brand-600 lg:hidden"
          aria-label="Close navigation"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="px-3 py-4 space-y-1">
        <RouterLink
          v-for="item in navigation"
          :key="item.name"
          :to="item.href"
          @click="sidebarOpen = false"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
            isActive(item.href)
              ? 'bg-brand-50 text-brand-700 shadow-sm shadow-brand-100'
              : 'text-brand-400 hover:translate-x-0.5 hover:text-brand-700 hover:bg-brand-50/50'
          ]"
          :aria-current="isActive(item.href) ? 'page' : undefined"
        >
          <component :is="item.icon" class="w-5 h-5" />
          {{ item.name }}
          <span 
            v-if="isActive(item.href)"
            class="ml-auto w-1.5 h-1.5 rounded-full bg-gold-500"
          />
        </RouterLink>
      </nav>

      <!-- Bottom section -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-brand-100">
        <div class="flex items-center gap-3 px-3 py-2">
          <img
            v-if="avatarUrl"
            :src="avatarUrl"
            :alt="displayName"
            class="w-8 h-8 rounded-full object-cover ring-2 ring-white"
            referrerpolicy="no-referrer"
          />
          <div
            v-else
            class="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-white text-xs font-semibold"
          >
            {{ initials }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-brand-900 truncate">{{ displayName }}</p>
            <p class="text-xs text-brand-400 truncate">{{ user?.email }}</p>
          </div>
          <button
            class="rounded-lg p-2 text-brand-400 transition-colors hover:bg-brand-50 hover:text-brand-600"
            aria-label="Sign out"
            title="Sign out"
            @click="handleLogout"
          >
            <LogOut class="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <div class="lg:pl-64">
      <!-- Top bar -->
      <header class="sticky top-0 z-30 h-16 border-b border-brand-100/80 bg-white/75 backdrop-blur-xl">
        <div class="flex items-center justify-between h-full px-4 lg:px-8">
          <div class="flex items-center gap-4">
            <button 
              @click="sidebarOpen = true"
              class="rounded-lg p-2 text-brand-500 transition-colors hover:bg-brand-50 hover:text-brand-700 lg:hidden"
              :aria-expanded="sidebarOpen"
              aria-label="Open navigation"
            >
              <Menu class="w-5 h-5" />
            </button>
            
            <!-- Search -->
            <div class="hidden sm:flex items-center gap-2 px-3 py-2 bg-brand-50 rounded-lg w-80 border border-brand-100 focus-within:border-brand-300 transition-colors">
              <Search class="w-4 h-4 text-brand-400" />
              <input 
                type="text" 
                placeholder="Search library..." 
                class="bg-transparent border-none outline-none text-sm text-brand-900 placeholder-brand-400 w-full"
                aria-label="Search library"
              />
              <kbd class="hidden md:inline-flex px-1.5 py-0.5 text-[10px] font-mono text-brand-400 bg-white rounded border border-brand-200">⌘K</kbd>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <button class="relative rounded-lg p-2 text-brand-400 transition-colors hover:bg-brand-50 hover:text-brand-600" aria-label="Notifications">
              <Bell class="w-5 h-5" />
              <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gold-500 ring-2 ring-white" />
            </button>
            <div class="hidden sm:block w-px h-6 bg-brand-100" />
            <span class="hidden sm:block text-xs text-brand-400 font-medium">Spring 2026</span>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="p-4 lg:p-8">
        <RouterView v-slot="{ Component }">
          <Transition 
            name="page" 
            mode="out-in"
          >
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>