<template>
  <nav class="bg-blue-700 shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <img 
            src="@/assets/img/logo.png" 
            alt="Logo" 
            class="h-40 w-auto"
          />
        </div>

        <!-- Username -->
        <div class="flex items-center">
          <span class="text-white font-medium">{{ username }}</span>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const username = ref('')

onMounted(() => {
  if (authStore.user) {
    username.value = authStore.user.username || authStore.user.email.split('@')[0]
  } else {
    router.push('/login')
  }
})
</script>