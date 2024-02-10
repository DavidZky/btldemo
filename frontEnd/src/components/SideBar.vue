<script setup lang="ts">
import useNavigationStore from "@/stores/navigation";
import { ref } from "vue";

const navigationStore = useNavigationStore();

const menuList = ref([
  { text: "患者データ照会", icon: "mdi-history", url: "/history" },
  { text: "設備管理", icon: "mdi-folder", url: "/facility" },
  { text: "システム設定", icon: "mdi-cog", url: "/system" },
]);
console.log(navigationStore);
</script>

<template>
  <v-navigation-drawer
    v-model="navigationStore.show"
    :rail="navigationStore.rail"
    app
    location="left"
    permanent
    elevation="8"
    rail-width="75"
    expand-on-hover
  >
    <v-list class="pa-4">
      <v-list-item v-for="(item, i) in menuList" :key="i" :to="item.url" :value="item" rounded="lg" color="primary">
        <template #prepend>
          <v-icon :icon="item.icon" class="pr-2"></v-icon>
        </template>
        <v-list-item-title class="">{{ item.text }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped></style>
