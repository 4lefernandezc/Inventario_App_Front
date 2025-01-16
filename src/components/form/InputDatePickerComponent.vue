<template>
  <div :class="`wrapper ${className}`">
    <label class="font-semibold text-start" v-if="label" :for="name">{{
      label
    }}</label>
    <DatePicker
      :id="name"
      :showIcon="true"
      :showButtonBar="true"
      class="input"
      @input="handleInput($event)"
      @date-select="handleInput($event)"
      :placeholder="placeholder"
      v-model="value"
      dateFormat="dd/mm/yy"
    ></DatePicker>
  </div>
</template>

<script lang="ts" setup>
import moment from "moment";
import { ref } from "vue";

defineProps({
  name: String,
  className: String,
  label: String,
  placeholder: String,
  defaultValue: String,
});

const value = ref();

const emit = defineEmits(["update:modelValue"]);
const handleInput = ($event) => {
  if ($event.target) {
    const splitStr = $event.target.value.split("/");
    if (splitStr.length > 2 && $event.target.value.length === 10) {
      const dd = splitStr[0];
      const mm = splitStr[1];
      const yyyy = splitStr[2];

      const date = moment(yyyy + "-" + mm + "-" + dd)
        .add(1, "day")
        .format("YYYY-MM-DD");
      const dateObject = new Date(date);

      if (dateObject.toString() !== "Invalid Date") {
        emit("update:modelValue", dateObject);
        value.value = dateObject;
      }
    }
  } else {
    emit("update:modelValue", $event);
    value.value = $event;
  }
};
</script>

<style lang="scss" scoped>
@use "./fieldStyles.scss";
</style>
