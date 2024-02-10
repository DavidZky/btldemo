import { defineStore } from "pinia";

type navigationTypes = {
  rail: Boolean;
  show: Boolean;
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
