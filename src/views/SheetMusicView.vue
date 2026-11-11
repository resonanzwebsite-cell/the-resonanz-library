<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useLibraryStore } from '@/stores/library'
import AppModal from '@/components/AppModal.vue'
import {
  FileMusic,
  Grid3X3,
  Heart,
  List,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2
} from 'lucide-vue-next'

const store = useLibraryStore()
const authStore = useAuthStore()
const { sheetMusic, loading } = storeToRefs(store)
const { isAdmin } = storeToRefs(authStore)

const searchQuery = ref('')
const selectedComposer = ref('')
const selectedInstrument = ref('')
const viewMode = ref('grid')
const sortBy = ref('newest')

const actionError = ref('')
const modalOpen = ref(false)
const saving = ref(false)
const editingId = ref(null)
const formError = ref('')

const emptyForm = () => ({
  title: '',
  composer: '',
  arranger: 'Original',
  instrument: 'Piano',
  category: 'Classical'
})

const form = ref(emptyForm())

const composers = computed(() => [...new Set(sheetMusic.value.map((s) => s.composer))])
const instruments = computed(() => [...new Set(sheetMusic.value.map((s) => s.instrument))])

const filteredMusic = computed(() => {
  let result = sheetMusic.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(
      (s) =>
        s.title?.toLowerCase().includes(q) ||
        s.composer?.toLowerCase().includes(q)
    )
  }
  if (selectedComposer.value) result = result.filter((s) => s.composer === selectedComposer.value)
  if (selectedInstrument.value) result = result.filter((s) => s.instrument === selectedInstrument.value)

  if (sortBy.value === 'newest') {
    result = [...result].sort((a, b) => new Date(b.dateAdded ?? 0) - new Date(a.dateAdded ?? 0))
  } else if (sortBy.value === 'title') {
    result = [...result].sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''))
  }
  return result
})

function openCreate() {
  editingId.value = null
  form.value = emptyForm()
  formError.value = ''
  modalOpen.value = true
}

function openEdit(item) {
  editingId.value = item.id
  form.value = {
    title: item.title ?? '',
    composer: item.composer ?? '',
    arranger: item.arranger ?? '',
    instrument: item.instrument ?? '',
    category: item.category ?? ''
  }
  formError.value = ''
  modalOpen.value = true
}

async function save() {
  if (!form.value.title.trim() || !form.value.composer.trim()) {
    formError.value = 'Title and composer are required.'
    return
  }

  saving.value = true
  formError.value = ''
  actionError.value = ''

  const payload = {
    title: form.value.title.trim(),
    composer: form.value.composer.trim(),
    arranger: form.value.arranger.trim(),
    instrument: form.value.instrument.trim(),
    category: form.value.category.trim()
  }

  try {
    if (editingId.value) {
      await store.updateItem('sheetMusic', editingId.value, payload)
    } else {
      await store.createItem('sheetMusic', { ...payload, favorite: false })
    }
    modalOpen.value = false
  } catch (err) {
    formError.value =
      err?.code === 'permission-denied'
        ? 'Only administrators can modify the library.'
        : 'Could not save this entry. Please try again.'
  } finally {
    saving.value = false
  }
}

