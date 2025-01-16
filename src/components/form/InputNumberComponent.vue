<template>
  <div :class="`wrapper ${className}`">
    <label class="font-semibold text-start" v-if="label" :for="name">{{
      label
    }}</label>
    <IconField>
      <InputIcon v-if="currency"
        ><span :class="` block mt-[1px] text-md`">Bs</span></InputIcon
      >
      <InputNumber
        :id="name"
        :class="`input ${currency ? 'currency' : ''}`"
        :placeholder="placeholder"
        v-model="input"
        @input="handleInput($event)"
        :step="step ?? 1"
        :min="0"
        :max="max ?? 9999999"
        :disabled="disabled"
        showButtons
      />
    </IconField>
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from "vue";

const { value, disabled } = defineProps({
  name: String,
  className: String,
  label: String,
  placeholder: String,
  max: Number,
  step: Number,
  value: Number,
  currency: Boolean,
  disabled: Boolean,
});

const emit = defineEmits(["onChange"]);
const input = ref(value);

watchEffect(() => {
  input.value = value;
});

const handleInput = ($event) => {
  emit("onChange", $event.value);
  input.value = $event.value;
};
</script>

<style scoped lang="scss">
@use "./fieldStyles.scss";

:deep(.p-inputicon) {
  z-index: 99;
}
.currency {
  :deep(.p-inputnumber-input) {
    padding-left: 30px;
  }
}
</style>
