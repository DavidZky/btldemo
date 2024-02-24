<script setup lang="ts">
import { onMounted, type Ref, ref } from "vue";
import {manageApi, selectPatientApi, selectServerApi, selectFacilityTypeApi, editApi} from '../../../apis/requestApi'

type SearchFormType = {
  facility: string;
  patientId:string;
  serverTypeId: string;
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
// const serverItems: Ref<serverType> = ref([
//   {
//     serverName: '中継器1',
//     id: 1,
//   },
//   {
//     serverName: '中継器2',
//     id: 2,
//   },
//   {
//     serverName: '中継器3',
//     id: 3,
//   },
//   {
//     serverName: '(カスタム)パスルオキシメータ',
//     id: 4,
//   },
// ]);

type patientList = {
  patientName:string;
  id:number;
  patientCode:string;
}[]

const patientItems: Ref<patientList> = ref([]);
// const patientItems: Ref<patientList> = ref([
//   {
//     "patientName": "テスト患者００１",
//     "id": 1,
//     "patientCode": "1001"
//   },
//   {
//     "patientName": "テスト患者００２",
//     "id": 2,
//     "patientCode": "1002"
//   },
//   {
//     "patientName": "患者22",
//     "id": 3,
//     "patientCode": "1022"
//   },
//   {
//     "patientName": "未設定",
//     "id": 0,
//     "patientCode": "9999"
//   }
// ]);

type facilityList = {
  facilityTypeName:string;
  facilityType:number;
}[]

const facilityListItems: Ref<facilityList> = ref([]);
// const facilityItems: Ref<facilityList> = ref([
//   {
//     "facilityTypeName": "LED",
//     "facilityType": 20230910
//   },
//   {
//     "facilityTypeName": "VM",
//     "facilityType": 20231223
//   },
//   {
//     "facilityTypeName": "体温計(BabySmile)",
//     "facilityType": 20230601
//   },
//   {
//     "facilityTypeName": "体温計(BabySmile)",
//     "facilityType": 20230610
//   },
//   {
//     "facilityTypeName": "体温計(custom)",
//     "facilityType": 20230609
//   },
//   {
//     "facilityTypeName": "心拍数(custom)",
//     "facilityType": 20230603
//   },
//   {
//     "facilityTypeName": "心拍数(fujita)",
//     "facilityType": 20230605
//   },
//   {
//     "facilityTypeName": "酸素濃度(custom)",
//     "facilityType": 20230602
//   },
//   {
//     "facilityTypeName": "酸素濃度(fujita)",
//     "facilityType": 20230604
//   },
//   {
//     "facilityTypeName": "収縮期血圧(fujita)",
//     "facilityType": 20230606
//   },
//   {
//     "facilityTypeName": "拡張期血圧(fujita)",
//     "facilityType": 20230607
//   },
//   {
//     "facilityTypeName": "血圧計心拍数(fujita)",
//     "facilityType": 20230608
//   },
//   {
//     "facilityTypeName": "サーマルカメラ",
//     "facilityType": 20240105
//   }

// ]);

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
  patientId: "",
  serverTypeId: "",
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

// const dataOrigin: Ref<TableDataType> = ref([
//   { "server_id": 4,"server_name": "(カスタム)パスルオキシメータ", "id": 5, "patient_id": 1,"patient_code": "1001", "facility_name": "酸素濃度", "facility_type_id": 20230602, "facility_type_name": "酸素濃度(custom)", "server_ip": "ws://10.8.0.200:9005", "facility_addr": "A4-C1-38-F6-4B-B6" },
//   { "server_id": 4,"server_name": "(カスタム)パスルオキシメータ", "id": 6, "patient_id": 2,"patient_code": "1002", "facility_name": "心拍数", "facility_type_id": 20230603, "facility_type_name": "心拍数(custom)", "server_ip": "ws://10.8.0.200:9005", "facility_addr": "A4-C1-38-F6-4B-B6" },
// ])

/**
 * 重置搜索表单
 */
const resetSearchForm = () => {
  searchForm.value = {
    facility: "",
    patientId: "",
    serverTypeId: "",
    page: 1,
    limit: 5,
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

/**
 * 搜索表单
 */

 const searchFormData = async() => {
  showFlg.value=false;
  message.value="";
  Object.keys(editForm).forEach(key => delete editForm[key]);
  const formDataReq = new FormData();
  formDataReq.append("patientId", searchForm.value.patientId);
  formDataReq.append("facilityServerId", searchForm.value.serverTypeId);
  formDataReq.append("facilityName", searchForm.value.facility);
  const res: any = await manageApi(formDataReq);
  // gridOptions.data = res.facilityDataList;
  // tableData.value = res.facilityList.filter((item) => {
  //   if (searchForm.value.using[0].selected && searchForm.value.using[1].selected) {
  //     return searchForm.value.facility.length === 0 || item.facility.includes(searchForm.value.facility);
  //   } else {
  //     return (
  //       item.facility?.includes(searchForm.value.facility)
  //     );
  //   }
  // });
  tableData.value = res.facilityList;
  total.value = tableData.value.length;
};

// const getTableData = () => {
//   tableData.value = dataOrigin.value.filter((item) => {
//     if (searchForm.value.using[0].selected && searchForm.value.using[1].selected) {
//       return searchForm.value.facility.length === 0 || item.facility_name.includes(searchForm.value.facility);
//     } else {
//       return (
//         item.facility_name?.includes(searchForm.value.facility)
//       );
//     }
//   });
//   total.value = tableData.value.length;
// };

const searchFormSubmit = (e) => {
  e.preventDefault();
  // getTableData();
  searchFormData();
};

onMounted(() => {
  // getTableData();
  initList();
  searchFormData();
});

const showFlg = ref(false);
const message = ref();
const editDialog = ref(false);
const editForm = ref({
  id: null,
  facilityName: "",
  facilityTypeId: "",
  facilityAddr:"",
  serverTypeId: "",
  patientId: "",
  title:"",
});

const openEditDialog = (data, index, editFlg) => {
  editForm.value = {
    id: data.id,
    facilityName: data.facilityName,
    facilityTypeId: data.facilityTypeId,
    facilityAddr:data.facilityAddr,
    serverTypeId: data.serverId,
    patientId: data.patientId,
    title: editFlg? '設備データ編集':'設備新規登録',
  };
  editDialog.value = true;
};

const submitEditDialog = async() => {
  // getTableData();
  const formDataReq = new FormData();
  formDataReq.append("facilityName", editForm.value.facilityName);
  formDataReq.append("facilityCode", editForm.value.facilityTypeId);
  formDataReq.append("facilityType", editForm.value.facilityTypeId);
  formDataReq.append("facilityServerId", editForm.value.serverTypeId);
  formDataReq.append("facilityAddr", editForm.value.facilityAddr);
  const res: any = await editApi(formDataReq);
  if(!res.result.success){
   showFlg.value=true;
   message.value=res.result.message;
  }
  searchFormData();
};
</script>

<template>
  <v-app-bar color="light-blue" class="pl-4" title="設備管理"></v-app-bar>
  <v-card class="pa-4">
    <v-expansion-panels :model-value="[0]">
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
                    v-model = "searchForm.serverTypeId"
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
              </v-row>
              <v-row>
                <v-col cols="11">
                  <v-btn color="cyan" variant="outlined" class="float-right" @click="resetSearchForm">
                    <template #prepend>
                      <v-icon color="cyan" icon="mdi-backspace-outline"></v-icon>
                    </template>
                    取消
                  </v-btn>
                </v-col>
                <v-col cols="1">
                  <v-btn color="cyan" variant="outlined" class="float-right" @click="searchFormSubmit">
                    <template #prepend>
                      <v-icon color="cyan" icon="mdi-backspace-outline"></v-icon>
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
            <!-- <v-btn variant="text" @click="delDepartment(item, index)">
              <v-icon class="ma-2 text-grey" icon="mdi-trash-can-outline"></v-icon>
            </v-btn> -->
          </td>
        </tr>
      </tbody>
    </v-table>

    <v-pagination
      v-model="searchForm.page"
      active-color="teal"
      :length="Math.floor(total / searchForm.limit) + 1"
      rounded="circle"
    ></v-pagination>
  </v-card>

  <v-dialog v-model="editDialog" width="800" class="align-start mt-16"  no-click-animation>
    <v-card>
      <div class="px-6 py-3 d-flex align-center justify-space-between">
        <span>{{editForm.title}}</span>
        <v-icon class="cursor-pointer" icon="mdi-close"></v-icon>
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
                hint="設備名"
                prepend-inner-icon="mdi-pencil-outline"
                clearable
                clear-icon="mdi-backspace-outline"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="8">
              <v-select
                v-model = "editForm.facilityTypeId"
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
                hint="department name"
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
            <div v-show="showFlg" class="message-warning">{{message}}</div>
          </v-row>
          <v-row>
            <v-col cols="8">
              <v-btn
                class="ml-3 float-right"
                prepend-icon="mdi-pencil-outline"
                color="cyan"
                variant="tonal"
                @click="submitEditDialog"
                >保存
              </v-btn>
              <v-btn class="ml-3 float-right" variant="text" @click="editDialog = false,showFlg=false, Object.keys(editForm).forEach(key => delete editForm[key])">キャンセル</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>
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
