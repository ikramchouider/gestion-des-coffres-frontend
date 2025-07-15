<template>
  <section class="bg-gradient-to-r from-blue-50 to-blue-100 py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Image Section -->
        <div class="order-2 lg:order-1">
          <div class="relative">
            <img class="rounded-lg shadow-xl w-100 h-100 object-cover" :src="hero" alt="Security Box Management" />
            <div class="absolute -top-4 -right-4 w-20 h-20 bg-blue-500 rounded-full opacity-20"></div>
            <div class="absolute -bottom-4 -left-4 w-20 h-20 bg-blue-600 rounded-full opacity-30"></div>
          </div>
        </div>

        <!-- Content -->
        <div class="order-1 lg:order-2 text-center lg:text-left">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Secure Your
            <span class="text-blue-900"> Secrets</span>
          </h1>
          <h2 class="text-xl sm:text-2xl text-gray-700 mt-4 mb-6">
            Professional Box Code Management
          </h2>
          <p class="text-lg text-gray-600 mb-8 leading-relaxed">
            Safely store, organize, and manage all your security box codes in one secure location. .
          </p>

          <!-- Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <RouterLink 
              to="/signup" 
              class="bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started
            </RouterLink>
            <RouterLink 
              to="/login" 
              class="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold border-2 border-blue-600 hover:bg-green-50 transition-colors duration-200"
            >
              Sign In
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import hero from '@/assets/img/hero.png';
</script>