<script setup>
import { ref, computed } from 'vue'
import { useLibraryStore } from '@/stores/library'
import { Play, Bookmark, BookmarkCheck, Clock, Youtube, Search } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

const store = useLibraryStore()
const { videos } = storeToRefs(store)

const searchQuery = ref('')
const selectedCategory = ref('')

const categories = computed(() => [...new Set(videos.value.map(v => v.category))])

const filteredVideos = computed(() => {
  let result = videos.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(v => v.title.toLowerCase().includes(q) || v.channel.toLowerCase().includes(q))
  }
  if (selectedCategory.value) result = result.filter(v => v.category === selectedCategory.value)
  return result
})
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h1 class="font-serif text-3xl lg:text-4xl font-semibold text-brand-900">YouTube Library</h1>
        <p class="text-brand-400 mt-1">Saved performances, tutorials, and masterclasses</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-3 p-4 bg-white rounded-xl border border-brand-100">
      <div class="flex items-center gap-2 px-3 py-2 bg-brand-50 rounded-lg flex-1 min-w-[200px] border border-brand-100">
        <Search class="w-4 h-4 text-brand-400" />
        <input v-model="searchQuery" type="text" placeholder="Search videos or channels..." class="bg-transparent outline-none text-sm w-full" />
      </div>
      <select v-model="selectedCategory" class="px-3 py-2 bg-brand-50 border border-brand-100 rounded-lg text-sm text-brand-700 outline-none">
        <option value="">All Categories</option>
        <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
      </select>
    </div>

    <!-- Video Grid -->
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="video in filteredVideos" 
        :key="video.id"
        class="bg-white rounded-2xl border border-brand-100 shadow-sm hover:shadow-lg transition-all group overflow-hidden"
      >
        <!-- Thumbnail placeholder -->
        <div class="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 relative flex items-center justify-center">
          <div class="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-red-600/90 transition-colors cursor-pointer">
            <Play class="w-6 h-6 text-white fill-white ml-0.5" />
          </div>
          <button 
            @click.stop="store.toggleFavorite(video.id, 'video')"
            class="absolute top-3 right-3 p-1.5 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors"
          >
            <BookmarkCheck v-if="video.saved" class="w-4 h-4 text-gold-400" />
            <Bookmark v-else class="w-4 h-4 text-white/70" />
          </button>
          <span class="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 text-[10px] font-mono text-white rounded">12:34</span>
        </div>
        <div class="p-4">
          <div class="flex items-start gap-2">
            <Youtube class="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-medium text-brand-900 leading-snug line-clamp-2">{{ video.title }}</h3>
              <p class="text-xs text-brand-400 mt-1">{{ video.channel }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2 mt-3">
            <span class="px-2 py-0.5 bg-red-50 text-red-600 text-[11px] font-medium rounded-full">{{ video.category }}</span>
            <span v-if="video.saved" class="px-2 py-0.5 bg-gold-50 text-gold-700 text-[11px] font-medium rounded-full flex items-center gap-1">
              <Clock class="w-3 h-3" /> {{ video.timestamp }}
            </span>
          </div>
          <div v-if="video.notes" class="mt-3 p-2.5 bg-brand-50 rounded-lg">
            <p class="text-[11px] text-brand-500 leading-relaxed">{{ video.notes }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>