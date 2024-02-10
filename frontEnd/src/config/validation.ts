import * as Setting from "@/config/globalSetting";
import * as ReportItem from "@/config/reportEditItems";

const validate = {
  required: (value?: string) => (value ? true : "必須項目です"),
  requiredNumbers: (value: number[]) => (value ? (value.length > 0 ? true : "必須項目です") : "必須項目です"),
  tagNameRequired: (value?: string) => (value == undefined ? true : value ? true : "必須項目です"),
  departmentNameRequired: (value?: string) => (value == undefined ? true : value ? true : "必須項目です"),
  number: (value: number) => (value ? true : "数字を入力してください。"),
  imageRequired: (value: File[]) => (value && value.length > 0 ? true : "必須項目です"),
  imageExtension: (value: File[]) => {
    if (!value || value.length === 0) {
      return true;
    }
    const ext = value[0].name.split(".").pop();
    if (!ext) {
      return false;
    }
    return ReportItem.UPLOAD_IMAGE_EXTENTION.indexOf(`.${ext.toLowerCase()}`) > -1
      ? true
      : `ファイルは [ ${ReportItem.UPLOAD_IMAGE_EXTENTION}] のいずれかを選択してください。`;
  },
  sourceExtension: (value: File[]) => {
    if (!value || value.length === 0) {
      return true;
    }
    const ext = value[0].name.split(".").pop();
    if (!ext) {
      return false;
    }
    return ReportItem.UPLOAD_SOURCE_EXTENTION.indexOf(`.${ext.toLowerCase()}`) > -1
      ? true
      : `ファイルは [ ${ReportItem.UPLOAD_SOURCE_EXTENTION} ] のいずれかを選択してください。`;
  },
  max255: (value?: string) => {
    if (!value) {
      return true;
    }
    return value.length <= Setting.MAX_TEXT_LENGTH ? true : `${Setting.MAX_TEXT_LENGTH}文字以内で入力してください。`;
  },
  maxVarchar: (value: string) =>
    value.length <= Setting.MAX_VARCHAR_LENGTH ? true : `${Setting.MAX_VARCHAR_LENGTH}文字以内で入力してください。`,
  maxSize: (value?: File[]) => {
    if (!value) {
      return true;
    }
    if (value.length === 0) {
      return true;
    }
    return value[0].size <= Setting.MAX_UPLOAD_FILE_SIZE ? true : "ファイル容量が大きすぎます。上限は10MBです。";
  },
  reportEditPassword: (value: string) => {
    // パスワードの条件
    // パスワードに使用できる文字 +-@!$%().,:;[]_{}~<>
    // 「+」、「-」、「@」、「!」、「$」、「%」、「(」、「)」、「.」、「,」、「:」、「;」、「[」、「]」、「_」、「{」、「}」、「~」、「<」、「>」
    // 4文字以上255文字未満
    if (!value.match(new RegExp("^[a-zA-Z0-9+\\-@!$%()\\.,:;\\[\\]_{}~<>]{1,}$")))
      return "パスワードに使用できない文字が存在します。";
    if (!value.match(new RegExp("^[a-zA-Z0-9+\\-@!$%()\\.,:;\\[\\]_{}~<>]{4,}$")))
      return "編集パスワードは4文字以上で入力してください。";
    if (!value.match(new RegExp("^[a-zA-Z0-9+\\-@!$%()\\.,:;\\[\\]_{}~<>]{4,255}$")))
      return "編集パスワードは255文字以下で入力してください。";

    return true;
  },
};

export default validate;
