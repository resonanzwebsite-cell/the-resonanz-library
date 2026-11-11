<script setup>
import { useLibraryStore } from '@/stores/library'
import { FolderOpen, Music, GraduationCap, Star, Plus, ArrowRight } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

const store = useLibraryStore()
const { collections } = storeToRefs(store)

const typeIcons = {
  Concert: Music,
  Rehearsal: Star,
  Learning: GraduationCap,
  Custom: FolderOpen
}

const typeColors = {
  Concert: 'bg-brand-50 text-brand-600 border-brand-100',
  Rehearsal: 'bg-gold-50 text-gold-600 border-gold-100',
  Learning: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  Custom: 'bg-violet-50 text-violet-600 border-violet-100'
}
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h1 class="font-serif text-3xl lg:text-4xl font-semibold text-brand-900">Collections</h1>
        <p class="text-brand-400 mt-1">Organize your materials into curated sets</p>
      </div>
      <button class="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors shadow-lg shadow-brand-600/20">
        <Plus class="w-4 h-4" />
        New Collection
      </button>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <div 
        v-for="collection in collections" 
        :key="collection.id"
        class="bg-white rounded-2xl border border-brand-100 shadow-sm hover:shadow-lg transition-all group cursor-pointer overflow-hidden"
      >
        <div :class="['h-2', `bg-${collection.color}-400`]" />
        <div class="p-5">
          <div class="flex items-start justify-between">
            <div :class="['w-11 h-11 rounded-xl border flex items-center justify-center', typeColors[collection.type]]">
              <component :is="typeIcons[collection.type]" class="w-5 h-5" />
            </div>
            <span class="px-2 py-0.5 bg-brand-50 text-brand-500 text-[11px] font-medium rounded-full">{{ collection.type }}</span>
          </div>
          <h3 class="mt-4 font-semibold text-brand-900 group-hover:text-brand-700 transition-colors">{{ collection.name }}</h3>
          <p class="text-sm text-brand-400 mt-0.5">{{ collection.count }} items</p>
          <div class="mt-4 flex items-center text-brand-400 group-hover:text-brand-600 transition-colors text-sm font-medium">
            Open collection <ArrowRight class="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      <!-- Add new card -->
      <button class="rounded-2xl border-2 border-dashed border-brand-200 p-5 flex flex-col items-center justify-center gap-2 text-brand-300 hover:text-brand-500 hover:border-brand-300 hover:bg-brand-50/30 transition-all min-h-[200px]">
        <Plus class="w-8 h-8" />
        <span class="text-sm font-medium">Create Collection</span>
      </button>
    </div>
  </div>
</template>