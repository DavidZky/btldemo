import type { Snackbar } from "@/models/errorModel";
import { defineStore } from "pinia";

const useErrorStore = defineStore({
  id: "errorInfo",
  state: (): Snackbar => ({
    isShow: false,
    contained: true,
    minWidth: "360",
    color: "error",
    timeout: 3000,
    closeOnContentClick: true,
    icon: "mdi-alert-circle-outline",
    iconSize: "large",
    text: "",
  }),
  getters: {},
  actions: {},
});

export default useErrorStore;
