<template>
  <div :class="`wrapper ${className}`">
    <label class="font-semibold" v-if="label" :for="name">{{ label }}</label>
    <Textarea
      :id="name"
      :class="`input ${errorMessage ? 'field_error' : ''}`"
      v-model="value"
      :autoResize="true"
      :rows="rows ?? 6"
      :disabled="disabled"
    />
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
  rows: Number,
  className: String,
  label: String,
  disabled: Boolean,
});

const { value, errorMessage, meta } = useField(() => props.name);
const disabled = ref(props.disabled);

watchEffect(() => {
  disabled.value = props.disabled;
});

</script>

<style scoped lang="scss">
@use "./fieldStyles.scss";
</style>
