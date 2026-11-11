import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useLibraryStore = defineStore('library', () => {
  // State
  const sheetMusic = ref([
    { id: 1, title: 'Clair de Lune', composer: 'Claude Debussy', arranger: 'Original', instrument: 'Piano', category: 'Impressionist', favorite: true, dateAdded: '2026-01-15' },
    { id: 2, title: 'Symphony No. 5', composer: 'Ludwig van Beethoven', arranger: 'Various', instrument: 'Orchestra', category: 'Classical', favorite: false, dateAdded: '2026-01-10' },
    { id: 3, title: 'Nocturne Op. 9 No. 2', composer: 'Frédéric Chopin', arranger: 'Original', instrument: 'Piano', category: 'Romantic', favorite: true, dateAdded: '2026-01-08' },
    { id: 4, title: 'The Four Seasons', composer: 'Antonio Vivaldi', arranger: 'String Quartet', instrument: 'Strings', category: 'Baroque', favorite: false, dateAdded: '2026-01-05' },
    { id: 5, title: 'Rhapsody in Blue', composer: 'George Gershwin', arranger: 'Jazz Band', instrument: 'Piano', category: 'Jazz', favorite: true, dateAdded: '2026-01-03' },
    { id: 6, title: 'Cello Suite No. 1', composer: 'J.S. Bach', arranger: 'Original', instrument: 'Cello', category: 'Baroque', favorite: false, dateAdded: '2025-12-28' }
  ])

  const videos = ref([
    { id: 1, title: 'Clair de Lune - Lang Lang', channel: 'Lang Lang', category: 'Performance', saved: true, timestamp: '2026-01-14', notes: 'Beautiful interpretation, note the rubato at 2:34' },
    { id: 2, title: 'Beethoven 5th Symphony Analysis', channel: 'Music Theory Academy', category: 'Education', saved: true, timestamp: '2026-01-12', notes: 'Excellent breakdown of motivic development' },
    { id: 3, title: 'Chopin Nocturne Tutorial', channel: 'Piano Masterclass', category: 'Tutorial', saved: false, timestamp: null, notes: '' },
    { id: 4, title: 'Vivaldi Four Seasons Full', channel: 'Netherlands Bach Society', category: 'Performance', saved: true, timestamp: '2026-01-10', notes: 'Reference recording for rehearsal' }
  ])

  const collections = ref([
    { id: 1, name: 'Spring Concert 2026', type: 'Concert', count: 12, color: 'brand' },
    { id: 2, name: 'Weekly Rehearsal', type: 'Rehearsal', count: 8, color: 'gold' },
    { id: 3, name: 'Piano Learning Path', type: 'Learning', count: 15, color: 'emerald' },
    { id: 4, name: 'Chamber Music', type: 'Custom', count: 6, color: 'violet' }
  ])

  const people = ref([
    { id: 1, name: 'Claude Debussy', role: 'Composer', era: 'Impressionist', works: 45 },
    { id: 2, name: 'Ludwig van Beethoven', role: 'Composer', era: 'Classical/Romantic', works: 138 },
    { id: 3, name: 'Frédéric Chopin', role: 'Composer', era: 'Romantic', works: 89 },
    { id: 4, name: 'Leonard Bernstein', role: 'Conductor', era: '20th Century', works: 0 },
    { id: 5, name: 'Yo-Yo Ma', role: 'Performer', era: 'Contemporary', works: 0 },
    { id: 6, name: 'Nadia Boulanger', role: 'Music Educator', era: '20th Century', works: 0 }
  ])

  const recentlyOpened = ref([
    { id: 1, title: 'Clair de Lune', type: 'sheet', lastOpened: '2 hours ago' },
    { id: 2, title: 'Beethoven 5th Analysis', type: 'video', lastOpened: '5 hours ago' },
    { id: 3, title: 'Nocturne Op. 9 No. 2', type: 'sheet', lastOpened: 'Yesterday' },
    { id: 4, title: 'Spring Concert Program', type: 'collection', lastOpened: '2 days ago' }
  ])

  // Getters
  const totalMaterials = computed(() => sheetMusic.value.length + videos.value.length)
  const totalFavorites = computed(() => sheetMusic.value.filter(s => s.favorite).length + videos.value.filter(v => v.saved).length)
  const totalCollections = computed(() => collections.value.length)
  const totalPeople = computed(() => people.value.length)

  const recentMaterials = computed(() => {
    return [...sheetMusic.value]
      .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
      .slice(0, 5)
  })

  const favoriteItems = computed(() => {
    return [
      ...sheetMusic.value.filter(s => s.favorite).map(s => ({ ...s, type: 'sheet' })),
      ...videos.value.filter(v => v.saved).map(v => ({ ...v, type: 'video' }))
    ]
  })

  // Actions
  function toggleFavorite(id, type) {
    if (type === 'sheet') {
      const item = sheetMusic.value.find(s => s.id === id)
      if (item) item.favorite = !item.favorite
    } else {
      const item = videos.value.find(v => v.id === id)
      if (item) item.saved = !item.saved
    }
  }

  function addSheetMusic(item) {
    sheetMusic.value.unshift({
      id: Date.now(),
      ...item,
      favorite: false,
      dateAdded: new Date().toISOString().split('T')[0]
    })
  }

  return {
    sheetMusic,
    videos,
    collections,
    people,
    recentlyOpened,
    totalMaterials,
    totalFavorites,
    totalCollections,
    totalPeople,
    recentMaterials,
    favoriteItems,
    toggleFavorite,
    addSheetMusic
  }
})