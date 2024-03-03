<script setup lang="ts">
import { onMounted, type Ref, ref } from "vue";
import {manageApi, selectPatientApi, selectServerApi, selectFacilityTypeApi, editApi} from '../../../apis/requestApi'
import VueDraggableResizable from "vue-draggable-resizable";

type SearchFormType = {
  facility: string;
  patientId:string;
  facilityServerId: string;
  facilityType: string;
  page: number;
  limit: number;
  using: {
    type: number;
    selected: boolean;
    text: string;
    color: string;
  }[];
};


type serverType = {
  serverName:string;
  id:number;
}[]

const serverItems: Ref<serverType> = ref([])

type patientList = {
  patientName:string;
  id:number;
  patientCode:string;
}[]

const x :any = 500;
const y :any = 100;

const patientItems: Ref<patientList> = ref([]);

type facilityList = {
  facilityTypeName:string;
  facilityType:number;
}[]

const facilityListItems: Ref<facilityList> = ref([]);
type TableDataType = {
  facilityName:string;
  facilityTypeName: string;
  facilityAddr: string;
  serverName: string;
  patientCode: string;
  id: number;
  serverIp: string;
}[];

const searchForm: Ref<SearchFormType> = ref({
  facility: "",
  patientId: <any>null,
  facilityServerId: <any>null,
  facilityType: <any>null,
  page: 1,
  limit: 10,
  using: [
    {
      type: 1,
      selected: true,
      text: "有効",
      color: "success",
    },
    {
      type: 2,
      selected: false,
      text: "無効です",
      color: "error",
    },
  ],
});

const tableData: Ref<TableDataType> = ref([]);
const total: Ref<number> = ref(0);

/**
 * 重置搜索表单
 */
const resetSearchForm = () => {
  showMessageFlg.value=false;
  messageText.value="";
  searchForm.value = {
    facility: "",
    patientId: <any>null,
    facilityServerId: <any>null,
    facilityType: <any>null,
    page: 1,
    limit: 10,
    using: [
      {
        type: 1,
        selected: true,
        text: "有效",
        color: "success",
      },
      {
        type: 2,
        selected: false,
        text: "无效",
        color: "error",
      },
    ],
  };
};
const expansionV: Ref<any> = ref([0]);
// 初期化
const initList = async () => {
  // 患者リスト
  const resPatient: any = await selectPatientApi();
  patientItems.value = resPatient.patientlist;
  // 中継器
  const resServer: any = await selectServerApi();
  serverItems.value = resServer.patientlist;
  // 設備リスト
  const resFacilityList: any = await selectFacilityTypeApi();
  facilityListItems.value = resFacilityList.facilityTypeList;
};

const dataOrigin: Ref<TableDataType> = ref([
  {  
    "serverName": "(カスタム)パスルオキシメータ", 
     "id": 5, 
     "facilityName": "酸素濃度(custom)", 
     "patientCode": "1001", 
     "facilityTypeName": "酸素濃度(custom)", 
     "serverIp": "ws://10.8.0.200:9005", 
     "facilityAddr": "A4-C1-38-F6-4B-B6" ,
    },
])
/**
 * 搜索表单
 */
 const searchFormData = async() => {
  showWarningFlg.value=false;
  messageWarning.value="";
  showMessageFlg.value=false;
  messageText.value="";
  Object.keys(editForm).forEach(key => delete editForm[key]);
  const formDataReq = new FormData();
  formDataReq.append("patientId", searchForm.value.patientId);
  formDataReq.append("facilityServerId", searchForm.value.facilityServerId);
  formDataReq.append("facilityName", searchForm.value.facility);
  formDataReq.append("facilityType", searchForm.value.facilityType);
  const res: any = await manageApi(formDataReq);
  tableData.value = res.facilityList;
  //tableData.value = dataOrigin.value;
  total.value = tableData.value.length;
  searchForm.value.page = 1;
  searchForm.value.limit = 10;
};

const searchFormSubmit = (e) => {
  e.preventDefault();
  searchFormData();
};

