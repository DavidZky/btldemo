<script setup lang="ts">
import { onMounted, type Ref, ref } from "vue";
import {selectPatientApi, editApi,patients,addPatient,updatePatient,delPatient} from '../../../apis/requestApi'
import VueDraggableResizable from "vue-draggable-resizable";

type SearchFormType = {
  patientCode:string;
  patientName: string;
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
  patientName: string;
  patientCode: string;
  id: number;
}[];

const searchForm: Ref<SearchFormType> = ref({
  patientCode: "",
  patientName: "",
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
    patientCode: "",
    patientName: "",
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
};

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
  formDataReq.append("patientCode", searchForm.value.patientCode);
  formDataReq.append("patientName", searchForm.value.patientName);
  const res: any = await patients(formDataReq);
  tableData.value = res.patientlist;
  //tableData.value = [{"id":1,"patientCode":"001","patientName":"test"},{"id":2,"patientCode":"002","patientName":"test1"}];
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
  patientCode: "",
  patientName: "",
  title:"",
});

const openEditDialog = (data, index, editFlg) => {
  editForm.value = {
    id: data.id,
    patientCode:data.patientCode,
    patientName: data.patientName,
    title: editFlg? '患者編集':'患者新規登録',
  };
  editDialog.value = true;
};


const addDialog = ref(false);
const addForm = ref({
  id: "",
  patientCode: "",
  patientName: "",
  title:"",
});

const openAddDialog = () => {
  addForm.value = {
    id: "0",
    patientCode:"",
    patientName: "",
    title: '患者新規登録',
  };
  addDialog.value = true;
};


const delDialog = ref(false);
const delForm = ref({
  id: "",
  patientCode: "",
  patientName: "",
  title:"",
});

const openDelDialog = (data, index, delFlg) => {
  delForm.value = {
    id: data.id,
    patientCode:data.patientCode,
    patientName: data.patientName,
    title: '患者削除',
  };
  delDialog.value = true;
};


let messageType : any;
messageType = "success";
const messageText = ref("");
const showMessageFlg = ref(false);

const submitEditDialog = async() => {
  // getTableData();
  const formDataReq = new FormData();
  formDataReq.append("id", editForm.value.id);
  formDataReq.append("patientCode", editForm.value.patientCode);
  formDataReq.append("patientName", editForm.value.patientName);
  const res: any = await updatePatient(formDataReq);
  if(!res.result.success){
    showWarningFlg.value=true;
    messageWarning.value=res.result.message;
  } else {
    editDialog.value = false;
    searchFormData();
    showMessageFlg.value=true;
    messageText.value="編集成功しました。";
  }
};

const submitAddDialog = async() => {
  // getTableData();
  const formDataReq = new FormData();
  formDataReq.append("patientCode", addForm.value.patientCode);
  formDataReq.append("patientName", addForm.value.patientName);
  const res: any = await addPatient(formDataReq);
  if(!res.result.success){
    showWarningFlg.value=true;
    messageWarning.value=res.result.message;
  } else {
    addDialog.value = false;
    searchFormData();
    showMessageFlg.value=true;
    messageText.value="新規追加成功しました。";
  }
};


const submitDelDialog = async()  => {
  // getTableData();
  const formDataReq = new FormData();
  formDataReq.append("id", delForm.value.id);
  const res: any = await delPatient(formDataReq);
  if(!res.result.success){
    showWarningFlg.value=true;
    messageWarning.value=res.result.message;
  } else {
    delDialog.value = false;
    searchFormData();
    showMessageFlg.value=true;
    messageText.value="削除成功しました。";
  }
};

const onResize =  (event) => {
      console.log('Resizing: ', event);
    };

const onDrag = (event) =>{
      x.value = event.x;
      y.value = event.y;
    };

const stopPropagation = (e) => {
  e.stopPropagation();
};
</script>

