<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Left Side - Logo and Illustration -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-700 relative justify-center items-center ">
      <div class="absolute inset-0 bg-black opacity-10"></div>
      <div class="relative  flex flex-col justify-center items-center text-white">
        <!-- Logo -->
        <div class="mb-4">
          <img 
            src="/src/assets/img/logo.png" 
            alt="Logo" 
            class="h-40 w-auto"
          />
        </div>
        
        <!-- Illustration -->
        <div class="mb-4">
          <img 
            src="/src/assets/img/login.png" 
            alt="login" 
            class="rounded-lg shadow-2xl w-80 h-100 object-cover"
          />
        </div>
        
        <!-- Welcome Message -->
        <div class="text-center max-w-md">
          <h2 class="text-2xl font-semibold mb-4">Welcome Back!</h2>
          <p class="text-blue-100 leading-relaxed">
            Securely access your box codes.
          </p>
        </div>
      </div>
      
      <!-- Decorative Elements -->
      <div class="absolute top-20 left-20 w-40 h-40 bg-white opacity-5 rounded-full"></div>
      <div class="absolute bottom-20 right-20 w-40 h-40 bg-white opacity-5 rounded-full"></div>
    </div>

    <!-- Right Side - Login Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8">
      <div class="max-w-md w-full">
        <!-- Mobile Logo (visible only on small screens) -->
        <div class="lg:hidden text-center mb-8">
          <img 
            src="/src/assets/img/logo.png" 
            alt="Logo" 
            class="h-12 w-auto mx-auto mb-2"
          />
          <h1 class="text-2xl font-bold text-gray-800">Box Manager</h1>
        </div>

        <div class="bg-white rounded-lg shadow-lg p-8">
          <h2 class="text-3xl font-bold text-center text-gray-800 mb-2">Sign In</h2>
          <p class="text-center text-gray-600 mb-8">Access your secure dashboard</p>
          
          <form @submit.prevent="handleLogin" class="space-y-6">
            <div>
              <label class="block text-gray-700 text-sm font-semibold mb-2" for="email">
                Email Address
              </label>
              <input
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                id="email"
                type="email"
                v-model="email"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <label class="block text-gray-700 text-sm font-semibold mb-2" for="password">
                Password
              </label>
              <input
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                id="password"
                type="password"
                v-model="password"
                placeholder="Enter your password"
                required
              />
            </div>
            
            <div class="flex items-center justify-between">
              <label class="flex items-center">
                <input type="checkbox" class="form-checkbox h-4 w-4 text-blue-600 rounded">
                <span class="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" class="text-sm text-blue-600 hover:text-blue-700">
                Forgot password?
              </a>
            </div>

                <!--Error message display -->
                  <div v-if="errorMessage" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {{ errorMessage }}
                  </div>
            
            <button
              type="submit"
              class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-75"
              :disabled="isLoading"
            >
              <span v-if="!isLoading">Connect</span>
              <span v-else>Creating Account...</span>
            </button>
            
          </form>
          
          <div class="mt-6 text-center">
            <p class="text-gray-600">
              Don't have an account?
              <RouterLink
                to="/Signup"
                class="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Sign up here
              </RouterLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const rememberMe = ref(false)

const handleLogin = async () => {
  errorMessage.value = ''
  
  if (!email.value || !password.value) {
    errorMessage.value = 'Please fill in all fields'
    return
  }

  isLoading.value = true

  try {
    const response = await fetch('http://localhost:8000/api/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed')
    }

    // Handle different response formats
    const userData = data.user || data // Try both common formats
    const authToken = data.token || data.access_token
    
    if (!userData || !authToken) {
      throw new Error('Invalid API response format')
    }

    authStore.login({
      id: userData.id,
      email: userData.email,
      username: userData.username || email.value.split('@')[0],
      roles: userData.roles || []
    }, authToken)
    
    router.push('/Dashbord')
    
  } catch (error) {
    errorMessage.value = error.message
    console.error('Login error:', error, 'Full response:', data)
  } finally {
    isLoading.value = false
  }
}
</script>