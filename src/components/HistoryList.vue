<template>
  <div class="space-y-4">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
      <p class="mt-2 text-gray-600">Loading history...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
      <p class="text-red-600">{{ error }}</p>
      <button 
        @click="fetchHistory" 
        class="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Retry
      </button>
    </div>

    <!-- No Results -->
    <div v-else-if="histories.length === 0 && !loading" class="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
      <h3 class="text-lg font-semibold text-gray-600 mb-2">No History Found</h3>
      <p class="text-gray-500">
        {{ searchQuery ? 'No history entries match your search criteria.' : 'No history entries available.' }}
      </p>
    </div>

    <!-- History Results -->
    <div v-else>
      <!-- Results Header -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-4">
        <h2 class="text-xl font-semibold text-gray-800">
          History Results
          <span class="text-sm font-normal text-gray-600 ml-2">({{ histories.length }} found)</span>
        </h2>
        <p v-if="searchQuery" class="text-sm text-gray-600 mt-1">
          Searching {{ filterType === 'code' ? 'by code' : 'by creator' }}: "{{ searchQuery }}"
        </p>
      </div>

      <!-- History Cards -->
      <div class="grid gap-4">
        <div 
          v-for="history in histories" 
          :key="history.id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
        >
          <div class="p-6">
            <!-- Header with Code and Date -->
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-800 mb-1">
                  Secret Code: {{ history.secretCode }}
                </h3>
                <p class="text-sm text-gray-600">
                  Generated: {{ formatDate(history.generatedAt) }}
                </p>
              </div>
              <div class="flex items-center space-x-2">
                <span class="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  ID: {{ history.id }}
                </span>
              </div>
            </div>

            <!-- Content Grid -->
            <div class="grid md:grid-cols-2 gap-4">
              <!-- Coffre Information -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-medium text-gray-700 mb-2 flex items-center">
                  Box Information
                </h4>
                <div class="space-y-1 text-sm">
                  <p><span class="font-medium">Box ID:</span> {{ history.coffre.id }}</p>
                  <p><span class="font-medium">Box Name:</span> {{ history.coffre.name }}</p>
                </div>
              </div>

              <!-- Creator Information -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-medium text-gray-700 mb-2 flex items-center">
                  Creator Information
                </h4>
                <div class="space-y-1 text-sm">
                  <p><span class="font-medium">User ID:</span> {{ history.generatedBy.id }}</p>
                  <p><span class="font-medium">Email:</span> {{ history.generatedBy.email }}</p>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="mt-4 pt-4 border-t border-gray-200">
              <div class="flex space-x-2">
                <button 
                  @click="copyCode(history.secretCode)"
                  class="px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Copy Code
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useToast } from 'vue-toastification'

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

const toast = useToast()

const histories = ref([])
const loading = ref(false)
const error = ref('')

const fetchHistory = async () => {
  loading.value = true
  error.value = ''
  
  try {
    let url = ''
    
    if (props.searchQuery.trim()) {
      if (props.filterType === 'code') {
        url = `http://localhost:8000/api/history/search?code=${encodeURIComponent(props.searchQuery)}`
      } else {
        // For creator search, we need to get user ID first or modify the API
        // For now, assuming we have a user ID
        url = `http://localhost:8000/api/history/user/${props.searchQuery}`
      }
    } else {
      histories.value = []
      loading.value = false
      return
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.success) {
      histories.value = data.data
    } else {
      throw new Error('API returned unsuccessful response')
    }
  } catch (err) {
    error.value = err.message || 'Failed to fetch history'
    histories.value = []
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  } catch (err) {
    return dateString
  }
}


const copyCode = async (code) => {
  try {
    await navigator.clipboard.writeText(code)
    toast.success('Code copied to clipboard!')
  } catch (err) {
    toast.error('Failed to copy code')
  }
}

// Watch for changes in search parameters
watch([() => props.searchQuery, () => props.filterType], () => {
  fetchHistory()
}, { immediate: false })

// Only fetch if there's a search query
watch(() => props.searchQuery, (newQuery) => {
  if (newQuery.trim()) {
    fetchHistory()
  } else {
    histories.value = []
  }
}, { immediate: true })
</script>