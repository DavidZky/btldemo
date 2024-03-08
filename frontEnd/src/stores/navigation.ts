import { defineStore } from "pinia";

type navigationTypes = {
  rail: boolean;
  show: boolean;
};
const useNavigationStore = defineStore({
  id: "navigationInfo",
  state: (): navigationTypes => ({
    rail: false,
    show: true,
  }),
  getters: {},
  actions: {
    setRail(rail) {
      this.rail = rail;
    },
  },
});

export default useNavigationStore;
