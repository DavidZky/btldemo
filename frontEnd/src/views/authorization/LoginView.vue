<script setup lang="ts">
import validate from "@/config/validation";
import { useRouter } from "vue-router";

// import repository from "@/apis/repositoryFactory";
// import useUserInfoStore from "@/stores/user";
// import { loginStatus } from "@/config/resetPwdViewItem";
// import axios from "axios";
// const userStore = useUserInfoStore();

import { useField } from "vee-validate";
const router = useRouter();
const {
  value: userName,
  errorMessage: userNameError,
  meta: userNameMeta,
} = useField("editPassword", [validate.required]);

const {
  value: password,
  errorMessage: editPasswordError,
  meta: editPasswordMeta,
} = useField("editPassword", [validate.required]);

const disabledSave = (): boolean => {
  return !editPasswordMeta.valid || !userNameMeta.valid;
};

const login = () => {
  if (!userName.value) {
    return;
  }
  if (!password.value) {
    return;
  }
  const params = `username=${userName.value}&password=${encodeURIComponent(password.value)}`;
  localStorage.setItem("token", "123");
  router.push("/");
  // const resToken = await repository.user.userLogin(params);
  // if (resToken.status === axios.HttpStatusCode.Ok) {
  //   await userStore.get(resToken.data.access_token);
  //   //仮パスワード時、パスワード更新の画面遷移
  //   if (userStore.$state.success.password_status === loginStatus[0].value) {
  //     sessionStorage.setItem("token", resToken.data.access_token);
  //     router.push("./resetInitPassword");
  //     if (userStore.$state.success.counter !== 0) {
  //       counterZero(userStore.$state.success.id);
  //     }
  //   } else {
  //     localStorage.setItem("token", resToken.data.access_token);
  //     router.push("./");
  //     if (userStore.$state.success.counter !== 0) {
  //       counterZero(userStore.$state.success.id);
  //     }
  //   }
  // } else {
  //   localStorage.removeItem("token");
  // }
};
// counter:0を設定する
// const counterZero = async (userId: number) => {
//   const res = await repository.user.unlockUser(userId);
//   if (res.status === axios.HttpStatusCode.Ok) {
//     console.info("counter:0を設定されました。");
//   }
// };
</script>

<template>
  <div class="fill-height w-100 bg-blue">
    <v-container class="fill-height justify-center login">
      <v-row justify="center" class="h-100" align="center">
        <v-col lg="5" sm="8" xl="7">
          <v-card elevation="10" rounded="lg">
            <v-row>
              <v-col lg="12" align="center">
                <div class="dress-image pt-sm-12 pb-sm-0 pl-sm-12 pr-sm-12">
                  <v-img src="loginLogo.png" width="200" class="rounded-shaped" />
                </div>
                <div class="dress-subtitle mb-5">患者管理システム</div>
              </v-col>
              <v-col lg="12">
                <div class="pa-7 pt-sm-0 pb-sm-12 pl-sm-12 pr-sm-12">
                  <v-form>
                    <div class="mt-2 mb-2">ユーザー</div>
                    <v-text-field
                      v-model="userName"
                      name="username"
                      variant="outlined"
                      density="comfortable"
                      clearable
                      clear-icon="mdi-backspace-outline"
                      :error="!!userNameError"
                      :error-messages="userNameError"
                    ></v-text-field>
                    <div class="mt-2 mb-2">パスワード</div>
                    <v-text-field
                      v-model="password"
                      name="password"
                      density="comfortable"
                      clearable
                      clear-icon="mdi-backspace-outline"
                      type="password"
                      :error="!!editPasswordError"
                      :error-messages="editPasswordError"
                      variant="outlined"
                      autocomplete="on"
                    ></v-text-field>
                    <v-btn
                      :disabled="disabledSave()"
                      color="primary"
                      class="w-100 mt-4"
                      size="x-large"
                      variant="flat"
                      @click="login"
                      >ログイン
                    </v-btn>
                  </v-form>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
