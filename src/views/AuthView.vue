<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Music,
  ShieldCheck,
  Sparkles,
  User
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const isRegister = ref(route.query.mode === 'register')
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const localError = ref('')

const loading = computed(() => auth.loading)
const error = computed(() => localError.value || auth.error)

const heading = computed(() => (isRegister.value ? 'Create your account' : 'Welcome back'))
const subheading = computed(() =>
  isRegister.value
    ? 'Begin curating your personal music library.'
    : 'Sign in to continue to your library.'
)
const submitLabel = computed(() => {
  if (loading.value) return 'Please wait…'
  return isRegister.value ? 'Create account' : 'Sign in'
})

const features = [
  { icon: ShieldCheck, title: 'Secure authentication', text: 'Protected by Firebase Authentication.' },
  { icon: Sparkles, title: 'Always in sync', text: 'Your library available on every device.' },
  { icon: Music, title: 'Made for musicians', text: 'Collections, sheet music and notes in one place.' }
]

function destination() {
  const redirect = route.query.redirect
  return typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')
    ? redirect
    : '/'
}

function switchMode() {
  isRegister.value = !isRegister.value
  localError.value = ''
  auth.clearError()
  password.value = ''
  confirmPassword.value = ''
}

async function handleSubmit() {
  localError.value = ''
  auth.clearError()

  if (isRegister.value && password.value !== confirmPassword.value) {
    localError.value = 'Passwords do not match.'
    return
  }

  try {
    if (isRegister.value) {
      await auth.register({ name: name.value, email: email.value, password: password.value })
    } else {
      await auth.login({ email: email.value, password: password.value })
    }
    await router.replace(destination())
  } catch {
    // The store exposes a human readable error message.
  }
}

async function handleGoogle() {
  localError.value = ''
  auth.clearError()
  try {
    await auth.loginWithGoogle()
    await router.replace(destination())
  } catch {
    // The store exposes a human readable error message.
  }
}
</script>

