<script setup lang="ts">
import useNavigationStore from "@/stores/navigation";
import router from "@/router";

const navigationStore = useNavigationStore();

const signOut = () => {
  localStorage.removeItem("token");
  router.push("/login");
};
</script>

<template>
  <div>
    <v-app-bar color="primary" elevation="0" class="v-topbar d-flex">
      <v-app-bar-nav-icon @click="navigationStore.setRail(!navigationStore.rail)" />
      <span>患者管理システム</span>
      <template #append>
        <v-btn variant="outlined" @click="signOut">ログアウト</v-btn>
      </template>
    </v-app-bar>
  </div>
</template>

<style scoped></style>
