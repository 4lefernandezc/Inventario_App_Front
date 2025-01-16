<template>
  <div :class="`wrapper ${className}`">
    <label class="font-semibold" v-if="label" :for="name">{{ label }}</label>
    <Select
      :id="name"
      v-model="val"
      :options="options"
      :class="`input ${errorMessage ? 'field_error' : ''}`"
      optionLabel="label"
      fluid
      @change="onChangeInput"
      :disabled="disabled"
    ></Select>
    <small :class="errorMessage ? 'error_message' : ''">{{
      errorMessage
    }}</small>
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
  options: Array,
  className: String,
  label: String,
  disabled: Boolean,
});
const emit = defineEmits(["change"]);
const { value, errorMessage, meta } = useField(() => props.name);
const val = ref();

watchEffect(() => {
  val.value = props.options?.find((obj) => obj.value === value.value) ?? "";
});

const onChangeInput = (e: any) => {
  value.value = e.value.value;
  emit("change", value.value);
};
</script>

<style lang="scss" scoped>
@use "./fieldStyles.scss";
</style>
