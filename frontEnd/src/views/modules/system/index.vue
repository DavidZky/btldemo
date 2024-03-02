<script setup lang="ts">
import { onMounted, ref } from "vue";
import {systemApi, systemSaveApi} from '../../../apis/requestApi'

const phoneNo = ref("");
let messageType : any;
messageType = "warning";
const messageText = ref("");
const showFlg = ref(false);

onMounted(() => {
  initList();
});

// 初期化
const initList = async () => {
  showFlg.value=false;
  messageText.value="";
  const res: any = await systemApi();
  phoneNo.value = res.settings.phoneNo;
}
const formSubmit = async(e:any) => {
  showFlg.value=false;
  messageText.value="";
  const formDataReq = new FormData();
  formDataReq.append("phoneNo", phoneNo.value);
  const res: any = await systemSaveApi(formDataReq);
  if(!res.result.success){
   showFlg.value=true;
   messageText.value=res.result.message;
  }
};
</script>

<template>
  <v-app-bar color="light-blue" class="pl-4" title="システム設定"></v-app-bar>
  <v-card>
    <v-expansion-panels :model-value="[0]">
      <message
        :type="messageType"
        :message="messageText"
        :showFlg="showFlg"
      ></message>
      <v-expansion-panel>
        <v-expansion-panel-text>
          <v-form class="pa-2 pl-6" @submit="formSubmit">
            <v-container  fluid>
              <v-row>
                <v-col cols="2" >
                  <!-- <div>Facetime通信先</div> -->
                  <v-list-subheader class="text-f">Facetime通信先</v-list-subheader>
                </v-col>
                <v-col cols="7">
                  <v-text-field
                    v-model="phoneNo"
                    label="通信先"
                    variant="outlined"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    clear-icon="mdi-backspace-outline"
                  ></v-text-field>
                  <div style="margin-top: -35px;"><v-list-subheader class="text-f" style="font-size:medium;">Face Timeは一人の医療従事者と患者を繋ぎます。ここで設定する番号は医療従事者の番号になります。</v-list-subheader></div>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="10">
                  <v-btn color="cyan" variant="outlined" class="float-right" @click="phoneNo=''">
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