<script setup>
import { ref } from 'vue'
import { User, Palette, Download, HardDrive, Bell, Shield, ChevronRight } from 'lucide-vue-next'

const activeTab = ref('account')

const tabs = [
  { id: 'account', name: 'Account', icon: User },
  { id: 'preferences', name: 'Library Preferences', icon: Palette },
  { id: 'data', name: 'Data Import/Export', icon: Download },
  { id: 'storage', name: 'Storage', icon: HardDrive }
]
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-6">
    <div>
      <h1 class="font-serif text-3xl lg:text-4xl font-semibold text-brand-900">Settings</h1>
      <p class="text-brand-400 mt-1">Manage your account and library preferences</p>
    </div>

    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Sidebar tabs -->
      <nav class="lg:w-56 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
            activeTab === tab.id
              ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20'
              : 'text-brand-500 hover:bg-brand-50 hover:text-brand-700'
          ]"
        >
          <component :is="tab.icon" class="w-4 h-4" />
          {{ tab.name }}
        </button>
      </nav>

      <!-- Content -->
      <div class="flex-1 bg-white rounded-2xl border border-brand-100 shadow-sm p-6">
        <!-- Account -->
        <div v-if="activeTab === 'account'" class="space-y-6">
          <div>
            <h2 class="font-semibold text-brand-900 text-lg">Account Information</h2>
            <p class="text-sm text-brand-400 mt-1">Your personal details and membership</p>
          </div>
          <div class="flex items-center gap-5">
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-white text-xl font-semibold shadow-lg shadow-gold-500/20">
              AR
            </div>
            <div>
              <p class="font-medium text-brand-900">Alexandra Richter</p>
              <p class="text-sm text-brand-400">alexandra.richter@email.com</p>
              <span class="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-gold-50 text-gold-700 text-[11px] font-semibold rounded-full">
                <Shield class="w-3 h-3" /> Premium Member
              </span>
            </div>
          </div>
          <div class="grid sm:grid-cols-2 gap-4 pt-4 border-t border-brand-100">
            <div>
              <label class="text-xs font-semibold uppercase tracking-wider text-brand-400">Display Name</label>
              <input type="text" value="Alexandra Richter" class="mt-1.5 w-full px-3 py-2.5 bg-brand-50 border border-brand-100 rounded-lg text-sm outline-none focus:border-brand-300" />
            </div>
            <div>
              <label class="text-xs font-semibold uppercase tracking-wider text-brand-400">Email</label>
              <input type="email" value="alexandra.richter@email.com" class="mt-1.5 w-full px-3 py-2.5 bg-brand-50 border border-brand-100 rounded-lg text-sm outline-none focus:border-brand-300" />
            </div>
          </div>
        </div>

        <!-- Preferences -->
        <div v-if="activeTab === 'preferences'" class="space-y-6">
          <div>
            <h2 class="font-semibold text-brand-900 text-lg">Library Preferences</h2>
            <p class="text-sm text-brand-400 mt-1">Customize how your library behaves</p>
          </div>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-brand-50/50 rounded-xl">
              <div>
                <p class="text-sm font-medium text-brand-900">Default View Mode</p>
                <p class="text-xs text-brand-400">Choose grid or list as default</p>
              </div>
              <select class="px-3 py-1.5 bg-white border border-brand-200 rounded-lg text-sm outline-none">
                <option>Grid</option>
                <option>List</option>
              </select>
            </div>
            <div class="flex items-center justify-between p-4 bg-brand-50/50 rounded-xl">
              <div>
                <p class="text-sm font-medium text-brand-900">Show Recently Opened</p>
                <p class="text-xs text-brand-400">Display recently opened items on dashboard</p>
              </div>
              <button class="w-10 h-6 rounded-full bg-brand-600 relative transition-colors">
                <span class="absolute top-1 right-1 w-4 h-4 rounded-full bg-white shadow-sm" />
              </button>
            </div>
            <div class="flex items-center justify-between p-4 bg-brand-50/50 rounded-xl">
              <div>
                <p class="text-sm font-medium text-brand-900">Email Notifications</p>
                <p class="text-xs text-brand-400">Receive updates about new materials</p>
              </div>
              <button class="w-10 h-6 rounded-full bg-brand-200 relative transition-colors">
                <span class="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm" />
              </button>
            </div>
          </div>
        </div>

        <!-- Data -->
        <div v-if="activeTab === 'data'" class="space-y-6">
          <div>
            <h2 class="font-semibold text-brand-900 text-lg">Data Import/Export</h2>
            <p class="text-sm text-brand-400 mt-1">Manage your library data</p>
          </div>
          <div class="space-y-3">
            <button class="w-full flex items-center justify-between p-4 bg-brand-50/50 rounded-xl hover:bg-brand-50 transition-colors text-left">
              <div class="flex items-center gap-3">
                <Download class="w-5 h-5 text-brand-500" />
                <div>
                  <p class="text-sm font-medium text-brand-900">Export Library</p>
                  <p class="text-xs text-brand-400">Download all your materials as JSON</p>
                </div>
              </div>
              <ChevronRight class="w-4 h-4 text-brand-300" />
            </button>
            <button class="w-full flex items-center justify-between p-4 bg-brand-50/50 rounded-xl hover:bg-brand-50 transition-colors text-left">
              <div class="flex items-center gap-3">
                <Download class="w-5 h-5 text-brand-500 rotate-180" />
                <div>
                  <p class="text-sm font-medium text-brand-900">Import Library</p>
                  <p class="text-xs text-brand-400">Import materials from a JSON backup</p>
                </div>
              </div>
              <ChevronRight class="w-4 h-4 text-brand-300" />
            </button>
          </div>
        </div>

        <!-- Storage -->
        <div v-if="activeTab === 'storage'" class="space-y-6">
          <div>
            <h2 class="font-semibold text-brand-900 text-lg">Storage Management</h2>
            <p class="text-sm text-brand-400 mt-1">Monitor your storage usage</p>
          </div>
          <div class="p-5 bg-brand-50/50 rounded-xl">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm font-medium text-brand-900">Storage Used</span>
              <span class="text-sm text-brand-500">2.4 GB / 10 GB</span>
            </div>
            <div class="h-3 bg-brand-100 rounded-full overflow-hidden">
              <div class="h-full w-[24%] bg-gradient-to-r from-brand-400 to-brand-600 rounded-full" />
            </div>
            <p class="text-xs text-brand-400 mt-2">24% of your allocated storage</p>
          </div>
          <div class="grid sm:grid-cols-3 gap-3">
            <div class="p-4 bg-white border border-brand-100 rounded-xl text-center">
              <p class="text-2xl font-semibold text-brand-900">1.8</p>
              <p class="text-xs text-brand-400">GB Sheet Music</p>
            </div>
            <div class="p-4 bg-white border border-brand-100 rounded-xl text-center">
              <p class="text-2xl font-semibold text-brand-900">0.4</p>
              <p class="text-xs text-brand-400">GB Metadata</p>
            </div>
            <div class="p-4 bg-white border border-brand-100 rounded-xl text-center">
              <p class="text-2xl font-semibold text-brand-900">0.2</p>
              <p class="text-xs text-brand-400">GB Cache</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>