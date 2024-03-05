<script setup lang="ts">
import { onMounted, type Ref, ref , watch} from "vue";
import saveAs from "file-saver";
import  Dayjs  from 'dayjs'
import {historyApi, selectPatientApi, selectServerApi, selectFacilityTypeApi } from '../../../apis/requestApi'

type SearchFormType = {
  facility: string;
  patientId: string;
  facilityServerId:string;
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
const patientItems: Ref<patientList> = ref([])

type facilityList = {
  facilityTypeName:string;
  facilityType:number;
}[]

const facilityListItems: Ref<facilityList> = ref([])
type TableDataType = {
  createDate:string;
  patientCode: string;
  facilityName: string;
  facilityValue:number;
  valueUnit:string;
}[];
const searchForm: Ref<SearchFormType> = ref({
  facility: "",
  patientId : <any>null,
  facilityServerId:<any>null,
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

// 開始日 + 終了日
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

/**
 * 重置搜索表单
 */
const resetSearchForm = () => {
  formatDate.value = undefined
  formatDateEnd.value = undefined
  searchForm.value = {
    facility: "",
    patientId : <any>null,
    facilityServerId:<any>null,
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

/**
 * 搜索表单
 */
const searchFormData = async() => {

  const formDataReq = new FormData();
  formDataReq.append("createDateFrom", formatDate.value);
  formDataReq.append("createDateTo", formatDateEnd.value);
  formDataReq.append("facilityName", searchForm.value.facility);
  formDataReq.append("patientId", searchForm.value.patientId);
  formDataReq.append("facilityServerId", searchForm.value.facilityServerId);
  const res: any = await historyApi(formDataReq);
  tableData.value = res.facilityDataList;
  total.value = tableData.value.length;
  searchForm.value.page = 1;
  searchForm.value.limit = 10;
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
</script>

<template>
  <v-app-bar color="light-blue" class="pl-4" title="患者データ照会"></v-app-bar>
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
                        label="開始日"
                        variant="outlined"
                        hint="開始日"
                        prepend-inner-icon="mdi-magnify"
                        clearable
                        clear-icon="mdi-backspace-outline"
                        readonly
                      ></v-text-field>
                      </template>
                      <v-locale-provider locale="ja">
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
                        label="終了日"
                        variant="outlined"
                        hint="終了日"
                        prepend-inner-icon="mdi-magnify"
                        clearable
                        clear-icon="mdi-backspace-outline"
                        readonly
                      ></v-text-field>
                      </template>
                      <v-locale-provider locale="ja">
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
              </v-row>
              <v-row>
                <v-col cols="10">
                  <v-btn color="cyan" variant="outlined" class="float-right" @click="resetSearchForm">
                    <template #prepend>
                      <v-icon color="cyan" icon="mdi-backspace-outline"></v-icon>
                    </template>
                    クリア
                  </v-btn>
                </v-col>
                <v-col cols="2">
                  <v-btn color="cyan" variant="outlined"  @click="searchFormSubmit">
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

    <v-btn class="my-8" color="cyan" variant="outlined" @click="csvDownLoad()">
      <template #prepend>
          <v-icon color="cyan" icon="mdi-download-circle"></v-icon>
       </template>
      CSVダウンロード
    </v-btn>
    <v-table fixed-header>
      <thead>
        <tr>
          <th class="text-left">日時</th>
          <th class="text-left">患者ID</th>
          <th class="text-left">センサー設備</th>
          <th class="text-left">計測値</th>
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
      :length="total%searchForm.limit > 0?Math.floor(total / searchForm.limit) + 1:Math.floor(total / searchForm.limit) "
      rounded="circle"
    ></v-pagination>
  </v-card>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
