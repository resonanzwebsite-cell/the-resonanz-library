<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useLibraryStore } from '@/stores/library'
import AppModal from '@/components/AppModal.vue'
import {
  GraduationCap,
  Loader2,
  Mic2,
  Music,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
  User,
  Users
} from 'lucide-vue-next'

const store = useLibraryStore()
const authStore = useAuthStore()
const { people, loading } = storeToRefs(store)
const { isAdmin } = storeToRefs(authStore)

const searchQuery = ref('')
const selectedRole = ref('')

const actionError = ref('')
const modalOpen = ref(false)
const saving = ref(false)
const editingId = ref(null)
const formError = ref('')

const roleIcons = {
  Composer: Music,
  Conductor: Mic2,
  Performer: Star,
  Arranger: User,
  'Music Educator': GraduationCap
}

const emptyForm = () => ({
  name: '',
  role: 'Composer',
  era: '',
  works: 0
})

const form = ref(emptyForm())

const roles = computed(() => [...new Set(people.value.map((p) => p.role))])

const filteredPeople = computed(() => {
  let result = people.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter((p) => p.name?.toLowerCase().includes(q))
  }
  if (selectedRole.value) result = result.filter((p) => p.role === selectedRole.value)
  return result
})

function openCreate() {
  editingId.value = null
  form.value = emptyForm()
  formError.value = ''
  modalOpen.value = true
}

function openEdit(person) {
  editingId.value = person.id
  form.value = {
    name: person.name ?? '',
    role: person.role ?? 'Composer',
    era: person.era ?? '',
    works: Number(person.works ?? 0)
  }
  formError.value = ''
  modalOpen.value = true
}

async function save() {
  if (!form.value.name.trim()) {
    formError.value = 'A name is required.'
    return
  }

  saving.value = true
  formError.value = ''
  actionError.value = ''

  const payload = {
    name: form.value.name.trim(),
    role: form.value.role,
    era: form.value.era.trim(),
    works: Number(form.value.works) || 0
  }

  try {
    if (editingId.value) {
      await store.updateItem('people', editingId.value, payload)
    } else {
      await store.createItem('people', payload)
    }
    modalOpen.value = false
  } catch (err) {
    formError.value =
      err?.code === 'permission-denied'
        ? 'Only administrators can modify people.'
        : 'Could not save this person. Please try again.'
  } finally {
    saving.value = false
  }
}

async function remove(person) {
  if (!window.confirm(`Delete "${person.name}"?`)) return
  actionError.value = ''
  try {
    await store.deleteItem('people', person.id)
  } catch (err) {
    actionError.value =
      err?.code === 'permission-denied'
        ? 'Only administrators can delete people.'
        : 'Could not delete this person. Please try again.'
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h1 class="font-serif text-3xl lg:text-4xl font-semibold text-brand-900">People</h1>
        <p class="text-brand-400 mt-1">Composers, arrangers, performers, and educators in your library</p>
      </div>
      <button v-if="isAdmin" class="btn-primary" @click="openCreate">
        <Plus class="w-4 h-4" />
        Add Person
      </button>
    </div>

    <div
      v-if="actionError"
      class="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600"
      role="alert"
    >
      {{ actionError }}
    </div>

    <div class="flex flex-wrap items-center gap-3 p-4 bg-white rounded-xl border border-brand-100">
      <div class="flex items-center gap-2 px-3 py-2 bg-brand-50 rounded-lg flex-1 min-w-[200px] border border-brand-100">
        <Search class="w-4 h-4 text-brand-400" />
        <input v-model="searchQuery" type="text" placeholder="Search by name..." class="bg-transparent outline-none text-sm w-full" />
      </div>
      <select v-model="selectedRole" class="px-3 py-2 bg-brand-50 border border-brand-100 rounded-lg text-sm text-brand-700 outline-none">
        <option value="">All Roles</option>
        <option v-for="r in roles" :key="r" :value="r">{{ r }}</option>
      </select>
    </div>

    <div v-if="loading && people.length === 0" class="flex items-center justify-center gap-2 py-16 text-sm text-brand-400">
      <Loader2 class="w-4 h-4 animate-spin" />
      Loading people…
    </div>
    <div v-else-if="filteredPeople.length === 0" class="rounded-2xl border border-dashed border-brand-200 bg-white/60 px-6 py-14 text-center">
      <Users class="mx-auto w-8 h-8 text-brand-300" />
      <p class="mt-3 font-medium text-brand-700">No people found</p>
      <p class="text-sm text-brand-400">
        {{ isAdmin ? 'Add a composer or performer to get started.' : 'Check back soon for new additions.' }}
      </p>
    </div>

    <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="person in filteredPeople"
        :key="person.id"
        class="relative bg-white rounded-2xl border border-brand-100 shadow-sm hover:shadow-md transition-all p-5 flex items-start gap-4"
      >
        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-brand-100 to-brand-50 flex items-center justify-center shrink-0">
          <component :is="roleIcons[person.role] ?? User" class="w-5 h-5 text-brand-500" />
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-brand-900 pr-16">{{ person.name }}</h3>
          <p class="text-sm text-brand-500">{{ person.role }}</p>
          <div class="flex items-center gap-2 mt-2">
            <span class="px-2 py-0.5 bg-brand-50 text-brand-500 text-[11px] font-medium rounded-full">{{ person.era }}</span>
            <span v-if="person.works > 0" class="text-[11px] text-brand-400">{{ person.works }} works</span>
          </div>
        </div>

        <div v-if="isAdmin" class="absolute right-3 top-3 flex items-center gap-1">
          <button class="icon-btn" aria-label="Edit person" @click="openEdit(person)">
            <Pencil class="w-4 h-4" />
          </button>
          <button class="icon-btn hover:text-red-600" aria-label="Delete person" @click="remove(person)">
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <AppModal :open="modalOpen" :title="editingId ? 'Edit Person' : 'Add Person'" @close="modalOpen = false">
      <form class="space-y-4" @submit.prevent="save">
        <div>
          <label class="form-label" for="person-name">Name</label>
          <input id="person-name" v-model="form.name" class="form-input" type="text" required placeholder="Claude Debussy" />
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="form-label" for="person-role">Role</label>
            <select id="person-role" v-model="form.role" class="form-input">
              <option value="Composer">Composer</option>
              <option value="Conductor">Conductor</option>
              <option value="Performer">Performer</option>
              <option value="Arranger">Arranger</option>
              <option value="Music Educator">Music Educator</option>
            </select>
          </div>
          <div>
            <label class="form-label" for="person-era">Era</label>
            <input id="person-era" v-model="form.era" class="form-input" type="text" placeholder="Impressionist" />
          </div>
        </div>
        <div>
          <label class="form-label" for="person-works">Works</label>
          <input id="person-works" v-model.number="form.works" class="form-input" type="number" min="0" />
        </div>

        <p v-if="formError" class="text-sm text-red-600" role="alert">{{ formError }}</p>

        <div class="flex justify-end gap-2 pt-2">
          <button type="button" class="btn-muted" @click="modalOpen = false">Cancel</button>
          <button type="submit" class="btn-primary" :disabled="saving">
            <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
            {{ editingId ? 'Save changes' : 'Add person' }}
          </button>
        </div>
      </form>
    </AppModal>
  </div>
</template>
