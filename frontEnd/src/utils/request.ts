import axios from "axios";
import router from "../router";
// import { useStore } from "../store/store";

// import { showErrMsg } from "./showMsgBox";
// import loginOut from "../commonMethod/loginOut";

// const CancelToken = axios.CancelToken
export const requestMap = new Map(); // リクエストプール

let finishFlg = true;

export const request = (options: any) => {
  // const store = useStore();
  return new Promise((resolve, reject) => {
    // axiosの作成
    const service = axios.create({
      baseURL: import.meta.env.VITE_APP_API_URL,
      withCredentials: true,
    });

    // リクエストストッパ
    service.interceptors.request.use(
      (config: any) => {
        // タイムアウトチェック必要ない場合
        if (config.isSkipTimeOut) {
          config.timeout = 0;
        } else {
          // タイムアウトチェック必要ある場合
          // config.timeout = store.timeout;
        }

        const token: string | null = sessionStorage.getItem("token");
        const userId: string | null = sessionStorage.getItem("userId");

        if (token) {
          config.headers["X-Access-Token"] = token;
          config.headers["USERID"] = userId;

          config.headers.Authorization = +token;
        }

        // store.loading = true;

        return config;
      },
      (error) => {
        // 失敗した実行を要求するイベント
        console.log("request error", error);

        Promise.reject(error);
      }
    );

    // レスポンスブロック
    service.interceptors.response.use(
      async (response: any) => {
        // リクエスト uniqueCode取得
        const uniqueCode =
          response.config.method.toLowerCase() +
          response.config.baseURL +
          response.config.url;

        // 存在するリクエストを消す
        if (requestMap.get(uniqueCode)) {
          requestMap.delete(uniqueCode);
        }

        // 正常終了の場合
        if (response.data.success) {
          if (response.data.code == 0) {
            if (response.data.message) {
              // store.business.time += 1;
              // store.business.message = response.data.message;
            }
          } else if (response.data.code == 1) {
            // CONFIRMなどの個別処理
            console.log("個別処理");
          }
        } else {
          // 異常終了の場合
          if (response.data.code == 9) {
            // 業務エラー処理
            // store.businessErr.time += 1;
            // (store.businessErr.errorCode as any) = response.data.errorCode;
            // store.businessErr.message = response.data.message;
          } else if (Number(response.data.code) == 401) {
            // showErrMsg("タイムアウトしました、再度ログインしてください");
            // loginOut(router);
            return;
          }
        }

        finishFlg = true;
        // store.loading = false;
        return response.data;
      },

      async (error) => {
        // リクエスト uniqueCode取得
        const uniqueCode =
          error.config.method.toLowerCase() +
          error.config.baseURL +
          error.config.url;
        // 存在するリクエストを消す
        if (requestMap.get(uniqueCode)) {
          requestMap.delete(uniqueCode);
        }
        if(error.code == "ECONNABORTED"){
          // showErrMsg("タイムアウトが発生しました。再度操作を行ってください。");
          // store.loading = false;
          return new Promise(() => ({}));
        }
        if (Number(error.response.status) == 401) {
          // showErrMsg("タイムアウトしました、再度ログインしてください");
          // loginOut(router);
          return new Promise(() => ({}));
        }

        // 504エラーの場合は飛ばす（CloudFrontからの504エラー）
        // サーバーはゲートウェイまたはプロキシとして機能しますが、アップストリーム サーバーからリクエストを時間内に受信しませんでした。
        if (error.response.status == 504) {
          return new Promise(() => ({}));
        }

        finishFlg = true;
        // store.loading = false;

        // スキップパスの処理
        let path = "/error/sysError";
        // ジャンプリンクを表示するかどうか / リンクのパスをジャンプの処理
        let showStatus = 0;
        // リクエストパスに「login」「stripe」が含まれている場合の処理
        if (error.config.url.includes("/login")) {
          path = "/membership/error";
          showStatus = 2;
        } else if (
          error.config.url.includes("/stripe") ||
          error.config.url.includes("/encode")
        ) {
          path = "/membership/error";
          showStatus = 1;
        }

        router.push({
          path: path,
          query: {
            showStatus,
          },
        });

        return Promise.reject(error);
      }
    );

    service(options)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default request;
