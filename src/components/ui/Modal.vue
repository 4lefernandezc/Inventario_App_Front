<template>
  <Dialog
    v-model:visible="visible"
    :modal="true"
    :style="{
      width:
        size === 'xl'
          ? '80vw'
          : size === 'lg'
            ? '60vw'
            : size === 'md'
              ? '45vw'
              : '30vw',
      height: height || 'auto',
    }"
    :class="`${noClose ? 'noClose' : ''} modal overflow-hidden custom-z-index-dialog ${size === 'xl' ? 'xl' : size === 'lg' ? 'lg' : size === 'md' ? 'md' : 'sm'}`"
    v-on:hide="emit('onClose')"
  >
    <template #header>
      <div class="flex items-center gap-4">
        <Button
          v-if="goBack"
          type="button"
          icon="pi pi-arrow-left"
          severity="secondary"
          @click="goToBack"
        />
        <span class="font-bold text-xl">{{ title }}</span>
      </div>
    </template>

    <div id="form-container" :class="noActions ? '' : 'content'">
      <slot></slot>
    </div>

    <template v-if="!noActions">
      <template v-if="slots['actions']">
        <div class="footer flex flex-col justify-center h-[70px]">
          <div class="w-[full] grid grid-cols-12 gap-4 row-end">
            <slot name="actions"></slot>
          </div>
        </div>
      </template>
      <div v-else class="footer flex flex-col justify-center h-[70px]">
        <div class="w-[full] grid grid-cols-12 gap-4 row-end">
          <Button
            label="Cancelar"
            icon="pi pi-times"
            outlined
            severity="secondary"
            @click="emit('onClose')"
            :style="
              size === 'xl'
                ? 'grid-column: 7 /10'
                : size === 'lg'
                  ? 'grid-column: 5 / 9'
                  : size === 'md'
                    ? 'grid-column: 3 / 8'
                    : 'grid-column: 1 / 7'
            "
            class="form-btn"
          />
          <Button
            @click="submit"
            label="Guardar"
            icon="pi pi-check"
            :style="
              size === 'xl'
                ? 'grid-column: 10 / 13'
                : size === 'lg'
                  ? 'grid-column: 9 / 13'
                  : size === 'md'
                    ? 'grid-column: 8 / 13'
                    : 'grid-column: 7 / 13'
            "
            class="form-btn"
          />
        </div>
      </div>
    </template>
    <div v-if="visibility && isLoading" class="loading">
      <Spinner mt0 />
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, useSlots, watchEffect } from "vue";
import Spinner from "./Spinner.vue";
import { array } from "yup";

const slots = useSlots();
const { visibility, size, height } = defineProps<{
  noClose?: boolean;
  isLoading?: boolean;
  visibility: boolean;
  noActions?: boolean;
  goBack?: boolean;
  title: string;
  size?: string;
  height?: string;
}>();
const visible = ref(false);
const emit = defineEmits(["onClose", "onAccept", "onBack"]);

watchEffect(() => {
  visible.value = visibility;
});

const submit = () => {
  const submitBtns = document.querySelectorAll("#form-container #submit");

  if (submitBtns) {
    const submitBtnsArr = Array.from(submitBtns);
    console.log("submitBtnsArr", submitBtnsArr);
    const submitBtn = submitBtnsArr[submitBtnsArr.length - 1] as HTMLElement;
    submitBtn.click();
  }

  emit("onAccept");
};

const goToBack = () => {
  emit("onBack");
};

defineExpose({ submit });
</script>

<style>
.p-dialog-mask {
  z-index: 1200 !important;
}

.noClose {
  .p-dialog-header-actions {
    display: none !important;
  }
}
</style>

<style lang="scss" scoped>
.modal {
  position: relative;
}

.content {
  margin-bottom: 70px;
  min-height: 80px;
}

.footer {
  position: absolute;
  width: 100%;
  padding: 0 20px;
  bottom: 0;
  left: 0;
  background-color: var(--p-overlay-modal-background);
}

.loading {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 999999;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
