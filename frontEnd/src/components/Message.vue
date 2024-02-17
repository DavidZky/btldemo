<!-- message.vue -->
<script lang="ts">
import { defineComponent,type PropType,ref,watch} from 'vue'

export default defineComponent({
  name: 'message',
});
</script>
<script setup lang="ts">
const showFlg = ref(false);
const message = ref();
const type = ref();

const props = defineProps({
  // type: String,
  type: {
      validator: (value: string) => {
        return ['success', 'warning', 'error', 'info'].includes(value)
      },
      default: 'info',
      type: String as PropType<'error' | 'success' | 'warning' | 'info'>,
    },
  message: String,
  showFlg: Boolean,
});
watch(
  () => props.showFlg,
  (val, prevVal) => {
    showFlg.value = val;
  }
);
watch(
  () => props.message,
  (val, prevVal) => {
    message.value = val;
  }
);
watch(
  () => props.type,
  (val, prevVal) => {
    type.value = val;
  }
);
</script>
<template>
  <!-- <v-alert
    v-model="showFlg"
    class="alert"
    :type="type"
  >
   {{ message }}
  </v-alert> -->

  <v-alert
    v-model="showFlg"
    :color="type"
    :icon="'$'+type"
    :text="message"
  ></v-alert>

</template>

<style scoped lang="scss">
// .message {
//   position: fixed;
//   pointer-events: none;
//   left: 0;
//   right: 0;
//   z-index: 9999;
//   transition: top 0.7s linear;

//   .alert {
//     margin: auto;
//   }
// }
</style>