async function remove(item) {
  if (!window.confirm(`Delete "${item.title}"?`)) return
  actionError.value = ''
  try {
    await store.deleteItem('sheetMusic', item.id)
  } catch (err) {
    actionError.value =
      err?.code === 'permission-denied'
        ? 'Only administrators can delete entries.'
        : 'Could not delete this entry. Please try again.'
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h1 class="font-serif text-3xl lg:text-4xl font-semibold text-brand-900">Sheet Music</h1>
        <p class="text-brand-400 mt-1">{{ filteredMusic.length }} pieces in your library</p>
      </div>
      <button v-if="isAdmin" class="btn-primary" @click="openCreate">
        <Plus class="w-4 h-4" />
        Add Sheet Music
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

    <!-- Loading / empty -->
    <div v-if="loading && sheetMusic.length === 0" class="flex items-center justify-center gap-2 py-16 text-sm text-brand-400">
      <Loader2 class="w-4 h-4 animate-spin" />
      Loading sheet music…
    </div>
    <div v-else-if="filteredMusic.length === 0" class="rounded-2xl border border-dashed border-brand-200 bg-white/60 px-6 py-14 text-center">
      <FileMusic class="mx-auto w-8 h-8 text-brand-300" />
      <p class="mt-3 font-medium text-brand-700">No sheet music found</p>
      <p class="text-sm text-brand-400">
        {{ isAdmin ? 'Add your first piece to get started.' : 'Check back soon for new additions.' }}
      </p>
    </div>

    <!-- Grid View -->
    <div v-else-if="viewMode === 'grid'" class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
            :aria-label="item.favorite ? 'Remove from favorites' : 'Add to favorites'"
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
        <div v-if="isAdmin" class="flex items-center gap-1 border-t border-brand-50 px-3 py-1.5">
          <button class="icon-btn" aria-label="Edit entry" @click="openEdit(item)">
            <Pencil class="w-4 h-4" />
          </button>
          <button class="icon-btn hover:text-red-600" aria-label="Delete entry" @click="remove(item)">
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- List View -->
    <div v-else class="bg-white rounded-2xl border border-brand-100 shadow-sm overflow-x-auto">
      <table class="w-full min-w-[640px]">
        <thead class="bg-brand-50/50 border-b border-brand-100">
          <tr>
            <th class="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-brand-500">Title</th>
            <th class="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-brand-500">Composer</th>
            <th class="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-brand-500">Instrument</th>
            <th class="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-brand-500">Added</th>
            <th class="w-28"></th>
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
              <div class="flex items-center justify-end gap-1">
                <button aria-label="Toggle favorite" @click="store.toggleFavorite(item.id, 'sheet')">
                  <Heart :class="['w-4 h-4', item.favorite ? 'fill-gold-500 text-gold-500' : 'text-brand-200 hover:text-brand-400']" />
                </button>
                <template v-if="isAdmin">
                  <button class="icon-btn" aria-label="Edit entry" @click="openEdit(item)">
                    <Pencil class="w-4 h-4" />
                  </button>
                  <button class="icon-btn hover:text-red-600" aria-label="Delete entry" @click="remove(item)">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </template>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <AppModal :open="modalOpen" :title="editingId ? 'Edit Sheet Music' : 'Add Sheet Music'" @close="modalOpen = false">
      <form class="space-y-4" @submit.prevent="save">
        <div>
          <label class="form-label" for="sheet-title">Title</label>
          <input id="sheet-title" v-model="form.title" class="form-input" type="text" required placeholder="Clair de Lune" />
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="form-label" for="sheet-composer">Composer</label>
            <input id="sheet-composer" v-model="form.composer" class="form-input" type="text" required placeholder="Claude Debussy" />
          </div>
          <div>
            <label class="form-label" for="sheet-arranger">Arranger</label>
            <input id="sheet-arranger" v-model="form.arranger" class="form-input" type="text" placeholder="Original" />
          </div>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="form-label" for="sheet-instrument">Instrument</label>
            <input id="sheet-instrument" v-model="form.instrument" class="form-input" type="text" placeholder="Piano" />
          </div>
          <div>
            <label class="form-label" for="sheet-category">Category</label>
            <input id="sheet-category" v-model="form.category" class="form-input" type="text" placeholder="Classical" />
          </div>
        </div>

        <p v-if="formError" class="text-sm text-red-600" role="alert">{{ formError }}</p>

        <div class="flex justify-end gap-2 pt-2">
          <button type="button" class="btn-muted" @click="modalOpen = false">Cancel</button>
          <button type="submit" class="btn-primary" :disabled="saving">
            <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
            {{ editingId ? 'Save changes' : 'Add piece' }}
          </button>
        </div>
      </form>
    </AppModal>
  </div>
</template>
