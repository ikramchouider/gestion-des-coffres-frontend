<template>
  <div class="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 ">
    <!-- Navbar -->
    <Navbar />
    
    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      <!-- Search Bar -->
      <SearchBar @search="handleSearch" />

       <!-- Add New Box Button -->
         <div class="mb-6">
            <RouterLink 
              to="/dashbord/add" 
              class="bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Add New Box 
            </RouterLink>
         </div>
         
      <!-- Boxes List -->
      <BoxesList 
        :search-query="searchQuery"
        :filter-type="filterType"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Navbar from '@/components/Nav.vue'
import SearchBar from '@/components/SearchBar.vue'
import BoxesList from '@/components/BoxesList.vue'

const searchQuery = ref('')
const filterType = ref('code')

const handleSearch = (searchData) => {
  searchQuery.value = searchData.query
  filterType.value = searchData.filterType
}
</script>