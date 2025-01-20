import { defineStore } from "pinia";
import { ref } from "vue";
import type { TRecipe } from "../types/recipe.types";
import type { Pagination } from "@/interfaces/pagination";

export const useRecipesStore = defineStore("recipes", () => {
  // ----------------------
  // STATE
  // ----------------------
  const currentPage = ref<number>(1);
  const totalCount = ref<number>(0);
  const pageCount = ref<number>(0);
  const pageSize = ref<number>(10);
  const recipes = ref<TRecipe[]>([]);

  // ----------------------
  // ACTIONS
  // ----------------------
  function setRecipes(newRecipes: TRecipe[]) {
    recipes.value = newRecipes;
  }

  function setPaginatedRecipes(paginationData: Pagination<TRecipe>) {
    currentPage.value = paginationData.currentPage;
    totalCount.value = paginationData.totalCount;
    pageCount.value = paginationData.pageCount;
    pageSize.value = paginationData.pageSize;
    recipes.value = paginationData.data; 
  }

  function setCurrentPage(page: number) {
    currentPage.value = page;
  }

  function removeById(id: number) {
    recipes.value = recipes.value.filter((obj) => obj.id !== id);
  }

  function addRecipe(newRecipe: TRecipe) {
    recipes.value.push(newRecipe);
  }

  function updateRecipe(id: number, updated: TRecipe) {
    const index = recipes.value.findIndex((obj) => obj.id === id);
    if (index !== -1) {
      recipes.value[index] = updated;
    }
  }

  /**
   * addOrUpdate
   * Añade la receta si no existe, o la actualiza
   * si ya existe una con el mismo ID.
   */
  function addOrUpdate(recipe: TRecipe) {
    const index = recipes.value.findIndex((obj) => obj.id === recipe.id);
    if (index !== -1) {
      recipes.value[index] = recipe;
    } else {
      recipes.value.push(recipe);
    }
  }

  // ----------------------
  // RETURN
  // ----------------------
  return {
    // states
    currentPage,
    pageCount,
    pageSize,
    totalCount,
    recipes,

    // actions
    setRecipes,
    setPaginatedRecipes,
    setCurrentPage,
    removeById,
    addRecipe,
    updateRecipe,
    addOrUpdate,
  };
});
