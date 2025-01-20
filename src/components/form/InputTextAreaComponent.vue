<template>
  <div :class="`wrapper ${className}`">
    <label class="font-semibold text-start" v-if="label" :for="name">{{
      label
    }}</label>
    <Textarea
      :id="name"
      class="input"
      :placeholder="placeholder"
      v-model="input"
      @input="handleInput($event)"
      :autoResize="true"
      :rows="rows ?? 6"
      :disabled="disabled"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from "vue";

const { value } = defineProps({
  name: String,
  className: String,
  label: String,
  rows: Number,
  value: String,
  placeholder: String,
  disabled: { 
    type: Boolean,
    default: false
  }
});
const input = ref(value);

watchEffect(() => {
  input.value = value;
});

const emit = defineEmits(["update:modelValue"]);

const handleInput = ($event) => {
  emit("update:modelValue", $event.target.value);
};
</script>

<style scoped lang="scss">
@use "./fieldStyles.scss";
</style>
