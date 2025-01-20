<template>
  <div :class="`${className} flex flex-col gap-1`">
    <div class="font-semibold">{{ label }}</div>
    <div class="flex justify-between">
      <div v-for="item of items" :key="item.value" class="flex items-center">
        <Checkbox
          :inputId="item.value"
          :name="item.value"
          v-model="value"
          :value="item.value"
        />
        <label for="current" class="ml-2">{{ item.label }}</label>
      </div>
    </div>
    <small :class="errorMessage ? 'error_message' : ''">{{
      errorMessage
    }}</small>
  </div>
</template>

<script lang="ts" setup>
import { useField } from "vee-validate";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  items: Array,
  className: String,
  label: String,
});

const { value, errorMessage, meta } = useField(() => props.name);
</script>

<style lang="scss" scoped>
@use "./fieldStyles.scss";
</style>
