<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useLibraryStore } from '@/stores/library'
import AppModal from '@/components/AppModal.vue'
import {
  Bookmark,
  BookmarkCheck,
  Clock,
  Loader2,
  Pencil,
  Play,
  Plus,
  Search,
  Trash2,
  Youtube
} from 'lucide-vue-next'

const store = useLibraryStore()
const authStore = useAuthStore()
const { videos, loading } = storeToRefs(store)
const { isAdmin } = storeToRefs(authStore)

const searchQuery = ref('')
const selectedCategory = ref('')

const actionError = ref('')
const modalOpen = ref(false)
const saving = ref(false)
const editingId = ref(null)
const formError = ref('')

const emptyForm = () => ({
  title: '',
  channel: '',
  category: 'Performance',
  url: '',
  notes: '',
  saved: false,
  timestamp: ''
})

const form = ref(emptyForm())

const categories = computed(() => [...new Set(videos.value.map((v) => v.category))])

const filteredVideos = computed(() => {
  let result = videos.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(
      (v) =>
        v.title?.toLowerCase().includes(q) ||
        v.channel?.toLowerCase().includes(q)
    )
  }
  if (selectedCategory.value) result = result.filter((v) => v.category === selectedCategory.value)
  return result
})

function openCreate() {
  editingId.value = null
  form.value = emptyForm()
  formError.value = ''
  modalOpen.value = true
}

function openEdit(video) {
  editingId.value = video.id
  form.value = {
    title: video.title ?? '',
    channel: video.channel ?? '',
    category: video.category ?? '',
    url: video.url ?? '',
    notes: video.notes ?? '',
    saved: Boolean(video.saved),
    timestamp: video.timestamp ?? ''
  }
  formError.value = ''
  modalOpen.value = true
}

function openVideo(video) {
  if (video.url) window.open(video.url, '_blank', 'noopener')
}

async function save() {
  if (!form.value.title.trim() || !form.value.channel.trim()) {
    formError.value = 'Title and channel are required.'
    return
  }

  saving.value = true
  formError.value = ''
  actionError.value = ''

  const payload = {
    title: form.value.title.trim(),
    channel: form.value.channel.trim(),
    category: form.value.category.trim(),
    url: form.value.url.trim(),
    notes: form.value.notes.trim(),
    saved: form.value.saved,
    timestamp:
      form.value.saved
        ? form.value.timestamp || new Date().toISOString().slice(0, 10)
        : ''
  }

  try {
    if (editingId.value) {
      await store.updateItem('videos', editingId.value, payload)
    } else {
      await store.createItem('videos', payload)
    }
    modalOpen.value = false
  } catch (err) {
    formError.value =
      err?.code === 'permission-denied'
        ? 'Only administrators can modify the library.'
        : 'Could not save this video. Please try again.'
  } finally {
    saving.value = false
  }
}

