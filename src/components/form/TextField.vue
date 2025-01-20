<template>
  <div :class="`wrapper ${className}`">
    <label class="font-semibold" v-if="label" :for="name">{{ label }}</label>
    <div :class="`${phone ? 'phone' : ''}`">
      <Select
        id="code"
        v-if="phone"
        v-model="selectedCountry"
        :options="countries"
        filter
        :disabled="disabled"
        optionLabel="name"
        class="w-full md:w-56"
        @change="onChangeSelectInput"
      >
        <template #value="slotProps">
          <div v-if="slotProps.value" class="flex items-center">
            <img
              :alt="slotProps.value.label"
              src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
              :class="`mr-2 flag flag-${slotProps.value.abbr.toLowerCase()}`"
              style="width: 18px; max-width: initial; margin-top: 5px"
            />
          </div>
        </template>
        <template #option="slotProps">
          <div class="flex items-center">
            <img
              :alt="slotProps.option.label"
              src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
              :class="`mr-2 flag flag-${slotProps.option.abbr.toLowerCase()}`"
              style="width: 18px"
            />
            <div>{{ slotProps.option.name }}</div>
          </div>
        </template>
      </Select>
      <IconField class="w-[100%]">
        <InputIcon v-if="phone"
          ><span class="text-md pt-1"
            >+{{ selectedCountry.code }}</span
          ></InputIcon
        >
        <InputText
          v-if="!phone"
          :id="name"
          :class="`input ${errorMessage ? 'field_error' : ''}`"
          v-model="value"
          :placeholder="placeholder"
          :disabled="disabled"
          :autofocus="autofocus"
        />
        <InputText
          v-else
          :id="name"
          :class="`input ${errorMessage ? 'field_error' : ''}`"
          v-model="phoneValue"
          :disabled="disabled"
          @change="onChangeInputPhone"
          :autofocus="autofocus"
        />
      </IconField>
    </div>
    <small
      :class="`${errorMessage ? 'error_message' : ''} ${phone ? 'pl-[80px]' : ''}`"
      >{{ errorMessage }}</small
    >
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
  phone: Boolean,
  className: String,
  label: String,
  placeholder: {
    type: String,
    default: "",
  },
  disabled: Boolean,
  autofocus: Boolean,
});

const { value, errorMessage, meta } = useField(() => props.name);
const selectedCountry = ref({ name: "Bolivia", abbr: "BO", code: "591" });
const phoneValue = ref("");
const disabled = ref(props.disabled);
const emits = defineEmits(["onLoseFocus"]);
//Más opciones de código de país
const countries = ref([
  { name: "Bolivia", abbr: "BO", code: "591" },
  { name: "Argentina", abbr: "AR", code: "54" },
  { name: "Chile", abbr: "CL", code: "56" },
  { name: "Brazil", abbr: "BR", code: "55" },
  { name: "Peru", abbr: "PE", code: "51" },
  { name: "Colombia", abbr: "CO", code: "57" },
  { name: "Venezuela", abbr: "VE", code: "58" },
  { name: "España", abbr: "ES", code: "34" },
  { name: "Mexico", abbr: "MX", code: "52" },
  { name: "Estados Unidos", abbr: "US", code: "1" },
  { name: "China", abbr: "CN", code: "86" },
  { name: "France", abbr: "FR", code: "33" },
  { name: "Italia", abbr: "IT", code: "39" },
]);

watchEffect(() => {
  if (props.phone) {
    if (!value.value) {
      phoneValue.value = "";
      selectedCountry.value = { name: "Bolivia", abbr: "BO", code: "591" };
    } else {
      const matchedCountry = countries.value.find((country) =>
        value.value.startsWith(`+${country.code}`)
      );

      if (matchedCountry) {
        selectedCountry.value = matchedCountry;
        phoneValue.value = value.value.slice(matchedCountry.code.length + 2);
      } else {
        selectedCountry.value = { name: "Bolivia", abbr: "BO", code: "591" };
        phoneValue.value = value.value;
      }
    }
  }
  disabled.value = props.disabled;
});

const onChangeSelectInput = (e: any) => {
  if (e.value) {
    const existingNumber = phoneValue.value;
    selectedCountry.value = e.value;
    value.value = `+${selectedCountry.value.code} ${existingNumber}`;
    phoneValue.value = existingNumber; // Mantiene el número en el campo input
  }
};

const onChangeInputPhone = (e: any) => {
  if (e.target.value === "") {
    value.value = "";
  } else {
    value.value = `+${selectedCountry.value.code} ${e.target.value.trim()}`;
  }
};
</script>

<style scoped lang="scss">
@use "./fieldStyles.scss";

.phone {
  display: flex;
  gap: 1px;

  & input {
    padding-left: 50px !important;
  }
}

#code {
  width: 70px;
}
</style>
