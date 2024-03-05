<script setup lang="ts">
import { onMounted, ref } from "vue";
import {systemApi, systemSaveApi} from '../../../apis/requestApi'

const phoneNo = ref("");
const messageText = ref("");
const showFlg = ref(false);
const showMessageFlg = ref(false);

onMounted(() => {
  initList();
});

const clear = () =>{
  initList();
}

// 初期化
const initList = async () => {
  showFlg.value=false;
  messageText.value="";
  const res: any = await systemApi();
  phoneNo.value = res.settings.phoneNo;
  showMessageFlg.value=false;
}
const formSubmit = async(e:any) => {
  showFlg.value=false;
  messageText.value="";
  const formDataReq = new FormData();
  formDataReq.append("phoneNo", phoneNo.value);
  const res: any = await systemSaveApi(formDataReq);
  if(!res.result.success){
   showFlg.value=true;
   messageText.value="保存失敗しましたので管理者を連絡ください";
  } else {
    showMessageFlg.value=true;
    messageText.value="保存しました。";
  }
};
</script>

<template>
  <v-app-bar color="light-blue" class="pl-4" title="FaceTime設定"></v-app-bar>
  <v-alert
        v-model="showMessageFlg"
        color="success"
        icon="$success"
        :text="messageText"
        closable
      ></v-alert>
  <v-card>
    <v-expansion-panels :model-value="[0]">
      <v-expansion-panel>
        <v-expansion-panel-text>
          <v-form class="pa-2 pl-6" @submit="formSubmit">
            <v-container  fluid>
              <v-row>
                <v-col cols="2" >
                  <!-- <div>Facetime通信先</div> -->
                  <v-list-subheader class="text-f">FaceTime通信元</v-list-subheader>
                </v-col>
                <v-col cols="9">
                  <v-text-field
                    v-model="phoneNo"
                    label="通信元"
                    variant="outlined"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    clear-icon="mdi-backspace-outline"
                  ></v-text-field>
                  <div><v-list-item-subtitle style="font-size:medium;">FaceTimeは一人の医療従事者と患者を繋ぎます。ここで設定する番号は医療従事者の番号になり、Appleアカウント又は電話番号で入力して下さい。</v-list-item-subtitle></div>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="10">
                  <v-btn color="cyan" variant="outlined" class="float-right" @click="clear">
                    <template #prepend>
                      <v-icon color="cyan" icon="mdi-backspace-outline"></v-icon>
                    </template>
                    取消
                  </v-btn>
                </v-col>
                <v-col cols="2">
                  <v-btn color="cyan" variant="outlined"  @click="formSubmit">
                    <template #prepend>
                      <v-icon color="cyan" icon="mdi-content-save-outline"></v-icon>
                    </template>
                    保存
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<style scoped>
.text-f {
  height: 60px;
  font-size: large;
}</style>