onMounted(() => {
  initList();
  searchFormData();
  // tableData.value = dataOrigin.value;
  // total.value = tableData.value.length;
});

const showWarningFlg = ref(false);
const messageWarning = ref();
const editDialog = ref(false);
const editForm = ref({
  id: "",
  facilityName: "",
  facilityType: "",
  facilityAddr:"",
  serverTypeId: "",
  patientId: "",
  title:"",
});

const openEditDialog = (data, index, editFlg) => {
  
  editForm.value = {
    id: data.id.toString(),
    facilityName: data.facilityName,
    facilityType: data.facilityType,
    facilityAddr:data.facilityAddr,
    serverTypeId: data.serverId,
    patientId: data.patientId,
    title: editFlg? '設備データ編集':'設備新規登録',
  };
  editDialog.value = true;
};

let messageType : any;
messageType = "success";
const messageText = ref("");
const showMessageFlg = ref(false);

const submitEditDialog = async() => {
  // getTableData();
  const formDataReq = new FormData();
  formDataReq.append("id", editForm.value.id);
  formDataReq.append("facilityName", editForm.value.facilityName);
  formDataReq.append("facilityCode", editForm.value.patientId);
  formDataReq.append("facilityType", editForm.value.facilityType);
  formDataReq.append("facilityServerId", editForm.value.serverTypeId);
  formDataReq.append("facilityAddr", editForm.value.facilityAddr);
  const res: any = await editApi(formDataReq);
  if(!res.result.success){
    showWarningFlg.value=true;
    messageWarning.value="保存失敗しましたので管理者を連絡ください";
  } else {
    editDialog.value = false;
    searchFormData();
    showMessageFlg.value=true;
    messageText.value="保存しました。";
  }
};

const onResize =  (event) => {
      console.log('Resizing: ', event);
    };

const onDrag = (event) =>{
      x.value = event.x;
      y.value = event.y;
    };

</script>

