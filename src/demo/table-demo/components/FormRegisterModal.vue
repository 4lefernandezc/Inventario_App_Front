<script setup lang="ts">
import { ref, watchEffect } from "vue";

const {
  visible: propVisible,
  item: propItem,
  title,
} = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  item: {
    type: Object,
  },
  title: {
    type: String,
    default: "",
  },
});

const visible = ref(propVisible);
const item = ref(propItem);
const emit = defineEmits(["onCloseModal", "OnAcceptModal"]);

watchEffect(() => {
  visible.value = propVisible;
  item.value = propItem;
});

function handleClose() {
  emit("onCloseModal");
}

function handleSave() {
  // todo: If form is valid
  emit("OnAcceptModal", item);
}
</script>

<template>
  <Dialog
    v-model:visible="visible"
    :style="{ width: '450px' }"
    :header="title"
    :modal="true"
    v-on:hide="handleClose"
  >
    <div class="flex flex-col gap-6 pt-2">
      <FloatLabel variant="on">
        <InputText id="name" v-model.trim="item.name" fluid />
        <label for="name">Name</label>
        <!-- todo: Validation -->
      </FloatLabel>
    </div>

    <template #footer>
      <Button label="Cancelar" icon="pi pi-times" text @click="handleClose" />
      <Button label="Guardar" icon="pi pi-check" @click="handleSave" />
    </template>
  </Dialog>
</template>
