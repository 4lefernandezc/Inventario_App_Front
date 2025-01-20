<template>
  <div class="date-filter-content">
    <template v-if="hasSelectField">
    <InputSelectComponent
      class="w-[160px]"
      v-model="selectField"
      :options="selectFieldOptions"
       :label="selectFieldLabel || 'Buscar por'"
      defaultValue="dateOpen"
    />
    <Divider layout="vertical" class="divider" />
  </template>
    <Button
      class="mt-6"
      type="button"
      icon="pi pi-filter"
      @click="toggleDataTable"
      text
      severity="secondary"
    />
    <Button
      class="mt-6"
      v-if="showClearFilter"
      type="button"
      icon="pi pi-filter-slash"
      @click="clearFilter"
      text
      severity="secondary"
    />
    <Popover ref="filterPopOver" id="overlay_panel" style="width: 260px">
      <div class="flex flex-col gap-6">
        <div class="flex items-center">
          <RadioButton
            v-model="selectedOption"
            inputId="option1"
            name="selectedOption"
            value="range"
          />
          <label for="option1" class="leading-none ml-2">ENTRE FECHAS</label>
        </div>
        <div class="flex items-center">
          <RadioButton
            v-model="selectedOption"
            inputId="option2"
            name="selectedOption"
            value="day"
          />
          <label for="option2" class="leading-none ml-2">POR DÍA</label>
        </div>
        <div class="flex items-center">
          <RadioButton
            v-model="selectedOption"
            inputId="option3"
            name="selectedOption"
            value="month-year"
          />
          <label for="option3" class="leading-none ml-2">MES Y AÑO</label>
        </div>
      </div>
    </Popover>

    <div v-if="selectedOption === 'day'">
      <InputDatePickerComponent
        v-model="selectedDate"
        showIcon
        class="w-full"
        label="Seleccione un día"
        placeholder="DD/MM/YYYY"
      />
    </div>

    <div class="w-[330px] w-full flex gap-2" v-if="selectedOption === 'range'">
      <InputDatePickerComponent
        name="startDate"
        v-model="startDate"
        showIcon
        label="Fecha Inicio"
        class="w-full"
        placeholder="DD/MM/YYYY"
      />
      <InputDatePickerComponent
        name="endDate"
        v-model="endDate"
        showIcon
        label="Fecha Final"
        class="w-full"
        placeholder="DD/MM/YYYY"
      />
    </div>

    <div
      class="w-[330px] w-full flex gap-2"
      v-if="selectedOption === 'month-year'"
    >
      <InputSelectComponent
        class="w-full"
        v-model="selectedMonth"
        :options="monthOptions"
        label="Mes"
        placeholder="Seleccionar"
        defaultValue="dateOpen"
      />
      <InputSelectComponent
        class="w-full"
        v-model="selectedYear"
        :options="yearOptions"
        label="Año"
        placeholder="Seleccionar"
      />
    </div>
  </div>
  
</template>

<script lang="ts" setup>
import { monthOptions, yearOptions } from "@/constants";
import { ref, watch } from "vue";
import InputSelectComponent from "./InputSelectComponent.vue";
import InputDatePickerComponent from "./InputDatePickerComponent.vue";
const selectFieldOptions = [
  {
    label: "Fecha apertura",
    value: "dateOpen",
  },
  {
    label: "Fecha cierre",
    value: "dateClose",
  },
];
const selectField = ref<any>("dateOpen");
const filterPopOver = ref<any>(null);
const selectedOption = ref("range");
const selectedDate = ref(null);
const startDate = ref(null);
const endDate = ref(null);
const selectedMonth = ref(null);
const selectedYear = ref(null);
const showClearFilter = ref(false);
const emit = defineEmits(["onChange"]);
const { hasSelectField, selectFieldLabel } = defineProps<{
   hasSelectField?: boolean
   selectFieldLabel?: string;
  }>();

watch(
  [
    selectField,
    selectedOption,
    startDate,
    endDate,
    selectedDate,
    selectedMonth,
    selectedYear,
  ],
  () => {
    if (selectedOption.value === "range" && startDate.value && endDate.value) {
      showClearFilter.value = true;
      emit(
        "onChange",
        { startDate: startDate.value, endDate: endDate.value },
        selectedOption.value,
        selectField.value
      );
    }
    if (selectedOption.value === "day" && selectedDate.value) {
      showClearFilter.value = true;
      emit(
        "onChange",
        { date: selectedDate.value },
        selectedOption.value,
        selectField.value
      );
    }
    if (
      selectedOption.value === "month-year" &&
      selectedMonth.value &&
      selectedYear.value
    ) {
      showClearFilter.value = true;
      emit(
        "onChange",
        {
          month: selectedMonth.value,
          year: selectedYear.value,
        },
        selectedOption.value,
        selectField.value
      );
    }
  }
);

function clearFilter() {
  startDate.value = null;
  endDate.value = null;
  selectedDate.value = null;
  selectedMonth.value = null;
  selectedYear.value = null;
  showClearFilter.value = false;
  emit("onChange", null);
}

function toggleDataTable(event: any) {
  filterPopOver.value?.toggle(event);
}
</script>
<style scoped>
:deep(.p-select-label) {
  text-align: start;
}

.date-filter-content {
  width: 580px;
  height: 100%;
  align-items: center;
  text-align: center;
  /* justify-content: center; */
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
}
.label-black {
  color: black;
}

.divider {
  margin-left: 10px !important;
  margin-right: 0px !important;
}
</style>
