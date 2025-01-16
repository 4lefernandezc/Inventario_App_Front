<template>
  
  <div :class="`${className} flex flex-col gap-1`">
    <!-- <div class="font-semibold">{{ name }}</div> -->
    <label class="font-semibold" v-if="label" :for="name">{{ label }}</label>
    <div class="flex items-center gap-2">
      <div class="text-sm text-gray-500">{{ off }}</div>
      <ToggleSwitch v-model="value" />
      <div class="text-sm text-gray-500">{{ on }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useField } from "vee-validate";
import { watch } from "vue";
const emit = defineEmits(["onSwitchChange"]);
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  off: String,
  on: String,
  className: String,
  label: String,
});
const { value, errorMessage, meta } = useField(() => props.name);
watch(value, (newValue) => {
  console.log("newValue hjio", newValue);
  emit('onSwitchChange', newValue);
});

</script>

<style lang="scss" scoped>
@use "./fieldStyles.scss";
</style>
