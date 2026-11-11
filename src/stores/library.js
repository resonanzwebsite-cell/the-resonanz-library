import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore'
import { db } from '@/firebase/config'

const COLLECTION_NAMES = ['sheetMusic', 'videos', 'collections', 'people']

function mapDocument(snapshot) {
  return { id: snapshot.id, ...snapshot.data() }
}

export const useLibraryStore = defineStore('library', () => {
  const sheetMusic = ref([])
  const videos = ref([])
  const collections = ref([])
  const people = ref([])

  const recentlyOpened = ref([
    { id: 1, title: 'Clair de Lune', type: 'sheet', lastOpened: '2 hours ago' },
    { id: 2, title: 'Beethoven 5th Analysis', type: 'video', lastOpened: '5 hours ago' },
    { id: 3, title: 'Nocturne Op. 9 No. 2', type: 'sheet', lastOpened: 'Yesterday' },
    { id: 4, title: 'Spring Concert Program', type: 'collection', lastOpened: '2 days ago' }
  ])

  const loading = ref(true)
  const error = ref('')
  const started = ref(false)
  let unsubscribers = []

  function start() {
    if (started.value) return
    started.value = true
    loading.value = true
    error.value = ''

    let pending = COLLECTION_NAMES.length
    const settle = () => {
      pending -= 1
      if (pending <= 0) loading.value = false
    }

    unsubscribers = [
      listen('sheetMusic', sheetMusic, settle),
      listen('videos', videos, settle),
      listen('collections', collections, settle),
      listen('people', people, settle)
    ]
  }

  function listen(name, target, settle) {
    return onSnapshot(
      collection(db, name),
      (snapshot) => {
        target.value = snapshot.docs.map(mapDocument)
        settle()
      },
      (err) => {
        console.error(`Failed to load ${name}:`, err)
        error.value = 'Could not load library data from Firestore.'
        settle()
      }
    )
  }

  function stop() {
    unsubscribers.forEach((unsubscribe) => unsubscribe())
    unsubscribers = []
    started.value = false
  }

  function assertCollection(name) {
    if (!COLLECTION_NAMES.includes(name)) {
      throw new Error(`Unknown collection: ${name}`)
    }
  }

  async function createItem(name, data) {
    assertCollection(name)
    const document = await addDoc(collection(db, name), {
      ...data,
      dateAdded: data.dateAdded ?? new Date().toISOString().slice(0, 10),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return document.id
  }

  async function updateItem(name, id, data) {
    assertCollection(name)
    await updateDoc(doc(db, name, id), {
      ...data,
      updatedAt: serverTimestamp()
    })
  }

  async function deleteItem(name, id) {
    assertCollection(name)
    await deleteDoc(doc(db, name, id))
  }

  // Getters
  const totalMaterials = computed(() => sheetMusic.value.length + videos.value.length)
  const totalFavorites = computed(
    () =>
      sheetMusic.value.filter((item) => item.favorite).length +
      videos.value.filter((item) => item.saved).length
  )
  const totalCollections = computed(() => collections.value.length)
  const totalPeople = computed(() => people.value.length)

  const recentMaterials = computed(() => {
    return [...sheetMusic.value]
      .sort((a, b) => new Date(b.dateAdded ?? 0) - new Date(a.dateAdded ?? 0))
      .slice(0, 5)
  })

  const favoriteItems = computed(() => {
    return [
      ...sheetMusic.value.filter((item) => item.favorite).map((item) => ({ ...item, type: 'sheet' })),
      ...videos.value.filter((item) => item.saved).map((item) => ({ ...item, type: 'video' }))
    ]
  })

  // Local-only favorites (not persisted to Firestore)
  function toggleFavorite(id, type) {
    if (type === 'sheet') {
      const item = sheetMusic.value.find((entry) => entry.id === id)
      if (item) item.favorite = !item.favorite
    } else {
      const item = videos.value.find((entry) => entry.id === id)
      if (item) item.saved = !item.saved
    }
  }

  function addSheetMusic(item) {
    return createItem('sheetMusic', { ...item, favorite: false })
  }

  return {
    sheetMusic,
    videos,
    collections,
    people,
    recentlyOpened,
    loading,
    error,
    start,
    stop,
    createItem,
    updateItem,
    deleteItem,
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
