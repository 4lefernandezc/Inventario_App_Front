<template>
    <div :class="`wrapper ${className}`">
      <label class="font-semibold text-start" v-if="label" :for="name">{{ label }}</label>
      <Calendar
        :id="name"
        v-model="internalValue"
        :placeholder="placeholder"
        class="input"
        :dateFormat="dateFormat"
        @change="handleInput"
        :disabled="disabled"
        :showIcon="true"
      />
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, watch } from "vue";
  import Calendar from "primevue/calendar"; // O el datepicker que uses
  
  // Props
  const props = defineProps({
    name: {
      type: String,
      default: ""
    },
    className: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: ""
    },
    // Aceptamos Date, string o null como valor
    modelValue: {
      type: [String, Date, null] as const,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // Un prop opcional para formatear fecha:
    dateFormat: {
      type: String,
      default: "dd/mm/yy"
    }
  });
  
  // Emite el evento para actualizar el valor en el padre
  const emit = defineEmits(["update:modelValue"]);
  
  // Valor interno sincronizado con `modelValue`
  const internalValue = ref(props.modelValue);
  
  // Reflejar cambios del padre al componente:
  watch(
    () => props.modelValue,
    (newVal) => {
      internalValue.value = newVal;
    }
  );
  
  // Reflejar cambios del componente al padre:
  watch(internalValue, (newVal) => {
    emit("update:modelValue", newVal);
  });
  
  // Maneja el cambio cuando se dispara @change en <Calendar>
  function handleInput(event: any) {
    // Normalmente, event.value es la fecha seleccionada
    internalValue.value = event.value;
  }
  </script>
  
  <style lang="scss" scoped>
  @use "./fieldStyles.scss";
  </style>
  