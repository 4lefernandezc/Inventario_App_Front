<template>
  <div :class="`wrapper ${className}`">
    <label class="font-semibold text-start" v-if="label" :for="name">{{
      label
    }}</label>
    <Select
      :id="name"
      :options="options"
      class="input"
      optionLabel="label"
      optionValue="value"
      :placeholder="placeholder"
      v-model="internalValue"
      @change="handleInput($event)"
      :disabled="disabled"
    ></Select>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";

// Props
const props = defineProps({
  options: Array,
  name: String,
  className: String,
  label: String,
  placeholder: String,
  modelValue: [String, Number, null], // Para compatibilidad con v-model
  disabled: {  // Nueva propiedad disabled
    type: Boolean,
    default: false
  }
});

// Emite el evento para actualizar el valor en el padre
const emit = defineEmits(["update:modelValue"]);

// Valor interno que se sincroniza con `modelValue`
const internalValue = ref(props.modelValue);
//para reflejar cambios del padre al componente.
watch(() => props.modelValue, newVal => { internalValue.value = newVal })
// para reflejar cambios del componente al padre.
// Actualiza el valor del padre cuando el valor interno cambia
watch(internalValue, (newValue) => {
  emit("update:modelValue", newValue);
});

// Maneja el cambio de valor en el componente Select
const handleInput = ($event : any) => {
  internalValue.value = $event.value;
};
</script>

<style lang="scss" scoped>
@use "./fieldStyles.scss";
</style>
