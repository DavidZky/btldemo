<script setup lang="ts"></script>

<script setup lang="ts">
import { onMounted, type Ref, ref } from "vue";

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
  facility: string;
  facilityType: string;
  macAddress: string;
  mcr:string;
  patient: string;
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
    facility: "設備名1",
    facilityType: "設備タイプ1",
    macAddress: "192.168.1.1",
    mcr:"中継機22番",
    patient: "患者1",
  },
  {
    facility: "設備名1",
    facilityType: "設備タイプ1",
    macAddress: "192.168.1.1",
    mcr:"中継機22番",
    patient: "患者1",
  },
  {
    facility: "設備名1",
    facilityType: "設備タイプ1",
    macAddress: "192.168.1.1",
    mcr:"中継機22番",
    patient: "患者1",
  },
  {
    facility: "設備名1",
    facilityType: "設備タイプ1",
    macAddress: "192.168.1.1",
    mcr:"中継機22番",
    patient: "患者1",
  },
  {
    facility: "設備名1",
    facilityType: "設備タイプ1",
    macAddress: "192.168.1.1",
    mcr:"中継機22番",
    patient: "患者1",
  },
  {
    facility: "設備名1",
    facilityType: "設備タイプ1",
    macAddress: "192.168.1.1",
    mcr:"中継機22番",
    patient: "患者1",
  },
  {
    facility: "設備名1",
    facilityType: "設備タイプ1",
    macAddress: "192.168.1.1",
    mcr:"中継機22番",
    patient: "患者1",
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

const searchFormSubmit = (e) => {
  e.preventDefault();
  getTableData();
};

const delDepartment = (data, index) => {
  console.log(data, index);
  delIndex.value = index;
  delDialog.value = true;
};

onMounted(() => {
  getTableData();
});

const addDialog = ref(false);
const addDepartmentName = ref("");

const submitAddDialog = (e) => {
  e.preventDefault();
  if (!addDepartmentName.value.length) return;
  dataOrigin.value.push({
    facility: addDepartmentName.value,
    facilityType: "1",
    macAddress: "1",
    mcr:"1",
    patient: "1",
  });
  getTableData();
  addDialog.value = false;
};

const delDialog = ref(false);
const delIndex = ref(0);

const submitDelDialog = () => {
  dataOrigin.value.splice(delIndex.value, 1);
  getTableData();
  delDialog.value = false;
};

const editDialog = ref(false);
const editForm = ref({
  facility: addDepartmentName.value,
  facilityType: "1",
  macAddress: "1",
  mcr:"1",
  patient: "1",
});

const openEditDialog = (data, index) => {
  editForm.value = {
    facility: addDepartmentName.value,
    facilityType: "1",
    macAddress: "1",
    mcr:"1",
    patient: "1",
  };
  editDialog.value = true;
};

const submitEditDialog = () => {
  if (!editForm.value.facility) return;
  dataOrigin.value.splice(editForm.value.facility, 1, {
    facility: addDepartmentName.value,
    facilityType: "1",
    macAddress: "1",
    mcr:"1",
    patient: "1",
  });
  getTableData();
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
                <v-col cols="4">
                  <v-text-field
                    v-model="searchForm.facility"
                    label="患者ID"
                    variant="outlined"
                    hint="department name"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    clear-icon="mdi-backspace-outline"
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    v-model="searchForm.facility"
                    label="中継機"
                    variant="outlined"
                    hint="department name"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    clear-icon="mdi-backspace-outline"
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    v-model="searchForm.facility"
                    label="設備名"
                    variant="outlined"
                    hint="department name"
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

    <v-btn class="my-8" color="cyan" variant="outlined" @click.stop="addDialog = true">
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
          <td>{{ item.facility}}</td>
          <td>{{ item.facilityType }}</td>
          <td>{{ item.macAddress }}</td>
          <td>{{ item.mcr }}</td>
          <td>{{ item.patient }}</td>
          <td>
            <v-btn variant="text" @click="openEditDialog(item, index)">
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

  <v-dialog v-model="addDialog" width="500" class="align-start mt-16">
    <v-card>
      <div class="px-6 py-3 d-flex align-center justify-space-between">
        <span>追加</span>
        <v-icon class="cursor-pointer" icon="mdi-close"></v-icon>
      </div>
      <v-divider></v-divider>
      <v-form class="pa-3 ma-4" @submit="submitAddDialog">
        <v-text-field
          v-model="addDepartmentName"
          label="部门名称"
          variant="outlined"
          hint="department name"
          prepend-inner-icon="mdi-plus-circle-outline"
          clearable
          clear-icon="mdi-backspace-outline"
        ></v-text-field>
      </v-form>
      <v-card-actions>
        <v-spacer></v-spacer>
        <div class="float-right">
          <v-btn size="small" @click="addDialog = false">キャンセル</v-btn>
          <v-btn
            size="small"
            prepend-icon="mdi-plus-circle-outline"
            color="cyan"
            variant="tonal"
            @click="submitAddDialog"
            >追加
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- <v-dialog v-model="delDialog" width="500" class="align-start mt-16">
    <v-card>
      <div class="px-6 py-3 d-flex align-center justify-space-between">
        <span> 削除</span>
        <v-icon class="cursor-pointer" icon="mdi-close"></v-icon>
      </div>
      <v-divider></v-divider>
      <div class="pa-3">アイテムを削除するかどうか</div>
      <v-card-actions>
        <v-spacer></v-spacer>
        <div class="float-right">
          <v-btn size="small" @click="delDialog = false">キャンセル</v-btn>
          <v-btn
            size="small"
            prepend-icon="mdi-trash-can-outline"
            color="red-lighten-1"
            variant="tonal"
            @click="submitDelDialog"
            >を選択して、
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog> -->

  <v-dialog v-model="editDialog" width="800" class="align-start mt-16">
    <v-card>
      <div class="px-6 py-3 d-flex align-center justify-space-between">
        <span>部署名</span>
        <v-icon class="cursor-pointer" icon="mdi-close"></v-icon>
      </div>
      <v-divider></v-divider>
      <v-form class="pa-3">
        <v-container>
          <v-row>
            <v-col cols="8">
              <v-text-field
                v-model="editForm.title"
                label="部署名"
                variant="outlined"
                hint="department name"
                prepend-inner-icon="mdi-pencil-outline"
                clearable
                clear-icon="mdi-backspace-outline"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-btn
                class="ml-3 float-right"
                prepend-icon="mdi-pencil-outline"
                color="cyan"
                variant="tonal"
                @click="submitEditDialog"
                >更新
              </v-btn>
              <v-btn class="ml-3 float-right" variant="text" @click="editDialog = false">キャンセル</v-btn>
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
</style>
