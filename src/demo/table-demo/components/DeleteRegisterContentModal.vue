<script setup lang="ts">
const { item } = defineProps({
  item: {
    default: {},
  },
});
</script>

<template>
  <div class="flex items-center gap-4">
    <i class="pi pi-exclamation-triangle !text-3xl" />
    <span v-if="item"
      >¿Estás seguro que quieres eliminar: <b>{{ item.name }}</b
      >?</span
    >
  </div>
</template>
