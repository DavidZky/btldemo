<script setup lang="ts">
import useErrorStore from "@/stores/error";
import { onMounted } from "vue";
import router from "@/router";

const errorStore = useErrorStore();
errorStore.$subscribe(() => {});

onMounted(() => {
  if (!localStorage.getItem("token")) {
    router.push("/login");
  }
});
</script>

<template>
  <v-app>
    <router-view />
    <v-snackbar
      v-model="errorStore.isShow"
      :contained="errorStore.contained"
      :min-width="errorStore.minWidth"
      :color="errorStore.color"
      :timeout="errorStore.timeout"
      :close-on-content-click="errorStore.closeOnContentClick"
    >
      <div class="d-flex align-center pt-1">
        <v-icon :icon="errorStore.icon" :size="errorStore.iconSize" class="mr-5" />
        <span>{{ errorStore.text }}</span>
      </div>
    </v-snackbar>
  </v-app>
</template>
