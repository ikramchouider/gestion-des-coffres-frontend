<template>
  <div class="bg-gray-50 shadow-sm rounded-lg">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-200">
      <h2 class="text-xl font-semibold text-gray-900">Boxes</h2>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="p-6 text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
      <p class="mt-2 text-gray-600">Loading boxes...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="boxes.length === 0" class="p-6 text-center text-gray-500">
      <p>No boxes found.</p>
    </div>

    <!-- Boxes List -->
    <div v-else class="divide-y divide-gray-200">
      <div 
        v-for="box in boxes" 
        :key="box.id"
        class="p-6 hover:bg-gray-50 transition-colors duration-200"
      >
        <div class="flex items-center justify-between">
          <!-- Box Info -->
          <div class="flex-1">
            <h3 class="text-lg font-medium text-gray-900">{{ box.name }}</h3>
            <p class="text-sm text-gray-600 mt-1">
              Created by: <span class="font-medium">{{ box.creator }}</span>
            </p>
            <p class="text-sm text-gray-500 mt-1">
              Code: <span class="font-mono">{{ box.code }}</span>
            </p>
          </div>

          <!-- Actions -->
          <div class="flex space-x-2 ml-4">
            <button 
              @click="seeHistory(box.id)"
              class="px-4 py-2 text-blue-700 text-white rounded-lg hover:text-gray-600 transition-colors duration-200"
            >
              See History
            </button>
            <button 
              @click="regenerateCode(box.id)"
              :disabled="regeneratingIds.includes(box.id)"
              class="px-4 py-2 text-gray-600 text-white rounded-lg hover:text-orange-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ regeneratingIds.includes(box.id) ? 'Regenerating...' : 'Regenerate Code' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  },
  filterType: {
    type: String,
    default: 'code'
  }
})

const boxes = ref([])
const loading = ref(false)
const regeneratingIds = ref([])

// Helper function to check authentication
const checkAuth = () => {
  if (!authStore.user || !authStore.token) {
    alert('Session expired. Please login again.')
    authStore.logout()
    router.push('/login')
    return false
  }
  return true
}

const fetchBoxes = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams()

    if (props.searchQuery) {
      params.append('search', props.searchQuery)
      params.append('searchType', props.filterType)
    }
    
    const response = await fetch(`http://localhost:8000/api/coffres?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      boxes.value = data.coffres.map(box => ({
        id: box.id,
        name: box.name,
        creator: box.owner,
        code: box.current_code,
        createdAt: box.created_at
      }))
    } else {
      console.error('Error fetching boxes:', response.statusText)
    }
  } catch (error) {
    console.error('Error fetching boxes:', error)
  } finally {
    loading.value = false
  }
}

const regenerateCode = async (boxId) => {
  
  regeneratingIds.value.push(boxId)

  console.log('Regenerating code for box:', boxId)
  try {
    const response = await fetch(`http://localhost:8000/api/coffres/${boxId}/regenerate-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        coffreId: boxId.toString(),
      })
    })

    const data = await response.json()
    console.log('response', data)
    
    if (!response.ok) {
      if (response.status === 401) {
        await authStore.logout()
        router.push('/login')
        return
      }
      throw new Error(data.message || data.detail || `HTTP error! status: ${response.status}`)
    }

    // Success case
    const boxIndex = boxes.value.findIndex(box => box.id === boxId)
    if (boxIndex !== -1) {
      boxes.value[boxIndex].code = data.new_secret_code 
    }
    alert(`Success: ${data.new_secret_code }`)
    
  } catch (error) {
    console.error('Full error:', error)
    alert(`Error: ${error.message}\nCheck console for details.`)
  } finally {
    regeneratingIds.value = regeneratingIds.value.filter(id => id !== boxId)
  }
}

const seeHistory = (boxId) => {
  router.push(`/History/${boxId}`)
}

// Watch for prop changes and refetch
watch(() => [props.searchQuery, props.filterType], () => {
  fetchBoxes()
}, { deep: true })

onMounted(() => {
  fetchBoxes()
})
</script>