async function remove(video) {
  if (!window.confirm(`Delete "${video.title}"?`)) return
  actionError.value = ''
  try {
    await store.deleteItem('videos', video.id)
  } catch (err) {
    actionError.value =
      err?.code === 'permission-denied'
        ? 'Only administrators can delete videos.'
        : 'Could not delete this video. Please try again.'
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h1 class="font-serif text-3xl lg:text-4xl font-semibold text-brand-900">YouTube Library</h1>
        <p class="text-brand-400 mt-1">Saved performances, tutorials, and masterclasses</p>
      </div>
      <button v-if="isAdmin" class="btn-primary" @click="openCreate">
        <Plus class="w-4 h-4" />
        Add Video
      </button>
    </div>

    <div
      v-if="actionError"
      class="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600"
      role="alert"
    >
      {{ actionError }}
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

    <div v-if="loading && videos.length === 0" class="flex items-center justify-center gap-2 py-16 text-sm text-brand-400">
      <Loader2 class="w-4 h-4 animate-spin" />
      Loading videos…
    </div>
    <div v-else-if="filteredVideos.length === 0" class="rounded-2xl border border-dashed border-brand-200 bg-white/60 px-6 py-14 text-center">
      <Youtube class="mx-auto w-8 h-8 text-brand-300" />
      <p class="mt-3 font-medium text-brand-700">No videos found</p>
      <p class="text-sm text-brand-400">
        {{ isAdmin ? 'Add a performance or tutorial to get started.' : 'Check back soon for new additions.' }}
      </p>
    </div>

    <!-- Video Grid -->
    <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="video in filteredVideos"
        :key="video.id"
        class="bg-white rounded-2xl border border-brand-100 shadow-sm hover:shadow-lg transition-all group overflow-hidden"
      >
        <!-- Thumbnail placeholder -->
        <div class="aspect-video bg-gradient-to-br from-brand-900 to-brand-950 relative flex items-center justify-center">
          <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_20%,rgb(103_232_249_/_0.18),transparent_60%)]" aria-hidden="true" />
          <button
            class="relative w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-gold-500/90 transition-colors"
            :aria-label="video.url ? 'Open video' : 'Video preview'"
            @click="openVideo(video)"
          >
            <Play class="w-6 h-6 text-white fill-white ml-0.5" />
          </button>
          <button
            @click.stop="store.toggleFavorite(video.id, 'video')"
            class="absolute top-3 right-3 p-1.5 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors"
            :aria-label="video.saved ? 'Remove bookmark' : 'Bookmark video'"
          >
            <BookmarkCheck v-if="video.saved" class="w-4 h-4 text-gold-400" />
            <Bookmark v-else class="w-4 h-4 text-white/70" />
          </button>
          <span v-if="video.timestamp" class="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 text-[10px] font-mono text-white rounded">{{ video.timestamp }}</span>
        </div>
        <div class="p-4">
          <div class="flex items-start gap-2">
            <Youtube class="w-4 h-4 text-gold-600 mt-0.5 shrink-0" />
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-medium text-brand-900 leading-snug line-clamp-2">{{ video.title }}</h3>
              <p class="text-xs text-brand-400 mt-1">{{ video.channel }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2 mt-3">
            <span class="px-2 py-0.5 bg-gold-50 text-gold-700 text-[11px] font-medium rounded-full">{{ video.category }}</span>
            <span v-if="video.saved" class="px-2 py-0.5 bg-gold-50 text-gold-700 text-[11px] font-medium rounded-full flex items-center gap-1">
              <Clock class="w-3 h-3" /> Bookmarked
            </span>
          </div>
          <div v-if="video.notes" class="mt-3 p-2.5 bg-brand-50 rounded-lg">
            <p class="text-[11px] text-brand-500 leading-relaxed">{{ video.notes }}</p>
          </div>
        </div>
        <div v-if="isAdmin" class="flex items-center gap-1 border-t border-brand-50 px-3 py-1.5">
          <button class="icon-btn" aria-label="Edit video" @click="openEdit(video)">
            <Pencil class="w-4 h-4" />
          </button>
          <button class="icon-btn hover:text-red-600" aria-label="Delete video" @click="remove(video)">
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <AppModal :open="modalOpen" :title="editingId ? 'Edit Video' : 'Add Video'" @close="modalOpen = false">
      <form class="space-y-4" @submit.prevent="save">
        <div>
          <label class="form-label" for="video-title">Title</label>
          <input id="video-title" v-model="form.title" class="form-input" type="text" required placeholder="Clair de Lune - Lang Lang" />
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="form-label" for="video-channel">Channel</label>
            <input id="video-channel" v-model="form.channel" class="form-input" type="text" required placeholder="Lang Lang" />
          </div>
          <div>
            <label class="form-label" for="video-category">Category</label>
            <input id="video-category" v-model="form.category" class="form-input" type="text" placeholder="Performance" />
          </div>
        </div>
        <div>
          <label class="form-label" for="video-url">YouTube URL</label>
          <input id="video-url" v-model="form.url" class="form-input" type="url" placeholder="https://youtube.com/watch?v=..." />
        </div>
        <div>
          <label class="form-label" for="video-notes">Notes</label>
          <textarea id="video-notes" v-model="form.notes" class="form-input min-h-24 resize-y" rows="3" placeholder="What makes this worth revisiting?" />
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <label class="flex items-center gap-2.5 text-sm text-brand-700">
            <input v-model="form.saved" type="checkbox" class="h-4 w-4 rounded border-brand-300 text-brand-600 focus:ring-brand-400" />
            Bookmarked
          </label>
          <div v-if="form.saved">
            <label class="form-label" for="video-timestamp">Bookmarked date</label>
            <input id="video-timestamp" v-model="form.timestamp" class="form-input" type="date" />
          </div>
        </div>

        <p v-if="formError" class="text-sm text-red-600" role="alert">{{ formError }}</p>

        <div class="flex justify-end gap-2 pt-2">
          <button type="button" class="btn-muted" @click="modalOpen = false">Cancel</button>
          <button type="submit" class="btn-primary" :disabled="saving">
            <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
            {{ editingId ? 'Save changes' : 'Add video' }}
          </button>
        </div>
      </form>
    </AppModal>
  </div>
</template>
