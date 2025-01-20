<template>
    <div class="grid grid-cols-3 gap-4">
        <div v-for="(image, index) in selectedImages" :key="index" class="relative">
            <img :src="getImageUrl(image)" :alt="`Image ${index}`" class="w-full h-auto" />
            <Button icon="pi pi-trash" class="absolute top-1 right-1 p-button-danger p-button-rounded custom-trash-button"
                @click="removeImage(index)" />
        </div>
        <div class="flex items-center justify-center h-32 bg-gray-200 hover:bg-gray-300 rounded cursor-pointer">
            <label for="file-input" class="cursor-pointer">
                <i class="pi pi-plus text-4xl text-gray-500"></i>
            </label>
            <input id="file-input" type="file" accept="image/*" class="hidden" multiple @change="addImages" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const emit = defineEmits(['update:files']);
const selectedImages = ref([]);
const getImageUrl = (image: string | File) => {
  if (image instanceof File) {
    return URL.createObjectURL(image);
  }
  return image;
};

const addImages = (event : Event) => {
  console.log('event img',event);
  const files = Array.from((event.target as HTMLInputElement).files || []);
  selectedImages.value.push(...files);

  emit('update:files', selectedImages.value);
};

const removeImage = (index: number) => {
  const removedImage = selectedImages.value[index];
  if (removedImage instanceof File) {
    URL.revokeObjectURL(getImageUrl(removedImage));
  }
  selectedImages.value.splice(index, 1);

  emit('update:files', selectedImages.value);
};
</script>

<style scoped>
/* Estilo personalizado para el botón de basura */
.custom-trash-button {
    background-color: red !important;
    color: white !important;
}
</style>