<template>
  <div class="min-h-screen lg:grid lg:grid-cols-[1.05fr_1fr]">
    <!-- Brand panel -->
    <aside class="relative hidden overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 px-12 py-14 lg:flex lg:flex-col lg:justify-between">
      <div
        class="pointer-events-none absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full border border-white/10"
        aria-hidden="true"
      />
      <div
        class="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gold-400/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        class="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full border border-white/5"
        aria-hidden="true"
      />

      <div class="relative flex items-center gap-3">
        <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-gold-300 to-gold-600 shadow-lg shadow-gold-500/25">
          <Music class="h-5 w-5 text-brand-950" />
        </div>
        <div>
          <p class="font-serif text-lg font-semibold leading-tight text-white">The Resonanz</p>
          <p class="text-[10px] font-medium uppercase tracking-[0.24em] text-white/50">Library</p>
        </div>
      </div>

      <div class="relative max-w-md">
        <p class="mb-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-300/90">
          Your private music collection
        </p>
        <h1 class="font-serif text-4xl font-semibold leading-[1.15] text-white">
          A library worthy of the music you love.
        </h1>
        <p class="mt-4 text-sm leading-relaxed text-white/60">
          Gather sheet music, recordings and the people behind them into one refined,
          personal archive — wherever you are.
        </p>

        <ul class="mt-10 space-y-5">
          <li v-for="feature in features" :key="feature.title" class="flex items-start gap-3.5">
            <span class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-inset ring-white/10">
              <component :is="feature.icon" class="h-4 w-4 text-gold-300" />
            </span>
            <div>
              <p class="text-sm font-medium text-white">{{ feature.title }}</p>
              <p class="text-xs leading-relaxed text-white/50">{{ feature.text }}</p>
            </div>
          </li>
        </ul>
      </div>

      <p class="relative text-xs text-white/35">© 2026 The Resonanz Library. Curated with care.</p>
    </aside>

    <!-- Form panel -->
    <main class="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
      <div class="w-full max-w-md">
        <!-- Mobile logo -->
        <div class="mb-8 flex items-center justify-center gap-3 lg:hidden">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-500/20">
            <Music class="h-5 w-5 text-white" />
          </div>
          <div>
            <p class="font-serif text-lg font-semibold leading-tight text-brand-900">The Resonanz</p>
            <p class="text-[10px] font-medium uppercase tracking-[0.2em] text-brand-400">Library</p>
          </div>
        </div>

        <div class="rounded-2xl border border-brand-100 bg-white/90 p-6 shadow-[0_2px_8px_rgb(35_27_58_/_0.04),0_24px_60px_rgb(35_27_58_/_0.06)] backdrop-blur-xl sm:p-8">
          <div class="mb-6">
            <h2 class="font-serif text-2xl font-semibold text-brand-900 sm:text-3xl">{{ heading }}</h2>
            <p class="mt-1.5 text-sm text-brand-400">{{ subheading }}</p>
          </div>

          <div
            v-if="error"
            class="mb-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-600"
            role="alert"
          >
            <AlertCircle class="mt-0.5 h-4 w-4 shrink-0" />
            <span>{{ error }}</span>
          </div>

          <button
            type="button"
            :disabled="loading"
            class="flex w-full items-center justify-center gap-2.5 rounded-lg border border-brand-200 bg-white px-4 py-2.5 text-sm font-medium text-brand-700 transition-colors hover:border-brand-300 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-60"
            @click="handleGoogle"
          >
            <svg viewBox="0 0 24 24" class="h-4 w-4" aria-hidden="true">
              <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.55-5.17 3.55-8.87z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.28v3.09A12 12 0 0 0 12 24z" />
              <path fill="#FBBC05" d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.28a12 12 0 0 0 0 10.76l3.99-3.09z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.62l3.99 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
            </svg>
            Continue with Google
          </button>

          <div class="my-5 flex items-center gap-3">
            <span class="h-px flex-1 bg-brand-100" />
            <span class="text-[11px] font-medium uppercase tracking-wider text-brand-300">or</span>
            <span class="h-px flex-1 bg-brand-100" />
          </div>

          <form class="space-y-4" @submit.prevent="handleSubmit">
            <div v-if="isRegister">
              <label for="name" class="mb-1.5 block text-sm font-medium text-brand-700">Full name</label>
              <div class="relative">
                <User class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-300" />
                <input
                  id="name"
                  v-model="name"
                  type="text"
                  autocomplete="name"
                  placeholder="Alexandra Richter"
                  class="w-full rounded-lg border border-brand-200 bg-white py-2.5 pl-10 pr-3 text-sm text-brand-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/15"
                />
              </div>
            </div>

            <div>
              <label for="email" class="mb-1.5 block text-sm font-medium text-brand-700">Email address</label>
              <div class="relative">
                <Mail class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-300" />
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  autocomplete="email"
                  required
                  autofocus
                  placeholder="you@example.com"
                  class="w-full rounded-lg border border-brand-200 bg-white py-2.5 pl-10 pr-3 text-sm text-brand-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/15"
                />
              </div>
            </div>

            <div>
              <label for="password" class="mb-1.5 block text-sm font-medium text-brand-700">Password</label>
              <div class="relative">
                <Lock class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-300" />
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  :autocomplete="isRegister ? 'new-password' : 'current-password'"
                  required
                  :minlength="isRegister ? 6 : undefined"
                  placeholder="••••••••"
                  class="w-full rounded-lg border border-brand-200 bg-white py-2.5 pl-10 pr-11 text-sm text-brand-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/15"
                />
                <button
                  type="button"
                  class="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-brand-300 transition-colors hover:bg-brand-50 hover:text-brand-600"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                  @click="showPassword = !showPassword"
                >
                  <EyeOff v-if="showPassword" class="h-4 w-4" />
                  <Eye v-else class="h-4 w-4" />
                </button>
              </div>
              <p v-if="isRegister" class="mt-1.5 text-xs text-brand-300">At least 6 characters.</p>
            </div>

            <div v-if="isRegister">
              <label for="confirm-password" class="mb-1.5 block text-sm font-medium text-brand-700">Confirm password</label>
              <div class="relative">
                <Lock class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-300" />
                <input
                  id="confirm-password"
                  v-model="confirmPassword"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="new-password"
                  required
                  :minlength="6"
                  placeholder="••••••••"
                  class="w-full rounded-lg border border-brand-200 bg-white py-2.5 pl-10 pr-3 text-sm text-brand-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/15"
                />
              </div>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="group flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Loader2 v-if="loading" class="h-4 w-4 animate-spin" />
              <span>{{ submitLabel }}</span>
              <ArrowRight v-if="!loading" class="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>

          <p class="mt-6 text-center text-sm text-brand-400">
            {{ isRegister ? 'Already have an account?' : 'New to the library?' }}
            <button
              type="button"
              class="font-semibold text-brand-600 transition-colors hover:text-brand-700"
              @click="switchMode"
            >
              {{ isRegister ? 'Sign in' : 'Create one' }}
            </button>
          </p>
        </div>

        <p class="mt-6 text-center text-xs text-brand-300">
          By continuing you agree to keep the music flowing.
        </p>
      </div>
    </main>
  </div>
</template>
