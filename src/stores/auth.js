import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db, googleProvider } from '@/firebase/config'

const USERS_COLLECTION = 'users'

async function ensureUserDocument(firebaseUser) {
  if (!firebaseUser) return

  const userRef = doc(db, USERS_COLLECTION, firebaseUser.uid)
  const snapshot = await getDoc(userRef)

  const profile = {
    uid: firebaseUser.uid,
    email: firebaseUser.email ?? null,
    displayName: firebaseUser.displayName ?? null,
    photoURL: firebaseUser.photoURL ?? null,
    updatedAt: serverTimestamp()
  }

  if (!snapshot.exists()) {
    await setDoc(userRef, {
      ...profile,
      role: 'guest',
      createdAt: serverTimestamp()
    })
    return
  }

  const existing = snapshot.data()
  await setDoc(
    userRef,
    {
      ...profile,
      role: existing.role ?? 'guest'
    },
    { merge: true }
  )
}

function messageFor(error) {
  switch (error?.code) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/missing-password':
      return 'Please enter your password.'
    case 'auth/weak-password':
      return 'Password must be at least 6 characters long.'
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Try signing in instead.'
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.'
    case 'auth/user-disabled':
      return 'This account has been disabled.'
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Google sign-in was cancelled.'
    case 'auth/popup-blocked':
      return 'Your browser blocked the Google sign-in popup. Please allow popups and try again.'
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email using another sign-in method.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again in a moment.'
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.'
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled in Firebase.'
    default:
      return error?.message || 'Something went wrong. Please try again.'
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)
  const error = ref('')

  let started = false
  let resolveReady
  const ready = new Promise((resolve) => {
    resolveReady = resolve
  })

  const isAuthenticated = computed(() => Boolean(user.value))

  const displayName = computed(() => {
    const current = user.value
    if (!current) return 'Member'
    if (current.displayName) return current.displayName
    if (current.email) return current.email.split('@')[0]
    return 'Member'
  })

  const initials = computed(() => {
    const parts = displayName.value.split(/[\s._-]+/).filter(Boolean).slice(0, 2)
    return parts.map((part) => part[0].toUpperCase()).join('') || 'M'
  })

  const avatarUrl = computed(() => user.value?.photoURL || null)

  function init() {
    if (started) return ready
    started = true
    onAuthStateChanged(auth, (firebaseUser) => {
      user.value = firebaseUser
      resolveReady()

      if (firebaseUser) {
        ensureUserDocument(firebaseUser).catch((err) => {
          console.error('Failed to sync user document:', err)
        })
      }
    })
    return ready
  }

  async function run(action) {
    loading.value = true
    error.value = ''
    try {
      await action()
    } catch (err) {
      error.value = messageFor(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  function register({ name, email, password }) {
    return run(async () => {
      const credential = await createUserWithEmailAndPassword(auth, email, password)
      const trimmedName = name?.trim()
      if (trimmedName) {
        await updateProfile(credential.user, { displayName: trimmedName })
        user.value = auth.currentUser
      }

      await ensureUserDocument(auth.currentUser).catch((err) => {
        console.error('Failed to save user document:', err)
      })
    })
  }

  function login({ email, password }) {
    return run(() => signInWithEmailAndPassword(auth, email, password))
  }

  function loginWithGoogle() {
    return run(() => signInWithPopup(auth, googleProvider))
  }

  function logout() {
    error.value = ''
    return signOut(auth)
  }

  function clearError() {
    error.value = ''
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    displayName,
    initials,
    avatarUrl,
    init,
    register,
    login,
    loginWithGoogle,
    logout,
    clearError
  }
})