<template>
  <v-app-bar color="light-blue" class="pl-4" title="患者管理"></v-app-bar>
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
                  <v-text-field
                    v-model = "searchForm.patientCode"
                    label="患者ID"
                    variant="outlined"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    clear-icon="mdi-backspace-outline"
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    v-model = "searchForm.patientName"
                    label="患者名"
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
  
    <v-btn class="my-8" color="cyan" variant="outlined" @click="openAddDialog()" @close="addDialog = false">
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
          <th class="text-left" v-show="false">ID</th>
          <th class="text-left" >患者ID</th>
          <th class="text-left">患者名</th>
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
          <td v-show="false">{{ item.id}}</td>
          <td>{{ item.patientCode}}</td>
          <td>{{ item.patientName}}</td>
          <td>
            <v-btn variant="text" @click="openEditDialog(item, index, true)" @close="editDialog = false">
              <v-icon class="ma-2 text-grey" icon="mdi-pencil-outline"></v-icon>
            </v-btn>
            <v-btn variant="text" @click="openDelDialog(item, index, false)">
              <v-icon class="ma-2 text-grey" icon="mdi-delete"></v-icon>
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
    <vue-draggable-resizable :w="400" :h="400" :x="x" :y="y" @resizing="onResize" @dragging="onDrag">
      <v-card >
        <div class="px-6 py-3 d-flex align-center justify-space-between">
          <span>患者情報編集</span>
          <v-icon class="cursor-pointer" icon="mdi-close" @click="editDialog = false,showWarningFlg=false, Object.keys(editForm).forEach(key => delete editForm[key])"></v-icon>
        </div>
        <v-divider></v-divider>
        <v-form class="pa-3">
          <v-container>
            <v-row>
              <v-col cols="8">
                <v-text-field
                  v-model="editForm.patientCode"
                  label="患者ID"
                  variant="outlined"
                  prepend-inner-icon="mdi-pencil-outline"
                  clearable
                  clear-icon="mdi-backspace-outline"
                  @mousedown:control="stopPropagation"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="8">
                <v-text-field
                  v-model="editForm.patientName"
                  label="患者名"
                  variant="outlined"
                  prepend-inner-icon="mdi-pencil-outline"
                  clearable
                  clear-icon="mdi-backspace-outline"
                  @mousedown:control="stopPropagation"
                ></v-text-field>
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

  <v-dialog v-model="addDialog">
    <vue-draggable-resizable :w="400" :h="400" :x="x" :y="y" @resizing="onResize" @dragging="onDrag">
      <v-card >
        <div class="px-6 py-3 d-flex align-center justify-space-between">
          <span>患者情報追加</span>
          <v-icon class="cursor-pointer" icon="mdi-close" @click="addDialog = false,showWarningFlg=false, Object.keys(addForm).forEach(key => delete addForm[key])"></v-icon>
        </div>
        <v-divider></v-divider>
        <v-form class="pa-3">
          <v-container>
            <v-row>
              <v-col cols="8">
                <v-text-field
                  v-model="addForm.patientCode"
                  label="患者ID"
                  variant="outlined"
                  prepend-inner-icon="mdi-pencil-outline"
                  clearable
                  clear-icon="mdi-backspace-outline"
                  @mousedown:control="stopPropagation"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="8">
                <v-text-field
                  v-model="addForm.patientName"
                  label="患者名"
                  variant="outlined"
                  prepend-inner-icon="mdi-pencil-outline"
                  clearable
                  clear-icon="mdi-backspace-outline"
                  @mousedown:control="stopPropagation"
                ></v-text-field>
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
                  @click="submitAddDialog"
                  >保存
                </v-btn>
                <v-btn class="ml-3 float-right" 
                prepend-icon="mdi-backspace-outline"
                variant="text" @click="addDialog = false,showWarningFlg=false, Object.keys(addForm).forEach(key => delete addForm[key])">取消</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card>
    </vue-draggable-resizable>
  </v-dialog>


  <v-dialog v-model="delDialog">
    <vue-draggable-resizable :w="400" :h="400" :x="x" :y="y" @resizing="onResize" @dragging="onDrag">
      <v-card >
        <div class="px-6 py-3 d-flex align-center justify-space-between">
          <span>患者情報削除</span>
          <v-icon class="cursor-pointer" icon="mdi-close" @click="delDialog = false,showWarningFlg=false, Object.keys(delForm).forEach(key => delete delForm[key])"></v-icon>
        </div>
        <v-divider></v-divider>
        <v-form class="pa-3">
          <v-container>
            <v-row>
              <v-col cols="8">
                <v-text-field
                  v-model="delForm.patientCode"
                  label="患者ID"
                  variant="outlined"
                  :readonly=true
                  prepend-inner-icon="mdi-pencil-outline"
                  @mousedown:control="stopPropagation"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="8">
                <v-text-field
                  v-model="delForm.patientName"
                  label="患者名"
                  variant="outlined"
                  :readonly=true
                  prepend-inner-icon="mdi-pencil-outline"
                  @mousedown:control="stopPropagation"
                ></v-text-field>
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
                  @click="submitDelDialog"
                  >削除
                </v-btn>
                <v-btn class="ml-3 float-right" 
                prepend-icon="mdi-backspace-outline"
                variant="text" @click="delDialog = false,showWarningFlg=false, Object.keys(delForm).forEach(key => delete delForm[key])">取消</v-btn>
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
