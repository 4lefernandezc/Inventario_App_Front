<template>
  <div :class="`wrapper ${className}`">
    <label class="font-semibold" v-if="label" :for="name">{{ label }}</label>
    <IconField>
      <InputIcon v-if="currency"
        ><span
          :class="` block mt-[1px] text-md ${errorMessage ? 'label_error' : ''}`"
          >Bs</span
        ></InputIcon
      >
      <InputNumber
        style="{styleInput}"
        :id="name"
        :class="`input ${errorMessage ? 'field_error' : ''} ${currency ? 'currency' : ''}`"
        v-model="value"
        :integeronly="integeronly"
        :minFractionDigits="!integeronly ? 2 : undefined"
        showButtons
        :step="step ?? 1"
        :min="min"
        :disabled="disabled"
      />
      <small :class="errorMessage ? 'error_message' : ''">{{
        errorMessage
      }}</small>
    </IconField>
  </div>
</template>

<script lang="ts" setup>
import { useField } from "vee-validate";
import { ref, watch, watchEffect } from "vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  className: String,
  label: String,
  step: {
    type: Number,
    default: 1,
  },
  min: {
    type: Number,
    default: 0,
  },
  integeronly: Boolean,
  currency: Boolean,
  disabled: Boolean,
});

const { value, errorMessage, meta } = useField(() => props.name);
const disabled = ref(props.disabled);

const emit = defineEmits(["onChange"]);
watchEffect(() => {
  disabled.value = props.disabled;
});

watch([value], () => {
  emit("onChange", value.value);
});
</script>

<style lang="scss" scoped>
@use "./fieldStyles.scss";

:deep(.p-inputicon) {
  z-index: 99;
}
.label_error {
  margin-top: -10px;
}
.currency {
  :deep(.p-inputnumber-input) {
    padding-left: 30px;
  }
}
</style>
