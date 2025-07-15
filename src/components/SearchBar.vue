<template>
  <div class="bg-gray-50 shadow-sm rounded-lg p-6 mb-6">
    <div class="space-y-4">
      <!-- Search Input -->
      <div class="relative">
        <input 
          v-model="searchQuery"
          type="text"
          :placeholder="getSearchPlaceholder()"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-blue-700 outline-none"
          @input="handleSearch"
        />
      </div>

      <!-- Filter Buttons -->
      <div class="flex space-x-2">
        <button 
          @click="setFilterType('code')"
          :class="[
            'px-4 py-2 rounded-lg border-2 transition-all duration-200',
            filterType === 'code' 
              ? 'bg-blue-700 text-white border-blue-700' 
              : 'bg-white text-blue-700 border-blue-700 hover:bg-blue-50'
          ]"
        >
          Search by Code
        </button>
        <button 
          @click="setFilterType('creator')"
          :class="[
            'px-4 py-2 rounded-lg border-2 transition-all duration-200',
            filterType === 'creator' 
              ? 'bg-blue-700 text-white border-blue-700' 
              : 'bg-white text-blue-700 border-blue-700 hover:bg-blue-50'
          ]"
        >
          Search by Creator
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const emit = defineEmits(['search'])

const searchQuery = ref('')
const filterType = ref('code')

const setFilterType = (type) => {
  filterType.value = type
  searchQuery.value = ''
  handleSearch()
}

const getSearchPlaceholder = () => {
  return filterType.value === 'code' 
    ? 'Search by code...' 
    : 'Search by creator...'
}

const handleSearch = () => {
  emit('search', {
    query: searchQuery.value,
    filterType: filterType.value
  })
}

watch([searchQuery, filterType], () => {
  handleSearch()
})
</script>