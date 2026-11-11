<script setup>
import { ref, computed } from 'vue'
import { useLibraryStore } from '@/stores/library'
import { Search, User, Music, Mic2, GraduationCap, Star } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

const store = useLibraryStore()
const { people } = storeToRefs(store)

const searchQuery = ref('')
const selectedRole = ref('')

const roles = computed(() => [...new Set(people.value.map(p => p.role))])

const filteredPeople = computed(() => {
  let result = people.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(p => p.name.toLowerCase().includes(q))
  }
  if (selectedRole.value) result = result.filter(p => p.role === selectedRole.value)
  return result
})

const roleIcons = {
  Composer: Music,
  Conductor: Mic2,
  Performer: Star,
  Arranger: User,
  'Music Educator': GraduationCap
}
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-6">
    <div>
      <h1 class="font-serif text-3xl lg:text-4xl font-semibold text-brand-900">People</h1>
      <p class="text-brand-400 mt-1">Composers, arrangers, performers, and educators in your library</p>
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

    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="person in filteredPeople" 
        :key="person.id"
        class="bg-white rounded-2xl border border-brand-100 shadow-sm hover:shadow-md transition-all p-5 flex items-start gap-4"
      >
        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-brand-100 to-brand-50 flex items-center justify-center shrink-0">
          <component :is="roleIcons[person.role]" class="w-5 h-5 text-brand-500" />
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-brand-900">{{ person.name }}</h3>
          <p class="text-sm text-brand-500">{{ person.role }}</p>
          <div class="flex items-center gap-2 mt-2">
            <span class="px-2 py-0.5 bg-brand-50 text-brand-500 text-[11px] font-medium rounded-full">{{ person.era }}</span>
            <span v-if="person.works > 0" class="text-[11px] text-brand-400">{{ person.works }} works</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>