<template>
  <v-app-bar color="light-blue" class="pl-4" title="設備管理"></v-app-bar>
  <v-card class="pa-4">

    <v-expansion-panels :model-value="expansionV">
      <v-expansion-panel>
        <v-expansion-panel-title disable-icon-rotate>
          検索
          <template #actions="scope">
            <v-icon v-if="!scope.expanded" icon="mdi-magnify"></v-icon>
            <v-icon v-else icon="mdi-chevron-up"></v-icon>
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-form class="pa-2 pl-6" @submit="searchFormSubmit">
            <v-container>
              <v-row>
                <v-col cols="3">
                  <v-select
                    v-model = "searchForm.patientId"
                    :items="patientItems"
                    item-value="id"
                    item-title="patientCode"
                    label="患者ID"
                    variant="outlined"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    clear-icon="mdi-backspace-outline"
                  ></v-select>
                </v-col>
                <v-col cols="3">
                  <v-select
                    v-model = "searchForm.facilityServerId"
                    :items="serverItems"
                    item-value="id"
                    item-title="serverName"
                    label="中継器"
                    variant="outlined"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    clear-icon="mdi-backspace-outline"
                  ></v-select>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    v-model="searchForm.facility"
                    label="設備名"
                    variant="outlined"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    clear-icon="mdi-backspace-outline"
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-select
                    v-model = "searchForm.facilityType"
                    :items="facilityListItems"
                    item-value="facilityType"
                    item-title="facilityTypeName"
                    label="設備タイプ"
                    variant="outlined"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    clear-icon="mdi-backspace-outline"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="11">
                  <v-btn color="cyan" variant="outlined" class="float-right" @click="resetSearchForm">
                    <template #prepend>
                      <v-icon color="cyan" icon="mdi-backspace-outline"></v-icon>
                    </template>
                    クリア
                  </v-btn>
                </v-col>
                <v-col cols="1">
                  <v-btn color="cyan" variant="outlined" class="float-right" @click="searchFormSubmit">
                    <template #prepend>
                      <v-icon color="cyan" icon="mdi-magnify-minus-outline"></v-icon>
                    </template>
                    検索
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-btn class="my-8" color="cyan" variant="outlined" @click="openEditDialog(editForm, null, false)" @close="editDialog = false">
      <template #prepend>
        <v-icon icon="mdi-plus-circle-outline"></v-icon>
      </template>
      新規追加
    </v-btn>
    <v-alert
        v-model="showMessageFlg"
        color="success"
        icon="$success"
        :text="messageText"
        closable
      ></v-alert>
    <v-table fixed-header>
      <thead>
        <tr>
          <th class="text-left">設備名</th>
          <th class="text-left">設備タイプ</th>
          <th class="text-left">macアドレス</th>
          <th class="text-left">中継器名</th>
          <th class="text-left">患者ID</th>
          <th class="text-left">ACTION</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in tableData.slice(
            searchForm.page * searchForm.limit - searchForm.limit,
            searchForm.page * searchForm.limit,
          )"
          :key="index"
        >
          <td>{{ item.facilityName}}</td>
          <td>{{ item.facilityTypeName }}</td>
          <td>{{ item.facilityAddr }}</td>
          <td>{{ item.serverName }}</td>
          <td>{{ item.patientCode }}</td>
          <td>
            <v-btn variant="text" @click="openEditDialog(item, index, true)" @close="editDialog = false">
              <v-icon class="ma-2 text-grey" icon="mdi-pencil-outline"></v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <v-pagination
      v-model="searchForm.page"
      active-color="teal"
      :length="total%searchForm.limit > 0?Math.floor(total / searchForm.limit) + 1:Math.floor(total / searchForm.limit) "
      rounded="circle"
    ></v-pagination>

  </v-card>

  <v-dialog v-model="editDialog">
    <vue-draggable-resizable :w="800" :h="800" :x="x" :y="y" @resizing="onResize" @dragging="onDrag">
      <v-card >
        <div class="px-6 py-3 d-flex align-center justify-space-between">
          <span>設備編集</span>
          <v-icon class="cursor-pointer" icon="mdi-close" @click="editDialog = false,showWarningFlg=false, Object.keys(editForm).forEach(key => delete editForm[key])"></v-icon>
        </div>
        <v-divider></v-divider>
        <v-form class="pa-3">
          <v-container>
            <v-row>
              <v-col cols="8">
                <v-text-field
                  v-model="editForm.facilityName"
                  label="設備名"
                  variant="outlined"
                  prepend-inner-icon="mdi-pencil-outline"
                  clearable
                  clear-icon="mdi-backspace-outline"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="8">
                <v-select
                  v-model = "editForm.facilityType"
                  :items="facilityListItems"
                  item-value="facilityType"
                  item-title="facilityTypeName"
                  label="設備タイプ"
                  variant="outlined"
                  prepend-inner-icon="mdi-magnify"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="8">
                <v-text-field
                  v-model="editForm.facilityAddr"
                  label="Macアドレス"
                  variant="outlined"
                  prepend-inner-icon="mdi-pencil-outline"
                  clearable
                  clear-icon="mdi-backspace-outline"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="8">
                <v-select
                  v-model = "editForm.patientId"
                  :items="patientItems"
                  item-value="id"
                  item-title="patientCode"
                  label="患者ID"
                  variant="outlined"
                  prepend-inner-icon="mdi-magnify"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="8">
                <v-select
                  v-model = "editForm.serverTypeId"
                  :items="serverItems"
                  item-value="id"
                  item-title="serverName"
                  label="中継器"
                  variant="outlined"
                  prepend-inner-icon="mdi-magnify"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <div v-show="showWarningFlg" class="message-warning">{{messageWarning}}</div>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-btn
                  class="ml-3 float-right"
                  prepend-icon="mdi-content-save-outline"
                  color="cyan"
                  variant="tonal"
                  @click="submitEditDialog"
                  >保存
                </v-btn>
                <v-btn class="ml-3 float-right" 
                prepend-icon="mdi-backspace-outline"
                variant="text" @click="editDialog = false,showWarningFlg=false, Object.keys(editForm).forEach(key => delete editForm[key])">取消</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card>
    </vue-draggable-resizable>
  </v-dialog>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.message-warning {
  color: #fc0707;
  text-align: center;
}
</style>
