<script setup>
import { ref, computed } from 'vue'
import { useLibraryStore } from '@/stores/library'
import { Search, Upload, Grid3X3, List, Heart, Filter, ChevronDown, FileMusic } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

const store = useLibraryStore()
const { sheetMusic } = storeToRefs(store)

const searchQuery = ref('')
const selectedComposer = ref('')
const selectedInstrument = ref('')
const viewMode = ref('grid')
const sortBy = ref('newest')

const composers = computed(() => [...new Set(sheetMusic.value.map(s => s.composer))])
const instruments = computed(() => [...new Set(sheetMusic.value.map(s => s.instrument))])

const filteredMusic = computed(() => {
  let result = sheetMusic.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(s => 
      s.title.toLowerCase().includes(q) || 
      s.composer.toLowerCase().includes(q)
    )
  }
  if (selectedComposer.value) result = result.filter(s => s.composer === selectedComposer.value)
  if (selectedInstrument.value) result = result.filter(s => s.instrument === selectedInstrument.value)
  
  if (sortBy.value === 'newest') {
    result = [...result].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
  } else if (sortBy.value === 'title') {
    result = [...result].sort((a, b) => a.title.localeCompare(b.title))
  }
  return result
})
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h1 class="font-serif text-3xl lg:text-4xl font-semibold text-brand-900">Sheet Music</h1>
        <p class="text-brand-400 mt-1">{{ filteredMusic.length }} pieces in your library</p>
      </div>
      <button class="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors shadow-lg shadow-brand-600/20">
        <Upload class="w-4 h-4" />
        Upload PDF
      </button>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-3 p-4 bg-white rounded-xl border border-brand-100">
      <div class="flex items-center gap-2 px-3 py-2 bg-brand-50 rounded-lg flex-1 min-w-[200px] border border-brand-100">
        <Search class="w-4 h-4 text-brand-400" />
        <input v-model="searchQuery" type="text" placeholder="Search by title or composer..." class="bg-transparent outline-none text-sm w-full" />
      </div>
      
      <select v-model="selectedComposer" class="px-3 py-2 bg-brand-50 border border-brand-100 rounded-lg text-sm text-brand-700 outline-none focus:border-brand-300">
        <option value="">All Composers</option>
        <option v-for="c in composers" :key="c" :value="c">{{ c }}</option>
      </select>

      <select v-model="selectedInstrument" class="px-3 py-2 bg-brand-50 border border-brand-100 rounded-lg text-sm text-brand-700 outline-none focus:border-brand-300">
        <option value="">All Instruments</option>
        <option v-for="i in instruments" :key="i" :value="i">{{ i }}</option>
      </select>

      <select v-model="sortBy" class="px-3 py-2 bg-brand-50 border border-brand-100 rounded-lg text-sm text-brand-700 outline-none focus:border-brand-300">
        <option value="newest">Newest First</option>
        <option value="title">Title A-Z</option>
      </select>

      <div class="flex items-center bg-brand-50 rounded-lg border border-brand-100 p-0.5 ml-auto">
        <button @click="viewMode = 'grid'" :class="['p-2 rounded-md transition-colors', viewMode === 'grid' ? 'bg-white shadow-sm text-brand-700' : 'text-brand-400']">
          <Grid3X3 class="w-4 h-4" />
        </button>
        <button @click="viewMode = 'list'" :class="['p-2 rounded-md transition-colors', viewMode === 'list' ? 'bg-white shadow-sm text-brand-700' : 'text-brand-400']">
          <List class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Grid View -->
    <div v-if="viewMode === 'grid'" class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div 
        v-for="item in filteredMusic" 
        :key="item.id"
        class="bg-white rounded-2xl border border-brand-100 shadow-sm hover:shadow-lg hover:border-brand-200 transition-all group overflow-hidden"
      >
        <div class="h-32 bg-gradient-to-br from-brand-100 to-brand-50 flex items-center justify-center relative">
          <FileMusic class="w-10 h-10 text-brand-300" />
          <button 
            @click.stop="store.toggleFavorite(item.id, 'sheet')"
            class="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
          >
            <Heart :class="['w-4 h-4', item.favorite ? 'fill-gold-500 text-gold-500' : 'text-brand-300']" />
          </button>
        </div>
        <div class="p-4">
          <h3 class="font-medium text-brand-900 truncate">{{ item.title }}</h3>
          <p class="text-sm text-brand-400 mt-0.5">{{ item.composer }}</p>
          <div class="flex items-center gap-2 mt-3">
            <span class="px-2 py-0.5 bg-brand-50 text-brand-600 text-[11px] font-medium rounded-full">{{ item.instrument }}</span>
            <span class="px-2 py-0.5 bg-gold-50 text-gold-700 text-[11px] font-medium rounded-full">{{ item.category }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- List View -->
    <div v-else class="bg-white rounded-2xl border border-brand-100 shadow-sm overflow-hidden">
      <table class="w-full">
        <thead class="bg-brand-50/50 border-b border-brand-100">
          <tr>
            <th class="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-brand-500">Title</th>
            <th class="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-brand-500">Composer</th>
            <th class="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-brand-500">Instrument</th>
            <th class="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-brand-500">Added</th>
            <th class="w-12"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-brand-50">
          <tr v-for="item in filteredMusic" :key="item.id" class="hover:bg-brand-50/30 transition-colors">
            <td class="px-6 py-3.5">
              <div class="flex items-center gap-3">
                <FileMusic class="w-4 h-4 text-brand-300" />
                <span class="text-sm font-medium text-brand-900">{{ item.title }}</span>
              </div>
            </td>
            <td class="px-6 py-3.5 text-sm text-brand-500">{{ item.composer }}</td>
            <td class="px-6 py-3.5">
              <span class="px-2 py-0.5 bg-brand-50 text-brand-600 text-xs font-medium rounded-full">{{ item.instrument }}</span>
            </td>
            <td class="px-6 py-3.5 text-sm text-brand-400">{{ item.dateAdded }}</td>
            <td class="px-6 py-3.5">
              <button @click="store.toggleFavorite(item.id, 'sheet')">
                <Heart :class="['w-4 h-4', item.favorite ? 'fill-gold-500 text-gold-500' : 'text-brand-200 hover:text-brand-400']" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>