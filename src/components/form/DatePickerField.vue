<template>
  <div :class="`wrapper ${className}`">
    <label class="font-semibold" v-if="label" :for="name">{{ label }}</label>
    <DatePicker
      :id="name"
      :showIcon="true"
      :showButtonBar="true"
      :class="`input ${errorMessage ? 'field_error' : ''}`"
      v-model="value"
      :disabled="disabled"
    ></DatePicker>
    <small :class="errorMessage ? 'error_message' : ''">{{
      errorMessage
    }}</small>
  </div>
</template>

<script lang="ts" setup>
import { useField } from "vee-validate";
import { ref, watchEffect } from "vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  className: String,
  label: String,
  integeronly: Boolean,
  disabled : Boolean
});

const { value, errorMessage, meta } = useField(() => props.name);
const disabled = ref(props.disabled)  

watchEffect(() => {
  disabled.value = props.disabled;
});

</script>

<style lang="scss" scoped>
@use "./fieldStyles.scss";
</style>
