<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar -->
    <Navbar />
    
    <!-- Main Content -->
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Back Button -->
      <div class="mb-6">
        <button 
          @click="goBack"
          class="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Dashboard
        </button>
      </div>

      <!-- Form Container -->
      <div class="bg-white shadow-sm rounded-lg p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Add New Box</h1>
        
        <!-- Success Message -->
        <div v-if="showSuccess" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <div>
              <p class="text-green-800 font-medium">Box created successfully!</p>
              <p class="text-green-700 text-sm mt-1">Your box code is: <span class="font-mono font-bold">{{ generatedCode }}</span></p>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errors.general" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
            <p class="text-red-800 font-medium">{{ errors.general }}</p>
          </div>
        </div>

        <!-- Form -->
        <form @submit.prevent="submitForm" class="space-y-6">
          <!-- Box Name Input -->
          <div>
            <label for="boxName" class="block text-sm font-medium text-gray-700 mb-2">
              Box Name <span class="text-red-500">*</span>
            </label>
            <input 
              id="boxName"
              v-model="boxName"
              type="text"
              required
              :disabled="loading"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Enter box name..."
            />
            <p v-if="errors.boxName" class="text-red-500 text-sm mt-1">{{ errors.boxName }}</p>
          </div>

          <!-- Info Text -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
              </svg>
              <div>
                <p class="text-blue-800 text-sm font-medium">Information</p>
                <p class="text-blue-700 text-sm mt-1">
                  The box code and creator information will be automatically generated when you submit the form.
                </p>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end space-x-3">
            <button 
              type="button"
              @click="goBack"
              :disabled="loading"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button 
              type="submit"
              :disabled="loading || !boxName.trim()"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? 'Creating...' : 'Create Box' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Nav.vue'
import { useAuthStore } from '../stores/auth'

const router = useRouter()

const boxName = ref('')
const loading = ref(false)
const showSuccess = ref(false)
const generatedCode = ref('')
const errors = ref({})
const authStore = useAuthStore()

const goBack = () => {
  router.push('/Dashbord')
}
const checkAuth = () => {
  if (!authStore.token) {
    alert('Session expired. Please login again.')
    authStore.logout()
    router.push('/login')
    return false
  }
  return true
}
const submitForm = async () => {

  
  if (!checkAuth()) {
        router.push('/login')
        return
   }

  loading.value = true
  errors.value = {} // Clear previous errors
  
  try {
    const response = await fetch('http://localhost:8000/api/coffres/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({
        name: boxName.value.trim()
      })
    })
    console.log(response)
    if (response.ok) {
      const data = await response.json()
      generatedCode.value = data.secret_code
      showSuccess.value = true
      boxName.value = '' // Reset form
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        showSuccess.value = false
      }, 5000)
    } else {
      // Handle different error status codes
      if (response.status === 400) {
        const errorData = await response.json()
        errors.value = errorData.errors || { general: 'Invalid data provided' }
      } else if (response.status === 401) {
        errors.value.general = 'Authentication required'
      } else if (response.status === 500) {
        errors.value.general = 'Server error. Please try again later.'
      } else {
        errors.value.general = 'Something went wrong. Please try again.'
      }
    }
  } catch (error) {
    console.error('Error creating box:', error)
    errors.value.general = 'Network error. Please check your connection and try again.'
  } finally {
    loading.value = false
  }
}
</script>