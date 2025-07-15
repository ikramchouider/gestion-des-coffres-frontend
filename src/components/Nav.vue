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

const username = ref('')

const fetchUserData = async () => {
  try {
    const mockUserData = {
      username: 'Ikram CHOUIDER',
      name: 'Ikram CHOUIDER',
      email: 'Ikram.CHOUIDER@example.com'
    }
    
    await new Promise(resolve => setTimeout(resolve, 500))  
    username.value = mockUserData.username || mockUserData.name
    
    /* 
    const response = await fetch('/api/user/profile', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    
    if (response.ok) {
      const userData = await response.json()
      username.value = userData.username || userData.name
    }
    */
  } catch (error) {
    console.error('Error fetching user data:', error)
    // Fallback for testing
    username.value = 'Test User'
  }
}

onMounted(() => {
  fetchUserData()
})
</script>