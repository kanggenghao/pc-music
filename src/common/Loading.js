import {Loading } from "element-ui";
let loading;
export function startLoading(text="拼命加载中...") {
    loading = Loading.service({
      lock: true,
      text,
      background: "rgba(0,0,0,0)",
    });
  }
  export function endLoading() {
    loading.close();
  }
   