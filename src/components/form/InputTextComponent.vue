<template>
  <div :class="`wrapper ${className}`">
    <label class="font-semibold text-start" v-if="label" :for="name">
      {{ label }}
    </label>
    <InputText
      :id="name"
      class="input"
      :placeholder="placeholder"
      v-model="input"
      :value="modelValue"
      @input="handleInput($event)"
      :disabled="disabled"
      autofocus
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from "vue";

const { value } = defineProps({
  name: String,
  className: String,
  label: String,
  value: String,
  placeholder: String,
  modelValue: [String, Number], // Acepta diferentes tipos como entrada
  disabled: {
    type: Boolean,
    default: false,
  },
  autofocus: Boolean,
});
const input = ref(value);

const emit = defineEmits(["update:modelValue"]);

watchEffect(() => {
  input.value = value;
});

const handleInput = ($event) => {
  emit("update:modelValue", $event.target.value);
};
</script>

<style scoped lang="scss">
@use "./fieldStyles.scss";
</style>
