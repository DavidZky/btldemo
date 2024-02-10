<script setup lang="ts">
import { onMounted, type Ref, ref } from "vue";
import saveAs from "file-saver";

type SearchFormType = {
  facility: string;
  page: number;
  limit: number;
  using: {
    type: number;
    selected: boolean;
    text: string;
    color: string;
  }[];
};

type TableDataType = {
  time:string;
  patient: string;
  facility: string;
  value:number;
  unit:string;
}[];

const searchForm: Ref<SearchFormType> = ref({
  facility: "",
  page: 1,
  limit: 5,
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

const dataOrigin: Ref<TableDataType> = ref([
  {
    time: '2024-02-01 10:10:10',
    patient: "患者1",
    facility: "設備名1",
    value: 26.5,
    unit:"°C",
  },
  {
    time: '2024-02-01 10:10:10',
    patient: "患者2",
    facility: "設備名2",
    value: 26.5,
    unit:"°C",
  },
  {
    time: '2024-02-01 10:10:10',
    patient: "患者3",
    facility: "設備名3",
    value: 26.5,
    unit:"°C",
  },
  {
    time: '2024-02-01 10:10:10',
    patient: "患者4",
    facility: "設備名4",
    value: 26.5,
    unit:"°C",
  },
  {
    time: '2024-02-01 10:10:10',
    patient: "患者5",
    facility: "設備名5",
    value: 26.5,
    unit:"°C",
  },
  {
    time: '2024-02-01 10:10:10',
    patient: "患者6",
    facility: "設備名6",
    value: 26.5,
    unit:"°C",
  },
  {
    time: '2024-02-01 10:10:10',
    patient: "患者7",
    facility: "設備名7",
    value: 26.5,
    unit:"°C",
  },
  {
    time: '2024-02-01 10:10:10',
    patient: "患者8",
    facility: "設備名8",
    value: 26.5,
    unit:"°C",
  },
  {
    time: '2024-02-01 10:10:10',
    patient: "患者9",
    facility: "設備名9",
    value: 26.5,
    unit:"°C",
  },
  {
    time: '2024-02-01 10:10:10',
    patient: "患者10",
    facility: "設備名10",
    value: 26.5,
    unit:"°C",
  },
  {
    time: '2024-02-01 10:10:10',
    patient: "患者11",
    facility: "設備名11",
    value: 26.5,
    unit:"°C",
  },
  {
    time: '2024-02-01 10:10:10',
    patient: "患者12",
    facility: "設備名12",
    value: 26.5,
    unit:"°C",
  },
]);

/**
 * 重置搜索表单
 */

const resetSearchForm = () => {
  searchForm.value = {
    facility: "",
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

const getTableData = () => {
  tableData.value = dataOrigin.value.filter((item) => {
    if (searchForm.value.using[0].selected && searchForm.value.using[1].selected) {
      return searchForm.value.facility.length === 0 || item.facility.includes(searchForm.value.facility);
    } else {
      return (
        item.facility?.includes(searchForm.value.facility)
      );
    }
  });
  total.value = tableData.value.length;
};

const csvDownLoad = () => {
      let csvContent = "日時, 患者ID,設備名,値,単位\n";
      dataOrigin.value.forEach((item,index) =>{
        csvContent += `${item.time}, ${item.patient},${item.facility},${item.value},${item.unit}\n`;
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

let startTime = false;
const datePickerShow = () =>{
  startTime  = true;
}

const searchFormSubmit = (e: { preventDefault: () => void; }) => {
  e.preventDefault();
  getTableData();
};

onMounted(() => {
  getTableData();
});
</script>

<template>
  <v-app-bar color="light-blue" class="pl-4" title="患者データ照会"></v-app-bar>
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
                <v-col cols="4">
                  <v-text-field
                    v-model="searchForm.facility"
                    label="開始時間"
                    variant="outlined"
                    hint="開始時間"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    clear-icon="mdi-backspace-outline"
                    @click="datePickerShow()"
                  ></v-text-field>
                </v-col>
                <v-col cols="1">         
                  <v-btn type="submit" block class="mt-2">TO</v-btn>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    v-model="searchForm.facility"
                    label="終了時間"
                    variant="outlined"
                    hint="終了時間"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    clear-icon="mdi-backspace-outline"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="3">
                  <v-text-field
                    v-model="searchForm.facility"
                    label="患者ID"
                    variant="outlined"
                    hint="患者ID"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    clear-icon="mdi-backspace-outline"
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    v-model="searchForm.facility"
                    label="中継器"
                    variant="outlined"
                    hint="中継器"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    clear-icon="mdi-backspace-outline"
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    v-model="searchForm.facility"
                    label="設備名"
                    variant="outlined"
                    hint="設備名"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    clear-icon="mdi-backspace-outline"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-btn color="cyan" variant="outlined" class="float-right" @click="resetSearchForm">
                    <template #prepend>
                      <v-icon color="cyan" icon="mdi-backspace-outline"></v-icon>
                    </template>
                    検索結果の消去
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
          <td>{{ item.time}}</td>
          <td>{{ item.patient }}</td>
          <td>{{ item.facility }}</td>
          <td>{{ item.value }}</td>
          <td>{{ item.unit }}</td>
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
