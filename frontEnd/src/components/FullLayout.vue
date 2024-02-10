<script setup lang="ts">
import { ref } from "vue";
import  Header from "@/components/Header.vue";
const sideBarWidth = ref(4);
</script>

<template>
  <v-app>
    <Header></Header>
    <router-view name="sidebar"></router-view>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<style scoped></style>
