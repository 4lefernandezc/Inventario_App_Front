<script setup lang="ts">
import Tag from 'primevue/tag';

const props = defineProps({
  isActive: {
    type: Boolean,
    required: true,
  },
});
</script>

<template>
  <Tag 
    :value="isActive ? 'ACTIVO' : 'INACTIVO'" 
    :severity="isActive ? 'success' : 'danger'" 
    rounded
  />
</template>
