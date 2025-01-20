<template>
  <div :class="'root flex items-center justify-center ' + (!mt0 ? 'mt' : '')">
    <ProgressSpinner
      style="width: 50px; height: 50px"
      strokeWidth="4"
      fill="transparent"
      animationDuration=".5s"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{ mt0?: boolean }>();
</script>

<style scoped lang="scss">
.root {
  width: 100%;
  height: 100%;
}
.mt {
  margin-top: -60px;
}
</style>
