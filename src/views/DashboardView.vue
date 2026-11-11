<script setup>
import { useLibraryStore } from '@/stores/library'
import { 
  FileMusic, Youtube, FolderOpen, Users, Heart, Clock, 
  ArrowRight, Plus, Upload, Play, Sparkles 
} from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

const store = useLibraryStore()
const { 
  totalMaterials, totalFavorites, totalCollections, totalPeople,
  recentMaterials, favoriteItems, recentlyOpened 
} = storeToRefs(store)
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-8">
    <!-- Header -->
    <div class="dashboard-intro flex flex-col sm:flex-row sm:items-end justify-between gap-5">
      <div>
        <p class="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em]">Your private music collection</p>
        <h1 class="font-serif text-3xl lg:text-4xl font-semibold text-brand-900">Dashboard</h1>
        <p class="text-brand-400 mt-1">Welcome back, Alexandra. Here's your library overview.</p>
      </div>
      <div class="relative z-10 flex flex-wrap gap-2">
        <button class="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors shadow-lg shadow-brand-600/20">
          <Plus class="w-4 h-4" />
          Add Material
        </button>
        <button class="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-brand-700 text-sm font-medium rounded-lg border border-brand-200 hover:border-brand-300 hover:bg-brand-50 transition-colors">
          <Upload class="w-4 h-4" />
          Import
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-2xl p-5 border border-brand-100 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div class="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
            <FileMusic class="w-5 h-5 text-brand-600" />
          </div>
          <span class="text-[10px] font-semibold uppercase tracking-wider text-brand-400">Total</span>
        </div>
        <p class="mt-3 text-2xl font-semibold text-brand-900">{{ totalMaterials }}</p>
        <p class="text-sm text-brand-400">Materials</p>
      </div>

      <div class="bg-white rounded-2xl p-5 border border-brand-100 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div class="w-10 h-10 rounded-xl bg-gold-50 flex items-center justify-center">
            <Heart class="w-5 h-5 text-gold-600" />
          </div>
          <span class="text-[10px] font-semibold uppercase tracking-wider text-gold-500">Saved</span>
        </div>
        <p class="mt-3 text-2xl font-semibold text-brand-900">{{ totalFavorites }}</p>
        <p class="text-sm text-brand-400">Favorites</p>
      </div>

      <div class="bg-white rounded-2xl p-5 border border-brand-100 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div class="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
            <FolderOpen class="w-5 h-5 text-sky-600" />
          </div>
          <span class="text-[10px] font-semibold uppercase tracking-wider text-sky-500">Curated</span>
        </div>
        <p class="mt-3 text-2xl font-semibold text-brand-900">{{ totalCollections }}</p>
        <p class="text-sm text-brand-400">Collections</p>
      </div>

      <div class="bg-white rounded-2xl p-5 border border-brand-100 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <Users class="w-5 h-5 text-indigo-600" />
          </div>
          <span class="text-[10px] font-semibold uppercase tracking-wider text-indigo-500">Network</span>
        </div>
        <p class="mt-3 text-2xl font-semibold text-brand-900">{{ totalPeople }}</p>
        <p class="text-sm text-brand-400">People</p>
      </div>
    </div>

    <!-- Two column layout -->
    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Recent Materials -->
      <div class="lg:col-span-2 bg-white rounded-2xl border border-brand-100 shadow-sm overflow-hidden">
        <div class="flex items-center justify-between px-6 py-4 border-b border-brand-100">
          <div class="flex items-center gap-2">
            <Sparkles class="w-4 h-4 text-gold-500" />
            <h2 class="font-semibold text-brand-900">Recently Added</h2>
          </div>
          <RouterLink to="/sheet-music" class="text-sm text-brand-500 hover:text-brand-700 flex items-center gap-1">
            View all <ArrowRight class="w-3.5 h-3.5" />
          </RouterLink>
        </div>
        <div class="divide-y divide-brand-50">
          <div 
            v-for="item in recentMaterials" 
            :key="item.id"
            class="flex items-center gap-4 px-6 py-3.5 hover:bg-brand-50/50 transition-colors"
          >
            <div class="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
              <FileMusic class="w-4 h-4 text-brand-500" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-brand-900 truncate">{{ item.title }}</p>
              <p class="text-xs text-brand-400">{{ item.composer }} · {{ item.instrument }}</p>
            </div>
            <span class="text-xs text-brand-400 shrink-0">{{ item.dateAdded }}</span>
          </div>
        </div>
      </div>

      <!-- Favorites -->
      <div class="bg-white rounded-2xl border border-brand-100 shadow-sm overflow-hidden">
        <div class="flex items-center justify-between px-6 py-4 border-b border-brand-100">
          <div class="flex items-center gap-2">
            <Heart class="w-4 h-4 text-gold-500" />
            <h2 class="font-semibold text-brand-900">Favorites</h2>
          </div>
          <span class="text-xs font-medium text-gold-600 bg-gold-50 px-2 py-0.5 rounded-full">{{ favoriteItems.length }}</span>
        </div>
        <div class="p-4 space-y-2">
          <div 
            v-for="item in favoriteItems.slice(0, 4)" 
            :key="`${item.type}-${item.id}`"
            class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-brand-50/50 transition-colors group cursor-pointer"
          >
            <div :class="[
              'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
              item.type === 'sheet' ? 'bg-brand-50' : 'bg-gold-50'
            ]">
              <FileMusic v-if="item.type === 'sheet'" class="w-3.5 h-3.5 text-brand-500" />
              <Youtube v-else class="w-3.5 h-3.5 text-gold-600" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-brand-900 truncate">{{ item.title }}</p>
              <p class="text-[11px] text-brand-400 truncate">{{ item.composer || item.channel }}</p>
            </div>
            <Play class="w-3.5 h-3.5 text-brand-300 group-hover:text-brand-600 transition-colors" />
          </div>
        </div>
      </div>
    </div>

    <!-- Recently Opened & Quick Actions -->
    <div class="grid lg:grid-cols-2 gap-6">
      <!-- Recently Opened -->
      <div class="bg-white rounded-2xl border border-brand-100 shadow-sm overflow-hidden">
        <div class="flex items-center gap-2 px-6 py-4 border-b border-brand-100">
          <Clock class="w-4 h-4 text-brand-400" />
          <h2 class="font-semibold text-brand-900">Recently Opened</h2>
        </div>
        <div class="divide-y divide-brand-50">
          <div 
            v-for="item in recentlyOpened" 
            :key="item.id"
            class="flex items-center gap-4 px-6 py-3 hover:bg-brand-50/50 transition-colors cursor-pointer"
          >
            <div class="w-2 h-2 rounded-full bg-brand-300 shrink-0" />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-brand-900 truncate">{{ item.title }}</p>
              <p class="text-xs text-brand-400 capitalize">{{ item.type }}</p>
            </div>
            <span class="text-xs text-brand-300">{{ item.lastOpened }}</span>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-gradient-to-br from-brand-800 to-brand-950 rounded-2xl p-6 text-white shadow-xl shadow-brand-900/20">
        <h2 class="font-serif text-xl font-semibold mb-1">Quick Actions</h2>
        <p class="text-brand-300 text-sm mb-6">Jump into your most common tasks</p>
        <div class="grid grid-cols-2 gap-3">
          <RouterLink 
            to="/sheet-music" 
            class="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all group"
          >
            <Upload class="w-5 h-5 text-gold-400 group-hover:scale-110 transition-transform" />
            <span class="text-xs font-medium">Upload PDF</span>
          </RouterLink>
          <RouterLink 
            to="/youtube" 
            class="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all group"
          >
            <Youtube class="w-5 h-5 text-gold-400 group-hover:scale-110 transition-transform" />
            <span class="text-xs font-medium">Add Video</span>
          </RouterLink>
          <RouterLink 
            to="/collections" 
            class="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all group"
          >
            <FolderOpen class="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
            <span class="text-xs font-medium">New Collection</span>
          </RouterLink>
          <RouterLink 
            to="/people" 
            class="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all group"
          >
            <Users class="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span class="text-xs font-medium">Add Person</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>