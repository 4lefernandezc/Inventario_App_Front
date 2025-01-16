<template>
  <div :class="`${className} flex flex-col gap-2`">
    <div class="font-semibold">{{ label }}</div>
    <div class="flex justify-between">
      <div v-for="item of items" :key="item.value" class="flex items-center">
        <RadioButton
          :inputId="item.value.toString()"
          :name="item.value.toString()"
          v-model="value"
          :value="item.value"
        />
        <label :for="item.value" class="ml-2">{{ item.label }}</label>
      </div>
    </div>
    <small :class="errorMessage ? 'error_message' : ''">{{
      errorMessage
    }}</small>
  </div>
</template>

<script lang="ts" setup>
import { useField } from "vee-validate";
import { watchEffect } from "vue";

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

watchEffect(() => {
  console.log(value.value);
});
</script>

<style lang="scss" scoped>
@use "./fieldStyles.scss";
</style>
