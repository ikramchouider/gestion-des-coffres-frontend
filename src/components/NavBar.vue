<script setup>
import { RouterLink, useRoute } from 'vue-router';
import logo from '@/assets/img/logo.png';
const isActiveLink = (routePath) => {
  const route = useRoute();
  return route.path === routePath;
};
</script>
<template>
  <nav class="bg-blue-700 border-b ">
    <div class=" px-2 sm:px-6 lg:px-8">
      <div class="flex h-20 items-center justify-between">
        <!-- Logo and Website Name -->
        <div class="flex items-center">
          <RouterLink class="flex flex-shrink-0 items-center" to="/">
            <img class="h-40 w-auto" :src="logo" alt="Logo" />
          </RouterLink>
        </div>
        
        <!-- Login and Signup Buttons -->
        <div class="flex space-x-4">
          <RouterLink
            to="/Login"
            :class="[
              isActiveLink('/Login')
                ? 'bg-blue-900'
                : 'hover:bg-gray-900 hover:text-white',
              'text-white',
              'px-4',
              'py-2',
              'rounded-md',
              'font-medium',
            ]"
          >
            Login
          </RouterLink>
          <RouterLink
            to="/Signup"
            :class="[
              isActiveLink('/Signup')
                ? 'bg-blue-900'
                : 'hover:bg-gray-900 hover:text-white',
              'text-white',
              'px-4',
              'py-2',
              'rounded-md',
              'font-medium',
            ]"
          >
            Sign Up
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>