<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useLibraryStore } from '@/stores/library'
import AppModal from '@/components/AppModal.vue'
import {
  ArrowRight,
  FolderOpen,
  GraduationCap,
  Loader2,
  Music,
  Pencil,
  Plus,
  Star,
  Trash2
} from 'lucide-vue-next'

const store = useLibraryStore()
const authStore = useAuthStore()
const { collections, loading } = storeToRefs(store)
const { isAdmin } = storeToRefs(authStore)

const actionError = ref('')
const modalOpen = ref(false)
const saving = ref(false)
const editingId = ref(null)
const formError = ref('')

const emptyForm = () => ({
  name: '',
  type: 'Concert',
  count: 0,
  color: 'brand'
})

const form = ref(emptyForm())

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

const colorBars = {
  brand: 'bg-brand-500',
  gold: 'bg-gold-500',
  emerald: 'bg-emerald-500',
  violet: 'bg-violet-500'
}

function openCreate() {
  editingId.value = null
  form.value = emptyForm()
  formError.value = ''
  modalOpen.value = true
}

function openEdit(collection) {
  editingId.value = collection.id
  form.value = {
    name: collection.name ?? '',
    type: collection.type ?? 'Custom',
    count: Number(collection.count ?? 0),
    color: collection.color ?? 'brand'
  }
  formError.value = ''
  modalOpen.value = true
}

async function save() {
  if (!form.value.name.trim()) {
    formError.value = 'A collection name is required.'
    return
  }

  saving.value = true
  formError.value = ''
  actionError.value = ''

  const payload = {
    name: form.value.name.trim(),
    type: form.value.type,
    count: Number(form.value.count) || 0,
    color: form.value.color
  }

  try {
    if (editingId.value) {
      await store.updateItem('collections', editingId.value, payload)
    } else {
      await store.createItem('collections', payload)
    }
    modalOpen.value = false
  } catch (err) {
    formError.value =
      err?.code === 'permission-denied'
        ? 'Only administrators can modify collections.'
        : 'Could not save this collection. Please try again.'
  } finally {
    saving.value = false
  }
}

async function remove(collection) {
  if (!window.confirm(`Delete "${collection.name}"?`)) return
  actionError.value = ''
  try {
    await store.deleteItem('collections', collection.id)
  } catch (err) {
    actionError.value =
      err?.code === 'permission-denied'
        ? 'Only administrators can delete collections.'
        : 'Could not delete this collection. Please try again.'
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h1 class="font-serif text-3xl lg:text-4xl font-semibold text-brand-900">Collections</h1>
        <p class="text-brand-400 mt-1">Organize your materials into curated sets</p>
      </div>
      <button v-if="isAdmin" class="btn-primary" @click="openCreate">
        <Plus class="w-4 h-4" />
        New Collection
      </button>
    </div>

    <div
      v-if="actionError"
      class="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600"
      role="alert"
    >
      {{ actionError }}
    </div>

    <div v-if="loading && collections.length === 0" class="flex items-center justify-center gap-2 py-16 text-sm text-brand-400">
      <Loader2 class="w-4 h-4 animate-spin" />
      Loading collections…
    </div>
    <div v-else-if="collections.length === 0" class="rounded-2xl border border-dashed border-brand-200 bg-white/60 px-6 py-14 text-center">
      <FolderOpen class="mx-auto w-8 h-8 text-brand-300" />
      <p class="mt-3 font-medium text-brand-700">No collections yet</p>
      <p class="text-sm text-brand-400">
        {{ isAdmin ? 'Create your first collection to organize the library.' : 'Check back soon for curated sets.' }}
      </p>
    </div>

    <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="collection in collections"
        :key="collection.id"
        class="relative bg-white rounded-2xl border border-brand-100 shadow-sm hover:shadow-lg transition-all group cursor-pointer overflow-hidden"
      >
        <div :class="['h-2', colorBars[collection.color] ?? 'bg-brand-500']" />

        <div v-if="isAdmin" class="absolute right-3 top-4 z-10 flex items-center gap-1 rounded-lg bg-white/90 p-0.5 shadow-sm backdrop-blur-sm">
          <button class="icon-btn" aria-label="Edit collection" @click.stop="openEdit(collection)">
            <Pencil class="w-4 h-4" />
          </button>
          <button class="icon-btn hover:text-red-600" aria-label="Delete collection" @click.stop="remove(collection)">
            <Trash2 class="w-4 h-4" />
          </button>
        </div>

        <div class="p-5">
          <div class="flex items-start justify-between">
            <div :class="['w-11 h-11 rounded-xl border flex items-center justify-center', typeColors[collection.type] ?? typeColors.Custom]">
              <component :is="typeIcons[collection.type] ?? FolderOpen" class="w-5 h-5" />
            </div>
            <span :class="['px-2 py-0.5 bg-brand-50 text-brand-500 text-[11px] font-medium rounded-full', isAdmin ? 'mr-14' : '']">{{ collection.type }}</span>
          </div>
          <h3 class="mt-4 font-semibold text-brand-900 group-hover:text-brand-700 transition-colors">{{ collection.name }}</h3>
          <p class="text-sm text-brand-400 mt-0.5">{{ collection.count }} items</p>
          <div class="mt-4 flex items-center text-brand-400 group-hover:text-brand-600 transition-colors text-sm font-medium">
            Open collection <ArrowRight class="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      <!-- Add new card -->
      <button
        v-if="isAdmin"
        class="rounded-2xl border-2 border-dashed border-brand-200 p-5 flex flex-col items-center justify-center gap-2 text-brand-300 hover:text-brand-500 hover:border-brand-300 hover:bg-brand-50/30 transition-all min-h-[200px]"
        @click="openCreate"
      >
        <Plus class="w-8 h-8" />
        <span class="text-sm font-medium">Create Collection</span>
      </button>
    </div>

    <AppModal :open="modalOpen" :title="editingId ? 'Edit Collection' : 'New Collection'" @close="modalOpen = false">
      <form class="space-y-4" @submit.prevent="save">
        <div>
          <label class="form-label" for="collection-name">Name</label>
          <input id="collection-name" v-model="form.name" class="form-input" type="text" required placeholder="Spring Concert 2026" />
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="form-label" for="collection-type">Type</label>
            <select id="collection-type" v-model="form.type" class="form-input">
              <option value="Concert">Concert</option>
              <option value="Rehearsal">Rehearsal</option>
              <option value="Learning">Learning</option>
              <option value="Custom">Custom</option>
            </select>
          </div>
          <div>
            <label class="form-label" for="collection-count">Items</label>
            <input id="collection-count" v-model.number="form.count" class="form-input" type="number" min="0" />
          </div>
        </div>
        <div>
          <label class="form-label" for="collection-color">Accent color</label>
          <select id="collection-color" v-model="form.color" class="form-input">
            <option value="brand">Violet</option>
            <option value="gold">Gold</option>
            <option value="emerald">Emerald</option>
            <option value="violet">Lilac</option>
          </select>
        </div>

        <p v-if="formError" class="text-sm text-red-600" role="alert">{{ formError }}</p>

        <div class="flex justify-end gap-2 pt-2">
          <button type="button" class="btn-muted" @click="modalOpen = false">Cancel</button>
          <button type="submit" class="btn-primary" :disabled="saving">
            <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
            {{ editingId ? 'Save changes' : 'Create collection' }}
          </button>
        </div>
      </form>
    </AppModal>
  </div>
</template>
