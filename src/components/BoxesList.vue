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

const router = useRouter()

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
const deletingIds = ref([])
const regeneratingIds = ref([])

const fetchBoxes = async () => {
  loading.value = true
  try {
    // Mock data for frontend testing
    const mockBoxes = [
      {
        id: 1,
        name: 'Box Alpha',
        creator: 'Alice Johnson',
        code: 'BOX001'
      },
      {
        id: 2,
        name: 'Box Beta',
        creator: 'Bob Smith',
        code: 'BOX002'
      },
      {
        id: 3,
        name: 'Box Gamma',
        creator: 'Charlie Brown',
        code: 'BOX003'
      },
      {
        id: 4,
        name: 'Box Delta',
        creator: 'Alice Johnson',
        code: 'BOX004'
      },
      {
        id: 5,
        name: 'Box Echo',
        creator: 'Diana Prince',
        code: 'BOX005'
      }
    ]
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Filter mock data based on search
    let filteredBoxes = mockBoxes
    
    if (props.searchQuery) {
      const query = props.searchQuery.toLowerCase()
      filteredBoxes = mockBoxes.filter(box => {
        if (props.filterType === 'code') {
          return box.code.toLowerCase().includes(query)
        } else {
          return box.creator.toLowerCase().includes(query)
        }
      })
    }
    
    boxes.value = filteredBoxes
    
    /*
    const params = new URLSearchParams()
    
    if (props.searchQuery) {
      params.append('search', props.searchQuery)
      params.append('searchType', props.filterType)
    }
    
    const response = await fetch(`/api/boxes?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      boxes.value = data.boxes || data
    } else {
      console.error('Error fetching boxes:', response.statusText)
    }
    */
  } catch (error) {
    console.error('Error fetching boxes:', error)
  } finally {
    loading.value = false
  }
}

const regenerateCode = async (boxId) => {
  if (!confirm('Are you sure you want to regenerate the code for this box?')) {
    return
  }
  
  regeneratingIds.value.push(boxId)
  
  try {
    // Mock regeneration for frontend testing
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Generate new code for the box
    const newCode = `BOX${Math.floor(Math.random() * 9000) + 1000}`
    
    // Update the box with new code
    const boxIndex = boxes.value.findIndex(box => box.id === boxId)
    if (boxIndex !== -1) {
      boxes.value[boxIndex].code = newCode
    }
    
    alert(`New code generated: ${newCode}`)
    
    /*
    const response = await fetch(`/api/boxes/${boxId}/regenerate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      const boxIndex = boxes.value.findIndex(box => box.id === boxId)
      if (boxIndex !== -1) {
        boxes.value[boxIndex].code = data.newCode
      }
      alert(`New code generated: ${data.newCode}`)
    } else {
      console.error('Error regenerating code:', response.statusText)
      alert('Error regenerating code. Please try again.')
    }
    */
  } catch (error) {
    console.error('Error regenerating code:', error)
    alert('Error regenerating code. Please try again.')
  } finally {
    regeneratingIds.value = regeneratingIds.value.filter(id => id !== boxId)
  }
}

const seeHistory = (boxId) => {
  router.push(`/history/${boxId}`)
}

// Watch for prop changes and refetch
watch(() => [props.searchQuery, props.filterType], () => {
  fetchBoxes()
}, { deep: true })

onMounted(() => {
  fetchBoxes()
})
</script>