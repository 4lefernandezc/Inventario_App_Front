<template>
    <div class="alert alert-warning" role="alert" v-if="message">
      <b>{{ message }}</b>
    </div>
    <div
      class="file-drop bg-gray-200 dark:bg-slate-700 border-slate-500 dark:border-slate-700"
      :class="{ active }"
      @drop.prevent="handleDrop"
      @dragover="dragOver"
      @dragleave="dragLeave"
    >
      <input type="file" id="input-drop" hidden @change="selectFile" />
      <div v-if="!imageUrl" @click="openSelect">
        <b class="text-center">
          <i class="bi bi-image text-4xl"></i>
          <br />
          Arrastre o suelte la imagen aquí!
        </b>
      </div>
      <div v-else class="drop-image">
        <img :src="imageUrl" @click="openSelect" />
        <p>
          <button
            @click="remove"
            class="rounded-lg bg-red-500 dark:bg-red-500 py-2 px-3 text-white shadow-pink-500/20 transition-all hover:shadow-lg hover:bg-red-600"
          >
            <i class="bi bi-trash"></i>
          </button>
        </p>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, watch, defineComponent } from "vue";
  
  export default defineComponent({
    emits: ["setImage"],
    props: {
      image: {
        type: String,
        required: false,
      },
    },

   
    setup(props, { emit }) {
      const active = ref(false);
      const message = ref(null);
      const imageUrl = ref(null);
 
      const openSelect = () => {
        const input = document.getElementById("input-drop");
        input.click();
      };
     
      const handleDrop = (event) => {
        event.preventDefault();
        if (event.dataTransfer.files.length <= 0) return;
        setFile(event.dataTransfer.files[0]);
      };
  
      const selectFile = (event) => {
        if (event.target.files.length <= 0) return;
        setFile(event.target.files[0]);
      };
      const dragOver = (event) => {
        event.preventDefault();
        active.value = true;
      };
  
      const dragLeave = () => {
        active.value = false;
      };
  
      const remove = () => {
        imageUrl.value = null;
        emit("setImage", null);
      };
  
      const setFile = (file) => {
        message.value = null;
        imageUrl.value = null;
        const fileType = file.type;
        const validExtensions = ["image/jpeg", "image/jpg", "image/png"];
        if (validExtensions.includes(fileType)) {
          const fileReader = new FileReader();
          fileReader.onload = () => {
            imageUrl.value = fileReader.result;
          };
          fileReader.readAsDataURL(file);
          console.log("file", file);
          emit("setImage", file);
        } else {
          message.value = "El archivo no es una imagen!";
        }
      };
  
      watch(
        () => props.image,
        (val) => {
          imageUrl.value = val;
        },
        { immediate: true }
      );
  
      return {
        active,
        message,
        imageUrl,
        openSelect,
        handleDrop,
        selectFile,
        dragOver,
        dragLeave,
        remove,
      };
    },
  });
  </script>
  
  <style>
  .file-drop {
    cursor: pointer;
    border-radius: 4px;
    width: 100%;
    height: 100%;
    min-height: 150px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .file-drop b {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .file-drop.active {
    border: 1.5px solid #009fe9;
  }
  .file-drop .drop-image {
    width: 100%;
    height: 100%;
    border-radius: 4px;
    position: relative;
  }
  .file-drop .drop-image img {
    width: 100%;
    max-height: 260px;
    border-radius: 4px;
    object-fit: cover;
    object-position: center;
  }
  .file-drop .drop-image p {
    color: rgb(41, 41, 41);
    margin: 0;
    position: absolute;
    top: 5%;
    left: 89%;
    text-shadow: 3px 3px 8px #999999;
  }
  </style>