<script setup lang="ts">
import { onMounted, type Ref, ref , watch} from "vue";
import saveAs from "file-saver";
import  Dayjs  from 'dayjs'
import message from '../../../components/Message.vue'
import {historyApi, selectPatientApi, selectServerApi, selectFacilityTypeApi } from '../../../apis/requestApi'

type SearchFormType = {
  facility: string;
  patientId: string;
  serverTypeId:string;
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
// ]);

type patientList = {
  patientName:string;
  id:number;
  patientCode:string;
}[]
const patientItems: Ref<patientList> = ref([])
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

const facilityListItems: Ref<facilityList> = ref([])
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

// type TableDataType = {
//   time:string;
//   patient: string;
//   facility: string;
//   value:number;
//   unit:string;
// }[];
type TableDataType = {
  createDate:string;
  patientCode: string;
  facilityName: string;
  facilityValue:number;
  valueUnit:string;
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

  // 開始時間 + 終了時間
  const dtStatus :Ref<boolean> = ref(false);
  const datetime = ref()
  const formatDate = ref()

  const dtStatusEnd :Ref<boolean> = ref(false);
  const datetimeEnd = ref()
  const formatDateEnd = ref()

  defineProps<{
    // modelValue:string,
    // modelValueEnd:string,
    // label:string
  }>()
  const emit = defineEmits(['update:modelValue','update:modelValueEnd']) ;
  const clickHandle = () => {
    formatDate.value = Dayjs(datetime.value).format("YYYY-MM-DD")
    emit('update:modelValue',formatDate.value)
    dtStatus.value = false
  }

  const clickHandleEnd = () => {
    formatDateEnd.value = Dayjs(datetimeEnd.value).format("YYYY-MM-DD")
    emit('update:modelValueEnd',formatDateEnd.value)
    dtStatusEnd.value = false
  }
//   const dataOrigin: Ref<TableDataType> = ref([
//  { "patient_code": "0000", "facility_name": "心拍数", "create_date": "2024-02-11T08:33:43", "facility_value": 65.00, "value_unit": "ppm" },
//  { "patient_code": "0000", "facility_name": "拡張期血圧", "create_date": "2024-02-11T08:33:43", "facility_value": 49.00, "value_unit": "mmHg" },
//  { "patient_code": "0000", "facility_name": "収縮期血圧", "create_date": "2024-02-11T08:33:43", "facility_value": 93.00, "value_unit": "mmHg" },
//  { "patient_code": "0000", "facility_name": "心拍数", "create_date": "2024-02-11T08:31:57", "facility_value": 81.00, "value_unit": "ppm" },
//  { "patient_code": "0000", "facility_name": "酸素濃度", "create_date": "2024-02-11T08:31:57", "facility_value": 98.00, "value_unit": "%" },
//  { "patient_code": "0000", "facility_name": "心拍数", "create_date": "2024-02-11T08:31:56", "facility_value": 81.00, "value_unit": "ppm" },
//  { "patient_code": "0000", "facility_name": "酸素濃度", "create_date": "2024-02-11T08:31:56", "facility_value": 98.00, "value_unit": "%" },
//  { "patient_code": "0000", "facility_name": "心拍数", "create_date": "2024-02-11T08:31:55", "facility_value": 81.00, "value_unit": "ppm" },
//  { "patient_code": "0000", "facility_name": "酸素濃度", "create_date": "2024-02-11T08:31:55", "facility_value": 98.00, "value_unit": "%" },
//  { "patient_code": "0000", "facility_name": "心拍数", "create_date": "2024-02-11T08:31:54", "facility_value": 81.00, "value_unit": "ppm" },
//  { "patient_code": "0000", "facility_name": "酸素濃度", "create_date": "2024-02-11T08:31:54", "facility_value": 98.00, "value_unit": "%" },
//  { "patient_code": "0000", "facility_name": "心拍数", "create_date": "2024-02-11T08:31:53", "facility_value": 81.00, "value_unit": "ppm" },
//  { "patient_code": "0000", "facility_name": "酸素濃度", "create_date": "2024-02-11T08:31:53", "facility_value": 98.00, "value_unit": "%" },
//  { "patient_code": "0000", "facility_name": "心拍数", "create_date": "2024-02-11T08:31:52", "facility_value": 81.00, "value_unit": "ppm" },
//  { "patient_code": "0000", "facility_name": "酸素濃度", "create_date": "2024-02-11T08:31:52", "facility_value": 98.00, "value_unit": "%" },
//  { "patient_code": "0000", "facility_name": "心拍数", "create_date": "2024-02-11T08:31:51", "facility_value": 81.00, "value_unit": "ppm" },
//  { "patient_code": "0000", "facility_name": "酸素濃度", "create_date": "2024-02-11T08:31:51", "facility_value": 98.00, "value_unit": "%" },
//  { "patient_code": "0000", "facility_name": "心拍数", "create_date": "2024-02-11T08:31:50", "facility_value": 81.00, "value_unit": "ppm" },
//  { "patient_code": "0000", "facility_name": "酸素濃度", "create_date": "2024-02-11T08:31:50", "facility_value": 99.00, "value_unit": "%" },
//  { "patient_code": "0000", "facility_name": "心拍数", "create_date": "2024-02-11T08:31:49", "facility_value": 81.00, "value_unit": "ppm" },
//  { "patient_code": "0000", "facility_name": "酸素濃度", "create_date": "2024-02-11T08:31:49", "facility_value": 99.00, "value_unit": "%" },
//  { "patient_code": "0000", "facility_name": "心拍数", "create_date": "2024-02-11T08:31:48", "facility_value": 81.00, "value_unit": "ppm" },
//  { "patient_code": "0000", "facility_name": "酸素濃度", "create_date": "2024-02-11T08:31:48", "facility_value": 99.00, "value_unit": "%" },
//  { "patient_code": "0000", "facility_name": "心拍数", "create_date": "2024-02-11T08:31:47", "facility_value": 81.00, "value_unit": "ppm" },
//  { "patient_code": "0000", "facility_name": "酸素濃度", "create_date": "2024-02-11T08:31:47", "facility_value": 99.00, "value_unit": "%" },
//  { "patient_code": "0000", "facility_name": "心拍数", "create_date": "2024-02-11T08:31:46", "facility_value": 81.00, "value_unit": "ppm" },
//  { "patient_code": "0000", "facility_name": "酸素濃度", "create_date": "2024-02-11T08:31:46", "facility_value": 99.00, "value_unit": "%" },
//  { "patient_code": "0000", "facility_name": "心拍数", "create_date": "2024-02-11T08:31:45", "facility_value": 81.00, "value_unit": "ppm" },
//  { "patient_code": "0000", "facility_name": "酸素濃度", "create_date": "2024-02-11T08:31:45", "facility_value": 99.00, "value_unit": "%" },
//  { "patient_code": "0000", "facility_name": "体温", "create_date": "2024-02-11T08:30:33", "facility_value": 36.70, "value_unit": "℃" },
//  { "patient_code": "0000", "facility_name": "心拍数", "create_date": "2024-02-10T08:05:18", "facility_value": 66.00, "value_unit": "ppm" },
//  { "patient_code": "0000", "facility_name": "拡張期血圧", "create_date": "2024-02-10T08:05:18", "facility_value": 47.00, "value_unit": "mmHg" },
//  { "patient_code": "0000", "facility_name": "収縮期血圧", "create_date": "2024-02-10T08:05:18", "facility_value": 93.00, "value_unit": "mmHg" },
//  { "patient_code": "0000", "facility_name": "体温", "create_date": "2024-02-10T07:58:22", "facility_value": 36.60, "value_unit": "℃" },
//  { "patient_code": "0000", "facility_name": "心拍数", "create_date": "2024-02-09T08:21:59", "facility_value": 78.00, "value_unit": "ppm" },
//  ])

/**
 * 重置搜索表单
 */

const resetSearchForm = () => {
  formatDate.value = undefined
  formatDateEnd.value = undefined
  searchForm.value = {
    facility: "",
    patientId : "",
    serverTypeId:"",
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

/**
 * 搜索表单
 */

const searchFormData = async() => {

  const formDataReq = new FormData();
  formDataReq.append("createDateFrom", formatDate.value);
  formDataReq.append("createDateTo", formatDateEnd.value);
  formDataReq.append("facilityName", searchForm.value.facility);
  formDataReq.append("patientId", searchForm.value.patientId);
  formDataReq.append("facilityServerId", searchForm.value.serverTypeId);
  const res: any = await historyApi(formDataReq);
  // gridOptions.data = res.facilityDataList;
  // tableData.value = res.facilityDataList.filter((item) => {
  //   if (searchForm.value.using[0].selected && searchForm.value.using[1].selected) {
  //     return searchForm.value.facility.length === 0 || item.facility_name.includes(searchForm.value.facility);
  //   } else {
  //     return (
  //       item.facility_name?.includes(searchForm.value.facility)
  //     );
  //   }
  // });
  tableData.value = res.facilityDataList;
  total.value = tableData.value.length;
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

const csvDownLoad = () => {
      let csvContent = "日時, 患者ID,設備名,値,単位\n";
      tableData.value.forEach((item,index) =>{
        csvContent += `${item.createDate}, ${item.patientCode},${item.facilityName},${item.facilityValue},${item.valueUnit}\n`;
      })
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8' });     
      const fileName = `patient_` + getCurrentTime() + `.csv` ;      
      saveAs(blob, fileName);
}

const getCurrentTime = () => {
      let now = new Date();
      let year = now.getFullYear().toString().padStart(4, '0');;
      let month = (now.getMonth() + 1).toString().padStart(2, '0');
      let day = now.getDate().toString().padStart(2, '0');
      let hours = now.getHours().toString().padStart(2, '0');
      let minutes = now.getMinutes().toString().padStart(2, '0');
      let currentTime = `${year}${month}${day}${hours}${minutes}`;
      return currentTime;
}

const searchFormSubmit = (e: { preventDefault: () => void; }) => {
  e.preventDefault();
  // getTableData();
  searchFormData();
};

onMounted(() => {
  // getTableData();
  initList();
  searchFormData();
});
let messageType : any;
messageType = "warning";
const messageText = ref("BBB");
const showFlg = ref(false);
</script>

<template>
  <v-app-bar color="light-blue" class="pl-4" title="患者データ照会"></v-app-bar>
  <v-card class="pa-4">
    <v-expansion-panels :model-value="[0]">
    <message
      :type="messageType"
      :message="messageText"
      :showFlg="showFlg"
    ></message>
        <!-- <v-alert
          v-model="alert"
          color="warning"
          icon="$warning"
          title="Alert title"
          text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis quis est labore voluptatibus..."
        ></v-alert> -->
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
                <v-col cols="4">
                  <v-menu
                  :close-on-content-click="false"
                  location="bottom"
                  v-model="dtStatus"
                  >
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-model="formatDate"
                        v-bind="props"
                        label="開始時間"
                        variant="outlined"
                        hint="開始時間"
                        prepend-inner-icon="mdi-magnify"
                        clearable
                        clear-icon="mdi-backspace-outline"
                        readonly
                      ></v-text-field>
                      </template>
                      <v-locale-provider>
                        <v-date-picker v-model="datetime" color="primary">
                            <template v-slot:actions>
                              <v-btn color="primary" @click="dtStatus = false">取消</v-btn>
                              <v-btn color="primary" @click="clickHandle">确定</v-btn>
                            </template>
                        </v-date-picker>
                      </v-locale-provider>
                  </v-menu>  
                </v-col>
                <v-col cols="1">         
                  <v-btn type="submit" block class="mt-2">TO</v-btn>
                </v-col>
                <v-col cols="4">
                  <v-menu
                  :close-on-content-click="false"
                  location="bottom"
                  v-model="dtStatusEnd"
                  >
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-model="formatDateEnd"
                        v-bind="props"
                        label="終了時間"
                        variant="outlined"
                        hint="終了時間"
                        prepend-inner-icon="mdi-magnify"
                        clearable
                        clear-icon="mdi-backspace-outline"
                        readonly
                      ></v-text-field>
                      </template>
                      <v-locale-provider>
                        <v-date-picker v-model="datetimeEnd" color="primary">
                            <template v-slot:actions>
                              <v-btn color="primary" @click="dtStatusEnd = false">取消</v-btn>
                              <v-btn color="primary" @click="clickHandleEnd">确定</v-btn>
                            </template>
                        </v-date-picker>
                      </v-locale-provider>
                  </v-menu> 
                </v-col>
              </v-row>
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
                <v-col cols="10">
                  <v-btn color="cyan" variant="outlined" class="float-right" @click="resetSearchForm">
                    <template #prepend>
                      <v-icon color="cyan" icon="mdi-backspace-outline"></v-icon>
                    </template>
                    取消
                  </v-btn>
                </v-col>
                <v-col cols="2">
                  <v-btn color="cyan" variant="outlined"  @click="searchFormSubmit">
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

    <v-btn class="my-8" color="cyan" variant="outlined" @click="csvDownLoad()">
      <template #prepend>
          <v-icon color="cyan" icon="mdi-download-circle"></v-icon>
       </template>
      CSVダウンロード
    </v-btn>
    <!-- <v-col>
              <vxe-pager
                :page-sizes="[50, 70, 100]"
                :border="true"
                :background="false"
                :perfect="false"
                :layouts="[
                  'Sizes',
                  'PrevJump',
                  'PrevPage',
                  'Number',
                  'NextPage',
                  'NextJump',
                  'Total',
                ]"
              >
              </vxe-pager>
              <vxe-grid
                ref="xTable"
                v-bind="gridOptions"
              >
              </vxe-grid>
            </v-col> -->
    <v-table fixed-header>
      <thead>
        <tr>
          <th class="text-left">日時</th>
          <th class="text-left">患者ID</th>
          <th class="text-left">設備名</th>
          <th class="text-left">値</th>
          <th class="text-left">単位</th>
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
          <td>{{ item.createDate}}</td>
          <td>{{ item.patientCode }}</td>
          <td>{{ item.facilityName }}</td>
          <td>{{ item.facilityValue }}</td>
          <td>{{ item.valueUnit }}</td>
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
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
